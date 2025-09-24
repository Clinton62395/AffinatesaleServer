import express from "express";
import {
  register,
  socialRegister,
  TestLogin,
  userLogin,
} from "../controllers/auth.controller.js";
import { validateLoginInput } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", userLogin);
router.post("/test-login", validateLoginInput, TestLogin);

// firebase google registration

router.post("/google", socialRegister);

export default router;
