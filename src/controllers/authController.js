import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/verifyToken.js";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    gender,
    dateOfBirth,
    phone,
    country,
    address,
  } = req.body;

  const user = await User.findOne({ email: email });
  if (user) throw new AppError("user aleardy existed", 409);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    profileImg: `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}`,
    role,
    gender,
    dateOfBirth,
    phone,
    country,
    address,
  });

  res.status(201).json({ status: "success", data: newUser });
});

export const login = asyncHandler(async (req, res) => {
  const email = req.body.email ?? req.user.email;

  const user = await User.findOne({ email: email });
  if (!user) throw new AppError("invalid email or password", 401);

  if (req.body.password) {
    const { password } = req.body;
    if (!user.password) throw new AppError("invalid email or password", 401);
    await user.isValidPassword(password);
  }

  const payload = { id: user._id };
  const accessToken = user.generateAccessToken(payload);
  const refreshToken = user.generateRefreshToken(payload);
  user.token = refreshToken;
  await user.save();
  const newUser = { ...user._doc };
  delete newUser.password;

  res
    .status(200)
    .cookie("access", accessToken, {
      httpOnly: true,
      signed: true,
      // secure: true,
      // sameSite: "strict",
      maxAge: 1000 * 60 * 5 * 12,
    })
    .cookie("refresh", refreshToken, {
      httpOnly: true,
      signed: true,
      // secure: true,
      // sameSite: "strict",
      // path: "/api/v1/auth/refresh-token",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    // .json({
    //   status: "success",
    //   data: {
    //     accessToken,
    //     refreshToken,
    //     user: newUser,
    //   },
    // });
    .redirect("/api/v1/profile");
});

export const newToken = asyncHandler(async (req, res) => {
  const token = req.signedCookies.refresh || req.headers.authorization;
  if (!token) throw new AppError("token is required", 401);

  const decoded = verifyToken(token, process.env.REFRESH_SECRET);
  const user = await User.findById(decoded.id);

  if (!token === user.token) throw AppError("invalid token", 401);
  const payload = { id: user.id };
  const accessToken = await user.generateAccessToken(payload);
  res
    .status(200)
    .cookie("access", accessToken, {
      httpOnly: true,
      signed: true,
      // secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 5,
    })
    .json({ status: "success", accessToken });
});

export const logout = async (req, res) => {
  const token = req.signedCookies.refresh || req.headers.authorization;
  if (!token) res.sendStatus(204).redirect("/api/v1/auth/login");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_SECRET);
  } catch (error) {
    return new AppError("invalid token", 401);
  }
  const user = await User.findByIdAndUpdate(decoded.id, { token: undefined });
  res
    .status(200)
    .clearCookie("access", {
      httpOnly: true,
      signed: true,
    })
    .clearCookie("refresh", {
      httpOnly: true,
      signed: true,
    })
    .redirect("/api/v1/auth/login");
  // .json({ status: "success" });
};

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError("user not found", 404);

  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  user.otp = hashedOtp;
  user.otpExpire = Date.now() + 1000 * 60 * 5;
  await user.save();

  sendResetEmail(email, otp);

  res
    .status(200)
    .cookie("reset", email, {
      httpOnly: true,
      signed: true,
      // secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 5,
    })
    // .json({
    //   status: "success",
    //   message: "email sent successfully",
    //   data: null,
    // })
    .redirect("/api/v1/auth/verify-otp");
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const email = req.signedCookies.reset ?? req.body.email;

  const user = await User.findOne({ email });
  if (!user || !user.otp) throw new AppError("user is not found", 404);

  const isMatch = await bcrypt.compare(otp, user.otp);
  if (Date.now() > user.otpExpire || !isMatch)
    throw new AppError("OTP Code is not valid", 409);

  user.otpVerified = true;
  await user.save();

  res
    .status(200)
    // .json({ status: "success", data: null });
    .redirect("/api/v1/auth/reset-password");
});

export const resetPassword = asyncHandler(async (req, res) => {
  const email = req.signedCookies.reset ?? req.body.email;
  const { password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError("user is not found", 404);

  if (!user.otpVerified || Date.now() > user.otpExpire)
    throw new AppError("otp is not verified", 401);

  user.password = password;
  user.otp = undefined;
  user.otpExpire = undefined;
  user.otpVerified = undefined;
  await user.save();

  res
    .status(200)
    .json({ status: "success", message: "Password Updated", data: null });
});
