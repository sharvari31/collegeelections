import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const USER_ROLES = [
  // platform-wide owner
  "superadmin",

  // council-specific admins
  "studentAdmin",
  "teacherAdmin",
  "nonTeachingAdmin",

  // participants
  "candidate",
  "voter",

  // keep legacy roles so existing code continues to work
  "student",
  "teacher",
  "nonteaching",
];

export const USER_GROUPS = ["student", "teacher", "nonteaching"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // don’t return by default
    },

    /**
     * role
     * - voters/candidates typically use: "voter" or "candidate"
     * - admins: "studentAdmin" | "teacherAdmin" | "nonTeachingAdmin"
     * - top-level: "superadmin"
     * - legacy roles kept for backward compatibility: "student" | "teacher" | "nonteaching"
     */
    role: {
      type: String,
      enum: USER_ROLES,
      default: "student", // keep current behaviour
      index: true,
    },

    /**
     * group identifies which council a user belongs to (for voters/candidates)
     * student | teacher | nonteaching
     * For admins it can be null (except council-specific admins where it’s helpful).
     */
    group: {
      type: String,
      enum: USER_GROUPS,
      default: "student",
    },

    // optional: department for teachers / non-teaching roles
    department: { type: String, default: "" },
  },
  { timestamps: true }
);

// hash password if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// convenience compare method
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
