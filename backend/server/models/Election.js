import mongoose from "mongoose";

export const ELECTION_TYPES = ["student", "teacher", "nonteaching"];

const electionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    electionType: { type: String, enum: ELECTION_TYPES, required: true },
    status: {
      type: String,
      enum: ["draft", "registration", "campaigning", "voting", "closed", "results"],
      default: "draft",
    },
    startDate: Date,
    endDate: Date
  },
  { timestamps: true }
);

export default mongoose.model("Election", electionSchema);
