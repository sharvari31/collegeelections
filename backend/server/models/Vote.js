// backend/server/models/Vote.js
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    // ✅ canonical (new) fields
    user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role:      { type: String, enum: ["student", "teacher", "nonteaching"], required: true },
    position:  { type: String, required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },

    // 🔙 legacy fields (not required; only to read old docs)
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", select: false },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", select: false },
  },
  { timestamps: true }
);

/**
 * Back-compat bridge:
 * If a client/old data uses userId/candidateId, map them into the new fields
 * before validation so required checks pass and new docs are saved canonically.
 */
voteSchema.pre("validate", function (next) {
  if (!this.user && this.userId) this.user = this.userId;
  if (!this.candidate && this.candidateId) this.candidate = this.candidateId;
  next();
});

// ✅ one vote per user per seat
voteSchema.index({ user: 1, role: 1, position: 1 }, { unique: true });

// (Optional) keep a non-unique index that helps back-compat reads
voteSchema.index({ userId: 1, role: 1, position: 1 });

export default mongoose.model("Vote", voteSchema);
