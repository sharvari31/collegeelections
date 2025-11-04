// backend/server/middlewares/auth.js
import { verifyToken } from "../utils/jwt.js";

/**
 * Middleware: Protect routes (verifies JWT token)
 */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = verifyToken(token); // { id, role, group }
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.error("❌ protect middleware error:", err.message);
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

/**
 * Middleware: Authorize access for specific roles
 * Example usage: router.post("/admin", protect, authorizeRoles("admin", "superadmin"), handler)
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({ message: "User role not found" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Access denied. This action requires one of: ${allowedRoles.join(", ")}`,
        });
      }

      next();
    } catch (err) {
      console.error("❌ authorizeRoles error:", err.message);
      return res.status(403).json({ message: "Forbidden" });
    }
  };
};
