import express from "express";
import {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { mongoId, updateUserSchema } from "../validation/schemas.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validatorMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.route("/").get(authorize("MANAGER", "ADMIN"), getUsers);
// router
//   .route("/list")
//   .get(authorize("MANAGER", "ADMIN"), (req, res) => res.render("admin/users"));

router
  .route("/:id")
  .get(authorize("MANAGER", "ADMIN"), validateParams(mongoId), getUser)
  .delete(authorize("ADMIN"), validateParams(mongoId), deleteUser)
  .patch(
    authorize("ADMIN"),
    validateParams(mongoId),
    validateBody(updateUserSchema),
    updateUser,
  );

export default router;
