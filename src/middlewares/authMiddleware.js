import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/verifyToken.js";

const authenticate = (req, res, next) => {
  // NOTE: bearer token
  const token = req.headers.authorization || req.signedCookies.access;
  if (!token) throw new AppError("token is required", 401);

  const decodedPayload = verifyToken(token, process.env.ACCESS_SECRET);
  req.user = decodedPayload;
  next();
};

const authorize = (...roles) => {
  return async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);
    const role = user.role;

    if (!roles.includes(role)) return next(new AppError("access denied", 403));
    next();
  };
};

export { authenticate, authorize };
