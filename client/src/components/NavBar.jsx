// client/src/components/NavBar.jsx
import { Link, useLocation } from "react-router-dom";
import { getUserFromToken, isAdminLike, logout } from "../utils/auth";

export default function NavBar() {
  const loc = useLocation();
  const user = getUserFromToken();
  const adminLike = isAdminLike();

  const NavItem = ({ to, children }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg transition ${
        loc.pathname === to
          ? "bg-pink-100 text-red-700 font-semibold"
          : "text-gray-700 hover:bg-pink-50"
      }`}
    >
      {children}
    </Link>
  );

  const displayRole = () => {
    if (!user) return "";
    // Pretty labels for admin roles
    const adminLabels = {
      superadmin: "Super Admin",
      admin: "Admin",
      studentAdmin: "Student Admin",
      teacherAdmin: "Teacher Admin",
      nonTeachingAdmin: "Non-Teaching Admin",
    };
    if (user.role && adminLabels[user.role]) return adminLabels[user.role];

    // Otherwise show group (student/teacher/nonteaching)
    if (user.group) {
      if (user.group === "nonteaching") return "Non-Teaching";
      return user.group.charAt(0).toUpperCase() + user.group.slice(1);
    }
    return "User";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-red-700 font-black text-xl">
          SVGM Elections
        </Link>

        <nav className="flex items-center gap-2">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/elections">Elections</NavItem>
          <NavItem to="/results">Results</NavItem>
          {adminLike && <NavItem to="/admin">Admin</NavItem>}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-gray-600">
                {user.name || user.email || "Signed in"} · {displayRole()}
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-pink-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
