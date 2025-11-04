import express from "express";
import { protect } from "../middlewares/auth.js";
import { castVote, myVote } from "../controllers/vote.controller.js";

const router = express.Router();

router.post("/", protect, castVote);
router.get("/my", protect, myVote);

export default router;
