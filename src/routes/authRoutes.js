import express from "express";
import {
  register,
  login,
  logout,
  newToken,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";
import {
  loginSchema,
  registerSchema,
  resetPassSchema,
} from "../validation/schemas.js";
import { validateBody } from "../middlewares/validatorMiddleware.js";
import passport from "passport";
import "../config/passport.js";

const router = express.Router();

router.route("/register").post(validateBody(registerSchema), register);
router.route("/login").post(validateBody(loginSchema), login);
router.route("/logout").post(logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: false,
  }),
  login,
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  }),
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: false }),
  login,
);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.patch("/reset-password", validateBody(resetPassSchema), resetPassword);

router.route("/refresh-token").post(newToken);

export default router;
