import Candidate from "../models/Candidate.js";

/** Map app roles to scope (which group they can manage) */
const scopeFromRole = (role) => {
  if (!role) return null;
  if (role === "superadmin") return null; // can manage all
  if (role === "admin") return null;      // global admin (if you use this)
  if (role === "studentAdmin") return "student";
  if (role === "teacherAdmin") return "teacher";
  if (role === "nonTeachingAdmin") return "nonteaching";
  return null;
};

/** GET /api/admin/candidates?status=pending&group=student&position=...&q=... */
export const adminListCandidates = async (req, res) => {
  try {
    const { status, group, position, q } = req.query;
    const myScope = scopeFromRole(req.user?.role);

    const filter = {};
    if (status) filter.status = status; // pending/approved/rejected
    if (position) filter.position = { $regex: `^${position}$`, $options: "i" };
    if (myScope) filter.group = myScope;
    else if (group) filter.group = group; // super/global admin can filter

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { department: { $regex: q, $options: "i" } },
        { position: { $regex: q, $options: "i" } },
      ];
    }

    const rows = await Candidate.find(filter).sort({ createdAt: -1 });
    res.json({ candidates: rows });
  } catch (err) {
    console.error("adminListCandidates error:", err);
    res.status(500).json({ message: "Failed to load candidates" });
  }
};

/** Internal guard to ensure admin can manage candidate in-scope */
const ensureScope = (req, candidate) => {
  const myScope = scopeFromRole(req.user?.role);
  if (myScope && candidate.group !== myScope) {
    return "You can only manage your election group.";
  }
  return null;
};

/** PATCH /api/admin/candidates/:id/approve */
export const adminApproveCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const c = await Candidate.findById(id);
    if (!c) return res.status(404).json({ message: "Candidate not found" });
    const scopeErr = ensureScope(req, c);
    if (scopeErr) return res.status(403).json({ message: scopeErr });

    c.status = "approved";
    await c.save();
    res.json({ message: "Approved", candidate: c });
  } catch (err) {
    console.error("adminApproveCandidate error:", err);
    res.status(500).json({ message: "Failed to approve" });
  }
};

/** PATCH /api/admin/candidates/:id/reject */
export const adminRejectCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const c = await Candidate.findById(id);
    if (!c) return res.status(404).json({ message: "Candidate not found" });
    const scopeErr = ensureScope(req, c);
    if (scopeErr) return res.status(403).json({ message: scopeErr });

    c.status = "rejected";
    await c.save();
    res.json({ message: "Rejected", candidate: c });
  } catch (err) {
    console.error("adminRejectCandidate error:", err);
    res.status(500).json({ message: "Failed to reject" });
  }
};

/** PATCH /api/admin/candidates/:id/toggle-disqualified */
export const adminToggleDisqualified = async (req, res) => {
  try {
    const { id } = req.params;
    const c = await Candidate.findById(id);
    if (!c) return res.status(404).json({ message: "Candidate not found" });
    const scopeErr = ensureScope(req, c);
    if (scopeErr) return res.status(403).json({ message: scopeErr });

    c.disqualified = !c.disqualified;
    await c.save();
    res.json({ message: "Toggled disqualified", disqualified: c.disqualified, candidate: c });
  } catch (err) {
    console.error("adminToggleDisqualified error:", err);
    res.status(500).json({ message: "Failed to toggle disqualified" });
  }
};
