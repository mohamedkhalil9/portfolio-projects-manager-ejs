import { Router } from "express";

import {
  createProject,
  getProjects,
  getProject,
  deleteProject,
  updateProject,
  getCurrentUserProjects,
} from "../controllers/projectController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { mongoId, updateProjectSchema } from "../validation/schemas.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validatorMiddleware.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.route("/public").get(getProjects);
router.use(authenticate);

router.get("/view", (req, res) => res.render("projects/view-projects"));
router.route("/").get(getCurrentUserProjects).post(createProject);

router
  .route("/:id")
  .get(validateParams(mongoId), getProject)
  .patch(
    validateParams(mongoId),
    validateBody(updateProjectSchema),
    updateProject,
  )
  .delete(validateParams(mongoId), deleteProject);

export default router;
