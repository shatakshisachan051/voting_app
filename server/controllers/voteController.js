const Vote = require("../models/Vote");

const submitVote = async (req, res) => {
  const { userId, electionId, candidate } = req.body;

  try {
    // Check if user already voted
    const existingVote = await Vote.findOne({ user: userId, election: electionId });
    if (existingVote) {
      return res.status(400).json({ message: "You have already voted in this election." });
    }

    // Save vote
    const vote = new Vote({
      user: userId,
      election: electionId,
      candidate,
      votedAt: new Date()
    });
    await vote.save();

    res.status(201).json({ message: "Vote submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting vote:", error);
    res.status(500).json({ message: "Error submitting vote", error });
  }
};

// ✅ Export correctly
module.exports = { submitVote };
