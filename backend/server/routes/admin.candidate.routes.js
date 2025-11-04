import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.js";
import {
  adminListCandidates,
  adminApproveCandidate,
  adminRejectCandidate,
  adminToggleDisqualified,
} from "../controllers/admin.candidate.controller.js";

const router = express.Router();

/** Accept either array or spread in your authorizeRoles implementation */
const ADMIN_ROLES = ["superadmin", "admin", "studentAdmin", "teacherAdmin", "nonTeachingAdmin"];
const guard = [protect, authorizeRoles(ADMIN_ROLES)];

router.get("/", guard, adminListCandidates);
router.patch("/:id/approve", guard, adminApproveCandidate);
router.patch("/:id/reject", guard, adminRejectCandidate);

// support BOTH paths: /toggle-disqualified (preferred) and /disqualify (your UI uses this)
router.patch("/:id/toggle-disqualified", guard, adminToggleDisqualified);
router.patch("/:id/disqualify", guard, adminToggleDisqualified);

export default router;
