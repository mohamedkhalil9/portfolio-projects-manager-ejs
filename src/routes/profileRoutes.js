import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  sendEmailVerification,
  verifyEmail,
  updatePassword,
  uploadProfileImage,
  editProfileView,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { updatePassSchema, updateUserSchema } from "../validation/schemas.js";
import { validateBody } from "../middlewares/validatorMiddleware.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.use(authenticate);
router.get("/edit", editProfileView);
router
  .route("/")
  .get(getUserProfile)
  .post(validateBody(updateUserSchema), updateUserProfile)
  .delete(deleteProfile);

router.get("/verify-email", authenticate, sendEmailVerification);
router.get("/verify-email/:token", verifyEmail);

router
  .route("/update-password")
  .patch(validateBody(updatePassSchema), updatePassword);

router.route("/upload").post(upload.single("image"), uploadProfileImage);

export default router;
