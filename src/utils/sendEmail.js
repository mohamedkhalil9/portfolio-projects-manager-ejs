import nodemailer from "nodemailer";
import asyncHandler from "../middlewares/asyncHandler.js";
import { verifyTmp, resetTmp } from "./templates.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const sendEmail = asyncHandler(async (email, subject, tmp) => {
  const options = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: tmp,
  };
  // await transporter.verify();
  const res = await transporter.sendMail(options);
  return res;
});

export const sendVerifyEmail = (email, token) => {
  const verifyTemplate = verifyTmp(token);
  sendEmail(email, "Verify Email", verifyTemplate);
};

export const sendResetEmail = (email, otp) => {
  let resetTemplate = resetTmp;
  resetTemplate = resetTemplate.replace(/{{OTP_CODE}}/g, otp);
  for (let i = 0; i < 6; i++) {
    resetTemplate = resetTemplate.replace(`{{DIGIT_${i + 1}}}`, otp[i]);
  }
  sendEmail(email, "Reset Password", resetTemplate);
};
