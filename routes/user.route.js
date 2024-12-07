import express from "express";
import { userData } from "../controllers/user.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/data", checkAuth, userData);

export default router;
