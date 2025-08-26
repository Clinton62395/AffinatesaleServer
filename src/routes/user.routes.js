import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/users.controller.js";
import {
  bankDetails,
  createWithdrawalPin,
  passwordUdapte,
  withdrawalPinUpdate,
} from "../controllers/bankDetails.controller.js";
import { userComment } from "../controllers/review.controller.js";
// Main route
const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);

// bank detail route
router.put("/bank", verifyToken, bankDetails);

// password updated route
router.put("/password-update", verifyToken, passwordUdapte);

// create withdral pin route
router.post("/create-pin", verifyToken, createWithdrawalPin);

// withdrawal pin updated route
router.patch("/withdrawal-pin", verifyToken, withdrawalPinUpdate);

// review for  users comment  controller

router.post("/classroom-review/:courseId", verifyToken, userComment);

export default router;
