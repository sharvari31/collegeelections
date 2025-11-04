import { Link } from "react-router-dom";

export default function Elections() {
  const elections = [
    {
      role: "student",
      title: "Student Election",
      positions: "President • Cultural Head • Treasurer • Coordinator",
      image: "https://cdn9.dissolve.com/p/D984_72_013/D984_72_013_1200.jpg",
    },
    {
      role: "teacher",
      title: "Teacher Election",
      positions: "HOD IT • HOD Commerce • HOD Data Science & Analytics",
      image:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2000&auto=format&fit=crop",
    },
    {
      role: "nonteaching",
      title: "Non-Teaching Staff Election",
      positions: "Head of Admin • Emergencies • Course Coordinators",
      image:
        "https://iticollege.edu/wp-content/uploads/2023/01/Study-Office-Administration.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-red-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-red-700 mb-2">Choose Your Election</h1>
        <p className="text-gray-700 mb-10">
          Enter a council to view positions, vote, or apply as a candidate.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {elections.map((e) => (
            <div
              key={e.role}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-pink-100 hover:shadow-xl transition"
            >
              <img src={e.image} alt={e.title} className="h-48 w-full object-cover" />

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-900">{e.title}</h2>
                  <span className="text-sm bg-pink-100 text-red-600 px-2 py-1 rounded-full">
                    Open
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{e.positions}</p>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Link
                      to={`/login?role=${e.role}`}
                      className="flex-1 text-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to={`/register?role=${e.role}`}
                      className="flex-1 text-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      Register
                    </Link>
                  </div>

                  {/* Apply as Candidate button */}
                  <Link
                    to={`/apply?group=${e.role}`}
                    className="text-center px-4 py-2 bg-white border border-pink-300 text-red-700 rounded-lg hover:bg-pink-50 transition"
                  >
                    Apply as Candidate
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Admin login section */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Are you an administrator?
          </p>
          <Link
            to="/login?role=admin"
            className="inline-block px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </main>
  );
}
