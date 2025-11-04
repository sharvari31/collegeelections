import mongoose from "mongoose";

const candidateRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // applicant (optional)
    name: { type: String, required: true },
    group: { type: String, enum: ["student", "teacher", "nonteaching"], required: true },
    position: { type: String, required: true },
    department: { type: String, default: "" },
    manifesto: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    decisionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    decisionNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("CandidateRequest", candidateRequestSchema);
