import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
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
router.post("/send-reset-otp", checkAuth, sendResetOtp);
router.post("/reset-password", checkAuth, resetPassword);
router.get("/is-auth", checkAuth, isAuthenticated);
export default router;
