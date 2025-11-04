import { Router } from "express";
import { initElections, listPositionsByType } from "../controllers/election.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

// seed (SuperAdmin only)
router.post(
  "/init",
  protect,
  authorizeRoles(["superadmin"]),
  initElections
);

// public: positions for an election type
router.get("/:type/positions", listPositionsByType);

export default router;

