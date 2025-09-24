import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getDashboardStats,
  updateProfilePicture,
} from "../controllers/users.controller.js";
import {
  bankDetails,
  createWithdrawalPin,
  passwordUdapte,
  withdrawalPinUpdate,
} from "../controllers/bankDetails.controller.js";
import { userComment } from "../controllers/review.controller.js";
import {
  changePasswordDashboard,
  resetPassword,
  updatePassword,
} from "../controllers/password.controller.js";
import { upload, uploadFile } from "../controllers/uploadfile.controller.js";
import { fetchDashboardStistics } from "../controllers/userInfo.controller.js";
import { updateNewField } from "../scripts/update.js";
import { refreshTokenController } from "../controllers/auth.controller.js";
import {
  fetchUserByAccountNumber,
  transferBetweenUsers,
} from "../utils/helpers.js";
// Main route
const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);

// bank detail route
router.patch("/bank", verifyToken, bankDetails);

// password updated route
router.put("/password-update", verifyToken, passwordUdapte);

// password updated route through dashboard
router.put("/dashboard-password-update", verifyToken, changePasswordDashboard);

// create withdral pin route
router.post("/create-pin", verifyToken, createWithdrawalPin);

// route to fetch user information from database

router.get("/fetch-dashboard-statistic", verifyToken, fetchDashboardStistics);

router.put("/update-all-users-fields", updateNewField);

// withdrawal pin updated route
router.patch("/withdrawal-pin", verifyToken, withdrawalPinUpdate);

// review for  users comment  controller

router.post("/classroom-review/:courseId", verifyToken, userComment);

// route for file uplaod to cloudinary

router.post("/upload-file", upload.single("file"), uploadFile);

// reset password route
router.post("/reset-password", resetPassword);

// update passord route
router.patch("/update-password", updatePassword);

// refresh token route
router.post("/refresh-token", refreshTokenController);

// route to update user profile picture
router.put("/profile-picture", verifyToken, updateProfilePicture);

// transfer between users
router.post("/transfer", verifyToken, transferBetweenUsers);

// route to fetch user by his account number
router.get("/transfer/:accountNo", verifyToken, fetchUserByAccountNumber);

export default router;
