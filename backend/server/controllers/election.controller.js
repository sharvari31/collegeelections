// backend/server/controllers/election.controller.js
import Election from "../models/Election.js";
import Position from "../models/Position.js";

/**
 * Seed (or idempotently ensure) elections + positions.
 * NOTE: Position strings are aligned with the rest of the app.
 */
export const initElections = async (_req, res) => {
  const defs = [
    {
      title: "Student Election 2025",
      electionType: "student",
      positions: [
        "Student Council President",
        "Cultural Head",
        "Treasurer",
        "Student Coordinator",
      ],
    },
    {
      title: "Teacher Election 2025",
      electionType: "teacher",
      positions: [
        "HOD IT",
        "HOD Commerce",
        "HOD Data Science & Analytics",
      ],
    },
    {
      title: "Non-Teaching Staff Election 2025",
      electionType: "nonteaching",
      positions: [
        "Head of Administration",
        "Head of Emergencies",
        "Head of Course Coordinators",
      ],
    },
  ];

  const out = [];

  for (const d of defs) {
    let election = await Election.findOne({ electionType: d.electionType });
    if (!election) {
      election = await Election.create({
        title: d.title,
        electionType: d.electionType,
        status: "registration",
      });
    }

    for (const p of d.positions) {
      await Position.updateOne(
        { electionId: election._id, title: p },
        { $setOnInsert: { electionId: election._id, title: p } },
        { upsert: true }
      );
    }

    const positions = await Position.find({ electionId: election._id }).lean();
    out.push({ election, positions });
  }

  return res.status(201).json({ message: "Seeded", data: out });
};

export const listPositionsByType = async (req, res) => {
  const type = req.params.type; // student | teacher | nonteaching
  const election = await Election.findOne({ electionType: type });
  if (!election) return res.status(404).json({ message: "Election not found" });

  const positions = await Position.find({ electionId: election._id }).lean();
  return res.json({ election, positions });
};
