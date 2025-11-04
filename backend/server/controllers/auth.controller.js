import User, { USER_GROUPS, USER_ROLES } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

/** Normalize/validate helpers */
const pickGroup = (raw) => {
  const g = (raw || "").toLowerCase();
  return USER_GROUPS.includes(g) ? g : "student";
};
const pickRole = (raw) => {
  // allow explicit role for setup; otherwise keep defaults
  if (!raw) return "student"; // your previous default
  const r = raw.trim();
  return USER_ROLES.includes(r) ? r : "student";
};

/**
 * POST /api/auth/register
 * body: { name, email, password, group?, role?, department? }
 * Notes:
 *  - group: "student" | "teacher" | "nonteaching" (defaults to "student")
 *  - role: one of USER_ROLES (defaults to "student")
 *  - for initial admin seeding, pass role: "superadmin" or "studentAdmin"/"teacherAdmin"/"nonTeachingAdmin"
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, group, role, department } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      group: pickGroup(group),
      role: pickRole(role),
      department: department || "",
    });

    const token = signToken({ id: user._id, role: user.role, group: user.group, name: user.name });

    return res.status(201).json({
      message: "Registered",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        group: user.group,
        department: user.department,
      },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/**
 * POST /api/auth/login
 * body: { email, password }
 * returns: { token, user }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: user._id, role: user.role, group: user.group, name: user.name });

    return res.json({
      message: "Logged in",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        group: user.group,
        department: user.department,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

/**
 * GET /api/auth/me
 * returns current user info from token
 */
export const me = async (req, res) => {
  try {
    const u = await User.findById(req.user.id).lean();
    if (!u) return res.status(404).json({ message: "User not found" });
    return res.json({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      group: u.group,
      department: u.department,
      createdAt: u.createdAt,
    });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ message: "Failed to load profile" });
  }
};
