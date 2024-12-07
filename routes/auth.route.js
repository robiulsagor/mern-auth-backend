import express from "express";
import {
  login,
  logout,
  register,
  sendVerifyOtp,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/send-otp", checkAuth, sendVerifyOtp);
router.post("/verify-otp", checkAuth, verifyOtp);

export default router;
