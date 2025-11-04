// backend/server/routes/results.routes.js
import express from "express";
import { getResults } from "../controllers/results.controller.js";

const router = express.Router();

// Public route — anyone can view published results
router.get("/", getResults);

export default router;
