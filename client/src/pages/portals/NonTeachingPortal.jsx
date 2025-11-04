import { getUserFromToken } from "../../utils/auth";

const POSITIONS = [
  "Head of Administration",
  "Head of Emergencies",
  "Head of Course Coordinators",
];

export default function NonTeachingPortal() {
  const me = getUserFromToken();
  const token = localStorage.getItem("token");

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-red-50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow border border-pink-100 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-red-700">
              Non-Teaching Staff Election
            </h1>
            <p className="text-gray-600">
              Vote for non-teaching leadership roles or apply to stand as a candidate.
            </p>
            {me && (
              <p className="mt-1 text-sm text-gray-600">
                Signed in as <span className="font-medium">{me.name || me.email}</span>
              </p>
            )}
          </div>

          {!token ? (
            <div className="flex gap-2">
              <a
                href="/login?role=nonteaching"
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Login
              </a>
              <a
                href="/register?role=nonteaching"
                className="px-4 py-2 rounded-lg border border-red-600 text-red-700 hover:bg-red-50"
              >
                Register
              </a>
            </div>
          ) : (
            <a
              href="/apply?group=nonteaching"
              className="px-4 py-2 rounded-lg bg-white border border-red-600 text-red-700 hover:bg-red-50"
            >
              Apply as Candidate
            </a>
          )}
        </div>

        {/* Positions grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSITIONS.map((p) => (
            <div
              key={p}
              className="bg-white rounded-2xl shadow border border-pink-100 p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{p}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Click below to view candidates and vote.
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href={`/candidates?role=nonteaching&position=${encodeURIComponent(p)}`}
                  className="flex-1 text-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  View / Vote
                </a>
                <a
                  href="/results"
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  title="Public results page"
                >
                  Results
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
