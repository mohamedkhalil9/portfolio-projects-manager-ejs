import jwt from "jsonwebtoken";
import AppError from "./AppError.js";

export const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new AppError("invalid token", 401);
  }
};
