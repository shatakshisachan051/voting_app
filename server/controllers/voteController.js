const Vote = require("../models/Vote");

const getVotingHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const votes = await Vote.find({ userId });

    console.log("📥 Voting history fetched for user:", userId, votes);

    res.status(200).json(votes);
  } catch (error) {
    console.error("❌ Error fetching voting history:", error);
    res.status(500).json({ message: "Server error fetching voting history." });
  }
};

module.exports = { getVotingHistory };
