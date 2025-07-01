import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { sendVerifyEmail } from "../utils/sendEmail.js";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken } from "../utils/verifyToken.js";
import * as factory from "./factory.js";

export const getProfile = factory.getOne(User, "currentUser");
export const updateProfile = factory.updateOne(User, "currentUser");
export const deleteProfile = factory.deleteOne(User, "currentUser");

export const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).select("-password");
  if (!user) throw new AppError("user not found", 404);
  res
    .status(200)
    // .json({ status: "success", data: user });
    .render("profile/view-profile", { user });
});

export const editProfileView = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).select("-password");
  if (!user) throw new AppError("user not found", 404);
  res.render("profile/edit-profile", { user });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const userData = req.body;
  const user = await User.findByIdAndUpdate(id, userData, { new: true });
  if (!user) throw new AppError("user not found", 404);
  res
    .status(200)
    // .json({ status: "success", data: user });
    .redirect("/api/v1/profile/edit");
});

export const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;
  // NOTE: soft delete
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError("user not found", 404);
  res.status(200).json({ status: "success", data: null });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { password, newPassword } = req.body;

  const user = await User.findById(id);
  if (!user) throw new AppError(`there is no user with id ${id}`, 404);

  await user.isValidPassword(password);

  user.password = newPassword;
  await user.save();

  res.status(200).json({ status: "success", data: user });
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const img = req.file;

  // const upload = await cloudinary.uploader.upload(img.path);
  const upload = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) =>
        error ? reject(error) : resolve(result),
      )
      .end(img.buffer);
  });
  const url = upload.secure_url;

  const user = await User.findByIdAndUpdate(
    id,
    { profileImg: url },
    { new: true },
  ).select("-password");

  res.status(200).json({ status: "success", data: user });
});

export const sendEmailVerification = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) throw new AppError("user not found", 404);

  const token = jwt.sign({ id }, process.env.VERIFY_EMAIL_SECRET, {
    expiresIn: "12h",
  });
  sendVerifyEmail(user.email, token);

  res.status(200).json({
    status: "success",
    message: "email sent successfully",
    data: null,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const decoded = verifyToken(token, process.env.VERIFY_EMAIL_SECRET);
  const user = await User.findByIdAndUpdate(
    decoded.id,
    {
      verified: true,
    },
    { new: true },
  ).select("-password");
  res
    .status(200)
    .json({ status: "success", message: "email verifed", data: user });
});
