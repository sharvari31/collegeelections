// backend/server/controllers/vote.controller.js
import Vote from "../models/Vote.js";
import Candidate from "../models/Candidate.js";

/**
 * POST /api/votes
 * body: { role, position, candidateId? , candidate? }
 * - Accepts both `candidateId` (old) and `candidate` (new)
 * - Saves using the new field names: { user, candidate }
 */
export const castVote = async (req, res) => {
  try {
    const user = req.user?.id; // <-- new canonical field
    const { role, position } = req.body || {};

    // accept old/new key names from client
    const candidate = req.body?.candidate || req.body?.candidateId;

    if (!role || !position || !candidate) {
      return res
        .status(400)
        .json({ message: "role, position, and candidate are required" });
    }

    // validate candidate (approved, not DQ, matches seat)
    const cand = await Candidate.findById(candidate);
    if (!cand) return res.status(404).json({ message: "Candidate not found" });
    if (cand.group !== role)
      return res.status(400).json({ message: "Candidate group mismatch" });
    if ((cand.position || "").toLowerCase() !== position.toLowerCase())
      return res.status(400).json({ message: "Candidate position mismatch" });
    if (cand.status !== "approved")
      return res.status(400).json({ message: "Candidate not approved yet" });
    if (cand.disqualified)
      return res.status(400).json({ message: "Candidate is disqualified" });

    // enforce "one vote per user per role+position"
    // Back-compat note: your collection might still have old docs with { userId, candidateId }.
    // We check duplicates using both shapes.
    const already = await Vote.findOne({
      role,
      position,
      $or: [{ user }, { userId: user }], // accept legacy
    }).lean();

    if (already) {
      return res.status(409).json({ message: "You already voted for this position" });
    }

    // Save using new canonical field names
    const doc = await Vote.create({
      user,          // <-- canonical
      role,
      position,
      candidate,     // <-- canonical
    });

    return res.status(201).json({ message: "Vote recorded", vote: doc });
  } catch (err) {
    console.error("castVote error:", err);
    return res.status(500).json({ message: "Failed to cast vote" });
  }
};

/**
 * GET /api/votes/my?role=&position=
 * Returns the current user's vote (if any) for a role+position
 * Back-compat: it will find a vote whether it was saved as {user} or {userId}.
 */
export const myVote = async (req, res) => {
  try {
    const user = req.user?.id;
    const { role, position } = req.query || {};
    if (!role || !position) {
      return res.status(400).json({ message: "role and position are required" });
    }

    const v = await Vote.findOne({
      role,
      position,
      $or: [{ user }, { userId: user }], // back-compat
    }).lean();

    return res.json({ vote: v || null });
  } catch (err) {
    console.error("myVote error:", err);
    return res.status(500).json({ message: "Failed to load vote" });
  }
};
