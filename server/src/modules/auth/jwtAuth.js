import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../config/envConfig.js";
import { HTTP_STATUS } from "../../config/constants.js";

export const authenticateJWT = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    // console.log("accessToken:", typeof accessToken);
    if (!accessToken) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
      console.log("err:", err);
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Token expired",
            expiredAt: err.expiredAt,
          });
        } else {
          return res
            .status(HTTP_STATUS.FORBIDDEN)
            .json({ message: "Invalid Token" });
        }
      }
      req.user = user;
      req.user.iatReadable = new Date(user.iat * 1000).toUTCString();
      req.user.expires = new Date(user.exp * 1000).toUTCString();
      console.log("token expires -----1-1-1-1-1-1-1:", req.user.expires);
      next();
    });
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
