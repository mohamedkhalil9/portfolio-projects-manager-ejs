import express from "express";
import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import profileRouter from "./profileRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/profile", profileRouter);

export default router;
