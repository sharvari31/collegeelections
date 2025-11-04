import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
    title: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

positionSchema.index({ electionId: 1, title: 1 }, { unique: true });

export default mongoose.model("Position", positionSchema);
