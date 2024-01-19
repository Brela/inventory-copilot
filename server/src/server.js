import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CORS_ORIGINS, PORT } from "./config/envConfig.js";
import { validateUser } from "./middleware/validateUser.js";

import inventoryRoutes from "./modules/inventory/routes.js";
import ordersRoutes from "./modules/orders/routes.js";
import userRoutes from "./modules/users/routes.js";
import authenticationRoutes from "./modules/auth/routes.js";
import { authenticateJWT } from "./modules/auth/authenticateJWT.js";

const app = express();

const allowedOrigins = CORS_ORIGINS.split(",");

const corsOptions = {
  // temporarily allow all origins - this didn't resolve iPhone issue
  /*    origin: function (origin, callback) {
    callback(null, true); // Allow all origins
  }, */
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

app.use(cookieParser());

app.use("/authentication", authenticationRoutes);

// for some reason, orders doesn't work when it is after authenticateJWT middleware
app.use("/orders", ordersRoutes);

app.use("/user", userRoutes);

app.use(authenticateJWT);
app.use("/inventory", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
