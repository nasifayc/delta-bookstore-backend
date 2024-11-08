import UserModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import {
  generateAcessToken,
  generateRefreshToken,
} from "../services/auth.service.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code for registration is ${otp}`, // Plain text version
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">Welcome to Our Service!</h2>
        <p>Dear User,</p>
        <p>Thank you for registering with us. Please use the following OTP code to complete your registration:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #4CAF50; border: 2px solid #4CAF50; padding: 10px 20px; border-radius: 5px;">
            ${otp}
          </span>
        </div>
        <p style="color: #666;">This code is valid for 15 minutes. If you didn’t request this, please ignore this email.</p>
        <p>Best regards,<br>The Support Team</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <footer style="text-align: center; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} Our Company, Inc. All rights reserved.
        </footer>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password, email, phone } = req.body;
    const otp = generateOtp();

    const newUser = new UserModel({
      username,
      password,
      email,
      phone,
    });

    newUser.setOtp(otp);
    await newUser.save();

    await sendOTP(email, otp);

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

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const isValidOtp = user.verifyOtp(otp);
    if (!isValidOtp)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    await user.save(); // Save the user's verified status
    res.status(200).json({ message: "Email verified successfully" });
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
