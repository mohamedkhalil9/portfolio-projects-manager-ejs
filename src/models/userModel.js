import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: String,
    password: {
      type: String,
      // required: true,
    },
    profileImg: {
      type: String,
      // defalut: function () {
      //   return `https://eu.ui-avatars.com/api/?name=${this.firstName}+${this.lastName}`;
      // },
    },
    role: {
      type: String,
      enum: ["USER", "MANAGER", "ADMIN"],
      default: "USER",
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    dateOfBirth: Date,
    phone: String,
    country: String,
    address: String,
    verifed: Boolean,
    token: String,
    otp: String,
    otpExpire: Date,
    otpVerifed: Boolean,
    googleId: String,
    githubId: String,
    provider: {
      type: String,
      enum: ["google", "github"],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isValidPassword = async function (password) {
  const valid = await bcrypt.compare(password, this.password);
  if (!valid) throw new AppError("ivalid email or password", 401);
};

userSchema.methods.generateAccessToken = (payload) => {
  const token = jwt.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: "5m",
  });
  return token;
};
userSchema.methods.generateRefreshToken = (payload) => {
  const token = jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "1w",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
