import express from "express";
import {
  register,
  login,
  loginDashboard,
  verifyOtp,
  protectedRoute,
} from "../controller/auth.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login-dashboard", loginDashboard);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/verifyToken", verifyToken, protectedRoute);

export default router;
