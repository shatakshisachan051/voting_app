const express = require("express");
const router = express.Router();
const Vote = require("../models/Vote");
const Election = require("../models/Election");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");

// GET voting history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Fetching voting history for user:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const votes = await Vote.find({ userId })
      .populate("election", "title startDate endDate");

    console.log("Found votes:", votes.length);

    const result = votes.map((vote) => ({
      id: vote._id,
      election: vote.election._id,
      electionTitle: vote.election.title,
      candidateName: vote.candidateName,
      votedAt: vote.votedAt,
    }));

    console.log("Sending voting history:", result);
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching voting history:", err);
    res.status(500).json({ message: "Server error while fetching history" });
  }
});

// POST /api/votes
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { electionId, candidateName } = req.body;

    console.log("Received vote request:", { userId, electionId, candidateName });

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!electionId || !candidateName) {
      return res.status(400).json({ message: "Election ID and candidate name are required." });
    }

    // Check if election exists and is active
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

    // Prevent double voting in the same election
    const existingVote = await Vote.findOne({ userId, election: electionId });
    if (existingVote) {
      console.log("Found existing vote:", existingVote);
      return res.status(400).json({ message: "You have already voted in this election." });
    }

    const vote = new Vote({
      userId,
      election: electionId,
      candidateName: candidateName,
      votedAt: new Date()
    });

    await vote.save();
    console.log("✅ Vote recorded:", { userId, electionId, candidateName });

    // Return the complete vote data
    const savedVote = await Vote.findById(vote._id).populate("election", "title startDate endDate");
    const voteData = {
      id: savedVote._id,
      election: savedVote.election._id,
      electionTitle: savedVote.election.title,
      candidateName: savedVote.candidateName,
      votedAt: savedVote.votedAt,
      message: "Vote submitted successfully."
    };

    res.status(201).json(voteData);
  } catch (err) {
    console.error("❌ Error submitting vote:", err);
    res.status(500).json({ message: "Server error while submitting vote." });
  }
});

// Get vote count and analytics
router.get("/count", async (req, res) => {
  try {
    const count = await Vote.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Error getting vote count:", err);
    res.status(500).json({ message: "Error getting vote count" });
  }
});

// Get election stats for analytics
router.get("/stats", async (req, res) => {
  try {
    const now = new Date();
    const activeElections = await Election.countDocuments({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    
    const completedElections = await Election.countDocuments({
      endDate: { $lt: now }
    });

    // Calculate participation rate
    const totalVotes = await Vote.countDocuments();
    const totalVoters = await User.countDocuments({ role: 'voter' });
    const participation = totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0;

    res.json({
      active: activeElections,
      completed: completedElections,
      participation: Math.round(participation)
    });
  } catch (err) {
    console.error("Error getting election stats:", err);
    res.status(500).json({ message: "Error getting election stats" });
  }
});

module.exports = router;
