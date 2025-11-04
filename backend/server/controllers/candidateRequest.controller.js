import CandidateRequest from "../models/CandidateRequest.js";
import Candidate from "../models/Candidate.js";

// Candidate submits a request
export const createRequest = async (req, res) => {
  try {
    const { name, group, position, department, manifesto, photoUrl } = req.body || {};
    if (!name || !group || !position) return res.status(400).json({ message: "name, group, position required" });

    const doc = await CandidateRequest.create({
      user: req.user?.id || null,
      name: name.trim(),
      group,
      position,
      department: department || "",
      manifesto: manifesto || "",
      photoUrl: photoUrl || "",
    });

    res.status(201).json({ message: "Request submitted", request: doc });
  } catch (err) {
    console.error("createRequest error:", err);
    res.status(500).json({ message: "Failed to submit request" });
  }
};

// Admin: list requests (default pending)
export const listRequests = async (req, res) => {
  try {
    const { status = "pending", group } = req.query;
    const filter = { status };
    if (group) filter.group = group;
    const rows = await CandidateRequest.find(filter).sort({ createdAt: 1 });
    res.json({ requests: rows });
  } catch (err) {
    console.error("listRequests error:", err);
    res.status(500).json({ message: "Failed to load requests" });
  }
};

// Admin: approve -> creates Candidate
export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await CandidateRequest.findById(id);
    if (!r) return res.status(404).json({ message: "Request not found" });
    if (r.status !== "pending") return res.status(400).json({ message: "Already processed" });

    const cand = await Candidate.create({
      name: r.name,
      group: r.group,
      position: r.position,
      department: r.department || "",
      manifesto: r.manifesto || "",
      photoUrl: r.photoUrl || "",
      disqualified: false,
    });

    r.status = "approved";
    r.decisionBy = req.user?.id || null;
    await r.save();

    res.json({ message: "Approved", candidate: cand });
  } catch (err) {
    console.error("approveRequest error:", err);
    res.status(500).json({ message: "Failed to approve" });
  }
};

// Admin: reject
export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { note = "" } = req.body || {};
    const r = await CandidateRequest.findById(id);
    if (!r) return res.status(404).json({ message: "Request not found" });
    if (r.status !== "pending") return res.status(400).json({ message: "Already processed" });

    r.status = "rejected";
    r.decisionBy = req.user?.id || null;
    r.decisionNote = note;
    await r.save();

    res.json({ message: "Rejected" });
  } catch (err) {
    console.error("rejectRequest error:", err);
    res.status(500).json({ message: "Failed to reject" });
  }
};
