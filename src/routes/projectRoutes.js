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
const project = {
  name: "test project",
  description: "a project to show case the edit view",
  url: "https://github.com/JWT-Auth-node.git",
  tags: ["js", "node"],
};
router.get("/view", (req, res) => res.render("projects/view-projects-2"));
router.get("/add", (req, res) => res.render("projects/add-project"));
router.get("/edit", (req, res) =>
  res.render("projects/edit-project", { project }),
);
router.get("/single", (req, res) => res.render("projects/view-project"));
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
