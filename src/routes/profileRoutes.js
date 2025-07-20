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
} from "../controllers/profileController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { updatePassSchema, updateUserSchema } from "../validation/schemas.js";
import { validateBody } from "../middlewares/validatorMiddleware.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.get("/edit", authenticate, editProfileView);
// TODO: 1. subdomain get profile
router.route("/:id").get(getUserProfile);

router.use(authenticate);

router.route("/").get(getUserProfile);

// 2. login or register redirect to user full data

// 3. get edit view
// and update post request
router.route("/").post(validateBody(updateUserSchema), updateUserProfile);
router.route("/upload").post(upload.single("image"), uploadProfileImage);

// 4. delete request
router.route("/").delete(deleteUserProfile);

// 5. update password separate and verify email
router
  .route("/update-password")
  .patch(validateBody(updatePassSchema), updatePassword);

router.get("/verify-email", authenticate, sendEmailVerification);
router.get("/verify-email/:token", verifyEmail);

export default router;
