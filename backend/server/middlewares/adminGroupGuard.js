// backend/server/middlewares/adminGroupGuard.js

/**
 * Guard: restrict admin roles to their own election group.
 *
 * Usage:
 *   router.get("/admin/results",
 *     protect,
 *     authorizeRoles("superadmin","admin","studentAdmin","teacherAdmin","nonTeachingAdmin"),
 *     onlyAllowGroupForAdmin("query"),   // group/role comes from req.query
 *     getResults
 *   );
 *
 *   router.post("/admin/results/publish",
 *     protect,
 *     authorizeRoles("superadmin","admin","studentAdmin","teacherAdmin","nonTeachingAdmin"),
 *     onlyAllowGroupForAdmin("body"),    // group/role comes from req.body
 *     publishResults
 *   );
 */
export const onlyAllowGroupForAdmin = (source = "query") => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;
      if (!userRole) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Global admins can manage all groups
      if (userRole === "superadmin" || userRole === "admin") {
        return next();
      }

      // Map admin-like roles to exactly one allowed group
      const map = {
        studentAdmin: "student",
        teacherAdmin: "teacher",
        nonTeachingAdmin: "nonteaching",
      };

      const allowed = map[userRole];
      if (!allowed) {
        return res.status(403).json({ message: "Forbidden for your role" });
      }

      // Read group/role from the chosen source
      const container = source === "body" ? (req.body ||= {}) : (req.query ||= {});
      const provided = (container.role || container.group || "").toLowerCase();

      // If caller didn't specify a group/role, enforce it silently
      if (!provided) {
        container.role = allowed; // normalize to role
        return next();
      }

      // If caller specified a group/role, validate it
      if (provided !== allowed) {
        return res
          .status(403)
          .json({ message: `You can only manage the ${allowed} group` });
      }

      return next();
    } catch (err) {
      console.error("onlyAllowGroupForAdmin error:", err);
      return res.status(500).json({ message: "Guard error" });
    }
  };
};
