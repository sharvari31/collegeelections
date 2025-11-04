import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.js";
import { createRequest, listRequests, approveRequest, rejectRequest } from "../controllers/candidateRequest.controller.js";

const router = express.Router();

// Candidate submits their profile/manifesto
router.post("/", protect, createRequest);

// Admin review
router.get(
  "/",
  protect,
  authorizeRoles("superadmin", "studentAdmin", "teacherAdmin", "nonTeachingAdmin"),
  listRequests
);
router.post(
  "/:id/approve",
  protect,
  authorizeRoles("superadmin", "studentAdmin", "teacherAdmin", "nonTeachingAdmin"),
  approveRequest
);
router.post(
  "/:id/reject",
  protect,
  authorizeRoles("superadmin", "studentAdmin", "teacherAdmin", "nonTeachingAdmin"),
  rejectRequest
);

export default router;
