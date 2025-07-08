const Candidate = require("../models/Candidate");

// Fetch all candidates
const getCandidates = async (req, res) => {
  try {
    console.log("📥 /candidates hit");
    const candidates = await Candidate.find();
    res.status(200).json({ candidates });
  } catch (err) {
    console.error("❌ Error fetching candidates:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Cast vote
const castVote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    console.log("📥 /vote hit for candidate:", candidateId);

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      console.log("❌ Candidate not found");
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.votes += 1; // increment vote count
    await candidate.save();

    console.log("✅ Vote casted for:", candidate.name);
    res.status(200).json({ message: `Vote casted for ${candidate.name}` });
  } catch (err) {
    console.error("❌ Error casting vote:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCandidates, castVote };
