import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  IS_DEV_MODE,
} from "../../config/envConfig.js";
import { HTTP_STATUS } from "../../config/constants.js";
import { createToken } from "./authUtils.js";
import { authenticateJWT } from "./jwtAuth.js";
import prisma from "../../config/prismaClient.js";

const isDevMode = IS_DEV_MODE === "true";

export const generateAccessToken = (user) =>
  createToken(user, ACCESS_TOKEN_SECRET, "1h", "ACCESS");

export const generateRefreshToken = (user) =>
  createToken(user, REFRESH_TOKEN_SECRET, "7d", "REFRESH");

export const authenticateUser = async (req, res, next) => {
  await authenticateJWT(req, res, next);
  res.json(req.user);
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.User.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "That username doesn't exist" });
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Incorrect password" });
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return res
      .status(HTTP_STATUS.OK)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: !isDevMode,
        sameSite: isDevMode ? "Lax" : "None",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: !isDevMode,
        sameSite: isDevMode ? "Lax" : "None",
      })
      .json({ user, accessToken });
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const getToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED);

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) return res.sendStatus(HTTP_STATUS.FORBIDDEN);

      const accessToken = await generateAccessToken(user);

      res
        .status(HTTP_STATUS.OK)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: !isDevMode,
          sameSite: isDevMode ? "Lax" : "None",
        })
        .json({ accessToken });
    });
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED);

  // Clear the cookies
  res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: !isDevMode, // Only set secure flag in production
      sameSite: isDevMode ? "Lax" : "None", // Important for cross-origin cookies
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: !isDevMode, // Only set secure flag in production
      sameSite: isDevMode ? "Lax" : "None", // Important for cross-origin cookies
    })
    .json({ message: "Successfully logged out" });
};