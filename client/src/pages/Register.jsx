import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken, parseJwt } from "../utils/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Register() {
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), []);
  const presetRole = params.get("role") || ""; // student | teacher | nonteaching

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [group, setGroup] = useState(
    ["student", "teacher", "nonteaching"].includes(presetRole) ? presetRole : ""
  );
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // If already logged in, route them where they belong
  useEffect(() => {
    const me = getUserFromToken();
    if (me) {
      redirectAfterAuth(me, "", navigate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // 1) Try to register
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, group }), // backend should default role="user"
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Registration failed (${res.status})`);
      }

      // Some backends return token on register; if so, use it
      if (data.token) {
        localStorage.setItem("token", data.token);
        const user = parseJwt(data.token);
        redirectAfterAuth(user, "", navigate);
        return;
      }

      // 2) If no token came back, auto login
      const loginRes = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok || !loginData.token) {
        throw new Error(loginData.message || "Auto-login failed after registration");
      }

      localStorage.setItem("token", loginData.token);
      const user = parseJwt(loginData.token);
      redirectAfterAuth(user, "", navigate);
    } catch (e) {
      setErr(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-red-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-pink-100 p-8">
        <h1 className="text-2xl font-bold text-red-700">Create an account</h1>
        <p className="text-gray-600 mt-1">
          Register to participate in SVGM College Elections.
        </p>

        {err && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="you@college.edu"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Your Group (choose one)
            </label>
            <select
              required
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full rounded-lg border border-pink-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              <option value="" disabled>
                Select your group
              </option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="nonteaching">Non-Teaching Staff</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              * Admins don’t register here. They already have credentials.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 text-white py-2.5 font-medium hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <a href="/login" className="text-red-700 hover:underline">
            Login
          </a>
        </div>
      </div>
    </main>
  );
}

/** Same redirect rule as Login.jsx */
function redirectAfterAuth(user, nextUrl, navigate) {
  if (nextUrl) {
    navigate(nextUrl, { replace: true });
    return;
  }

  const role = user?.role || "";
  const group = user?.group || "";

  const adminRoles = ["superadmin", "admin", "studentAdmin", "teacherAdmin", "nonTeachingAdmin"];
  if (adminRoles.includes(role)) {
    navigate("/admin", { replace: true });
    return;
  }

  if (group === "student") {
    navigate("/e/student", { replace: true });
    return;
  }
  if (group === "teacher") {
    navigate("/e/teacher", { replace: true });
    return;
  }
  if (group === "nonteaching") {
    navigate("/e/nonteaching", { replace: true });
    return;
  }

  navigate("/elections", { replace: true });
}
