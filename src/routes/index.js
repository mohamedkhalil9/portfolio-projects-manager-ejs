import express from "express";
import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import profileRouter from "./profileRoutes.js";
import projectRouter from "./projectRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/profile", profileRouter);
router.use("/projects", projectRouter);

export default router;
