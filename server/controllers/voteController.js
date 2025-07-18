const Vote = require("../models/Vote");
const Election = require("../models/Election");

const createVote = async (req, res) => {
  try {
    const { electionId, candidateName } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!electionId || !candidateName) {
      return res.status(400).json({ message: "Election ID and candidate name are required." });
    }

    // Check if the election exists and is active
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found." });
    }
    
    // Calculate election status
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);
    const isActive = now >= startDate && now <= endDate;
    
    if (!isActive) {
      return res.status(400).json({ message: "This election is not currently active." });
    }

    // Verify candidate exists in election
    if (!election.candidates.includes(candidateName)) {
      return res.status(400).json({ message: "Invalid candidate for this election." });
    }

    // Check if user has already voted in this election
    const existingVote = await Vote.findOne({ 
      user: userId, 
      election: electionId 
    });

    if (existingVote) {
      return res.status(400).json({ message: "You have already voted in this election." });
    }

    // Create new vote
    const vote = new Vote({
      user: userId,
      election: electionId,
      candidateName: candidateName,
      votedAt: new Date()
    });

    await vote.save();
    console.log("✅ Vote recorded:", { userId, electionId, candidateName });

    res.status(201).json({ message: "Vote recorded successfully!" });
  } catch (error) {
    console.error("❌ Error recording vote:", error);
    res.status(500).json({ message: "Server error recording vote." });
  }
};

const getVotingHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const votes = await Vote.find({ user: userId })
      .populate("election", "title startDate endDate");

    const formattedVotes = votes.map(vote => ({
      election: vote.election._id,
      electionTitle: vote.election.title,
      candidateName: vote.candidateName,
      votedAt: vote.votedAt
    }));

    console.log("📥 Voting history fetched for user:", userId);
    res.status(200).json(formattedVotes);
  } catch (error) {
    console.error("❌ Error fetching voting history:", error);
    res.status(500).json({ message: "Server error fetching voting history." });
  }
};

module.exports = { createVote, getVotingHistory };
