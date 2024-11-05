import express from "express";
import {
  register,
  login,
  protectedRoute,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verifyToken", verifyToken, protectedRoute);

export default router;
