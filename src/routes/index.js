import express from "express";
import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import profileRouter from "./profileRoutes.js";
import projectRouter from "./projectRoutes.js";
import { getCurrentUserProjects } from "../controllers/projectController.js";
import { attachUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(attachUser);

router.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.isLoggedIn = !!req.user;
  next();
});

router.get("/", (req, res) => res.redirect("/api/v1/auth/login"));
router.use("/auth", authRouter);

router.use("/users", userRouter);
router.use("/profile", profileRouter);
router.use("/:userId/projects", getCurrentUserProjects);
router.use("/projects", projectRouter);

export default router;
