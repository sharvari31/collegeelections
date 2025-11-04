// backend/server/models/result.model.js
import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    // election group
    role: {
      type: String,
      enum: ["student", "teacher", "nonteaching"],
      required: true,
      trim: true,
    },
    // e.g. "Student Council President"
    position: { type: String, required: true, trim: true },

    // whether this role+position is publicly published
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Make each (role, position) unique
ResultSchema.index({ role: 1, position: 1 }, { unique: true });

const Result = mongoose.model("Result", ResultSchema);
export default Result;
