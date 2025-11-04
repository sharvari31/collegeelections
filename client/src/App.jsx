// client/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Global UI + Guards
import NavBar from "./components/NavBar.jsx";
import { RequireAuth, RequireRole } from "./components/RequireAuth.jsx";

// Public / Voter pages
import Elections from "./pages/Elections.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Candidates from "./pages/Candidates.jsx";
import CandidateApply from "./pages/CandidateApply.jsx";
import Results from "./pages/Results.jsx";

// Portals
import StudentPortal from "./pages/portals/StudentPortal.jsx";
import TeacherPortal from "./pages/portals/TeacherPortal.jsx";
import NonTeachingPortal from "./pages/portals/NonTeachingPortal.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminCandidates from "./pages/admin/AdminCandidates.jsx";
import AdminReview from "./pages/admin/AdminReview.jsx";

function Home() {
  const BG =
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2000&auto=format&fit=crop";
  return (
    <main
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-pink-100/70 to-red-100/60" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-32">
        <div className="inline-block rounded-full bg-white/80 backdrop-blur px-4 py-1 text-sm font-medium text-red-700 border border-red-200 shadow">
          Welcome to <span className="font-bold">SVGM College Elections</span>!
        </div>
        <div className="mt-6 max-w-2xl rounded-3xl bg-white/90 backdrop-blur p-8 shadow-xl border border-pink-100">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-red-700">
            Your Vote. Your Voice.
          </h1>
          <p className="mt-3 text-gray-700">
            Participate in Student, Teacher, and Non-Teaching staff elections.
            Transparent, secure, and simple.
          </p>
          <div className="mt-6">
            <a
              href="/elections"
              className="px-6 py-3 rounded-xl bg-red-600 text-white font-medium shadow hover:shadow-lg hover:bg-red-700 transition"
            >
              Enter Election Portal
            </a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-red-300/25 blur-3xl" />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/elections" element={<Elections />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Portals (public landing pages) */}
        <Route path="/e/student" element={<StudentPortal />} />
        <Route path="/e/teacher" element={<TeacherPortal />} />
        <Route path="/e/nonteaching" element={<NonTeachingPortal />} />

        {/* Voter flows (protected) */}
        <Route
          path="/apply"
          element={
            <RequireAuth>
              <CandidateApply />
            </RequireAuth>
          }
        />
        <Route
          path="/apply/candidate"
          element={
            <RequireAuth>
              <CandidateApply />
            </RequireAuth>
          }
        />
        <Route
          path="/candidates"
          element={
            <RequireAuth>
              <Candidates />
            </RequireAuth>
          }
        />

        {/* Results are public, but only show published data */}
        <Route path="/results" element={<Results />} />

        {/* Admin (auth + role) */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireRole roles={["superadmin", "admin", "studentAdmin", "teacherAdmin", "nonTeachingAdmin"]}>
                <AdminDashboard />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/admin/candidates"
          element={
            <RequireAuth>
              <RequireRole roles={["superadmin", "admin", "studentAdmin", "teacherAdmin", "nonTeachingAdmin"]}>
                <AdminCandidates />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/admin/review"
          element={
            <RequireAuth>
              <RequireRole roles={["superadmin", "admin", "studentAdmin", "teacherAdmin", "nonTeachingAdmin"]}>
                <AdminReview />
              </RequireRole>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
