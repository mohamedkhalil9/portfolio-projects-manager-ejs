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
    githubUrl: String,
    likedinUrl: String,
    username: String,
    password: {
      type: String,
      // required: true,
    },
    jobTitle: String,
    bio: String,
    skills: [String],
    education: [
      {
        institute: String,
        from: Date,
        to: Date,
      },
    ],
    experience: [
      {
        corporate: String,
        workedOn: String,
        from: Date,
        to: Date,
      },
    ],

    profileImg: {
      type: String,
      // defalut: function () {
      //   return `https://eu.ui-avatars.com/api/?name=${this.firstName}+${this.lastName}`;
      // },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
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
    verified: Boolean,
    token: String,
    otp: String,
    otpExpire: Date,
    otpVerified: Boolean,
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
    expiresIn: "1h",
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
