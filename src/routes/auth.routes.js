import express from "express";
import {
  register,
  socialRegister,
  userLogin,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", userLogin);

// firebase google registration

router.post("/google", socialRegister);

export default router;
