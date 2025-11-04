// backend/server/routes/admin.routes.js
import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.js";
import {
  approveCandidate,
  rejectCandidate,
  toggleDisqualified,
} from "../controllers/candidate.controller.js";
import {
  getResults,
  publishResults,
  unpublishResults,
} from "../controllers/results.controller.js";
import { onlyAllowGroupForAdmin } from "../middlewares/adminGroupGuard.js";

const router = express.Router();

const ANY_ADMIN = [
  "superadmin",
  "admin",
  "studentAdmin",
  "teacherAdmin",
  "nonTeachingAdmin",
];

/**
 * Candidate moderation
 */
router.patch(
  "/candidates/:id/approve",
  protect,
  authorizeRoles(...ANY_ADMIN),
  approveCandidate
);

router.patch(
  "/candidates/:id/reject",
  protect,
  authorizeRoles(...ANY_ADMIN),
  rejectCandidate
);

router.patch(
  "/candidates/:id/disqualify",
  protect,
  authorizeRoles(...ANY_ADMIN),
  toggleDisqualified
);

/**
 * ✅ Admin results — LIVE results + publish/unpublish
 * /api/admin/results/live (alias)
 * /api/admin/results
 * /api/admin/results/publish
 * /api/admin/results/unpublish
 */

router.get(
  ["/results", "/results/live"], // support both
  protect,
  authorizeRoles(...ANY_ADMIN),
  onlyAllowGroupForAdmin("query"),
  getResults
);

router.post(
  "/results/publish",
  protect,
  authorizeRoles(...ANY_ADMIN),
  onlyAllowGroupForAdmin("body"),
  publishResults
);

router.post(
  "/results/unpublish",
  protect,
  authorizeRoles(...ANY_ADMIN),
  onlyAllowGroupForAdmin("body"),
  unpublishResults
);

export default router;
