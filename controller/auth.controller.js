import UserModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import {
  generateAcessToken,
  generateRefreshToken,
} from "../services/auth.service.js";

export const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password, email, phone } = req.body;
    const newUser = new UserModel({
      username,
      password,
      email,
      phone,
    });
    await newUser.save();

    const accessToken = generateAcessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.status(200).json({
      message: "user registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = generateAcessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(200).json({
      message: "user logged in successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const protectedRoute = (req, res) => {
  // At this point, `req.user` contains the decoded token data (thanks to `verifyToken` middleware)
  res.status(200).json({
    message: "Access granted to protected route",
    user: req.user, // Include user information extracted from the token
  });
};
