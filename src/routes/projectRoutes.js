import { Router } from "express";
import {
  createProject,
  // getCurrentUserProjects,
  getProject,
  editProjectView,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { mongoId, updateProjectSchema } from "../validation/schemas.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validatorMiddleware.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.get("/add", authenticate, (req, res) =>
  res.render("projects/add-project"),
);
router.route("/:id").get(validateParams(mongoId), getProject);

router.use(authenticate);

// TODO: 1. get projects on subdomain
// 2. add new project view
// --> create project request
// 3. view single project
// 4. on login edit project view
// --> update post request
// 5. delete request

router.route("/").post(createProject);

// router.route("/").get(getCurrentUserProjects);

router.get("/:id/edit", editProjectView);
router.route("/:id").post(
  validateParams(mongoId),
  // validateBody(updateProjectSchema),
  updateProject,
);

router.route("/:id/delete").post(validateParams(mongoId), deleteProject);

export default router;
