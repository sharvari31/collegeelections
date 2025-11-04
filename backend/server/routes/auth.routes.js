import express from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Public routes
router.post("/register", register);
router.post("/login", login);

// ✅ Protected route
router.get("/me", protect, me);

export default router;
