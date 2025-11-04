// backend/server/routes/candidate.routes.js
import express from "express";
import {
  listCandidates,
  listAllCandidates,
  seedCandidates,
  applyCandidate,
  myApplications,
} from "../controllers/candidate.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Voter-facing list (role + position)
router.get("/", protect, listCandidates);

// Admin list (optionally filtered)
router.get("/all", protect, listAllCandidates);

// Candidate self-service
router.post("/apply", protect, applyCandidate);
router.get("/mine", protect, myApplications);

// Dev helper: seed defaults
router.post("/seed", seedCandidates);

export default router;
