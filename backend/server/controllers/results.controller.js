// backend/server/controllers/results.controller.js
import Candidate from "../models/Candidate.js";
import Vote from "../models/Vote.js";
import Result from "../models/result.model.js";

/**
 * GET /api/results?role=...&position=...
 * (Admins also use this via /api/admin/results)
 *
 * Returns:
 * {
 *   published: boolean,
 *   results: [{ _id, name, department, photo, votes, isWinner, disqualified }]
 * }
 */
export async function getResults(req, res) {
  try {
    const role = (req.query.role || "").trim();
    const position = (req.query.position || "").trim();

    if (!role || !position) {
      return res.status(400).json({ message: "role and position are required" });
    }

    // Published flag stored per (role, position)
    const setting = await Result.findOne({ role, position }).lean();
    const published = !!setting?.published;

    // Load approved, non-disqualified candidates for this seat
    const candidates = await Candidate.find({
      group: role,
      position,
      status: "approved",
      $or: [{ disqualified: { $exists: false } }, { disqualified: false }],
    })
      .select("_id name department photo photoUrl disqualified")
      .lean();

    if (!candidates.length) {
      return res.json({ published, results: [] });
    }

    const candidateIds = candidates.map((c) => c._id);

    // Backward-compatible aggregation:
    // Some older votes might have `candidateId`/`userId`.
    // We normalize to a temp field `_cand` = candidate || candidateId
    const tallies = await Vote.aggregate([
      {
        $match: {
          role,
          position,
          $or: [
            { candidate: { $in: candidateIds } },
            { candidateId: { $in: candidateIds } },
          ],
        },
      },
      {
        $addFields: {
          _cand: { $ifNull: ["$candidate", "$candidateId"] },
        },
      },
      { $group: { _id: "$_cand", votes: { $sum: 1 } } },
    ]);

    const voteMap = new Map(tallies.map((t) => [String(t._id), t.votes]));

    // Build response with zero-vote candidates included
    let results = candidates.map((c) => ({
      _id: c._id,
      name: c.name,
      department: c.department || "",
      photo: c.photoUrl || c.photo || "",
      votes: voteMap.get(String(c._id)) || 0,
      disqualified: !!c.disqualified,
      isWinner: false, // set below if published
    }));

    // Sort by votes desc, then name asc for stability
    results.sort((a, b) => (b.votes - a.votes) || a.name.localeCompare(b.name));

    // Mark winners only when published (highest non-zero)
    if (published && results.length) {
      const top = results[0].votes;
      if (top > 0) {
        results = results.map((r) => ({ ...r, isWinner: r.votes === top }));
      }
    }

    return res.json({ published, results });
  } catch (err) {
    console.error("getResults error:", err);
    return res.status(500).json({ message: "Failed to load results" });
  }
}

/**
 * POST /api/admin/results/publish  { role, position }
 */
export async function publishResults(req, res) {
  try {
    const role = (req.body.role || "").trim();
    const position = (req.body.position || "").trim();
    if (!role || !position) {
      return res.status(400).json({ message: "role and position are required" });
    }

    await Result.updateOne(
      { role, position },
      { $set: { published: true } },
      { upsert: true }
    );

    return res.json({ message: "Results published" });
  } catch (err) {
    console.error("publishResults error:", err);
    return res.status(500).json({ message: "Failed to publish results" });
  }
}

/**
 * POST /api/admin/results/unpublish  { role, position }
 */
export async function unpublishResults(req, res) {
  try {
    const role = (req.body.role || "").trim();
    const position = (req.body.position || "").trim();
    if (!role || !position) {
      return res.status(400).json({ message: "role and position are required" });
    }

    await Result.updateOne(
      { role, position },
      { $set: { published: false } },
      { upsert: true }
    );

    return res.json({ message: "Results unpublished" });
  } catch (err) {
    console.error("unpublishResults error:", err);
    return res.status(500).json({ message: "Failed to unpublish results" });
  }
}
