const express = require("express");
const router = express.Router();
const Election = require("../models/Election");
const Vote = require("../models/Vote");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");

// Get all elections
router.get("/", verifyToken, async (req, res) => {
  try {
    const elections = await Election.find().sort({ startDate: 1 });
    res.json(elections);
  } catch (err) {
    console.error("Error fetching elections:", err);
    res.status(500).json({ message: "Error fetching elections" });
  }
});

// Create new election
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, startDate, endDate, candidates } = req.body;
    
    const election = new Election({
      title,
      startDate,
      endDate,
      candidates
    });
    
    await election.save();
    res.status(201).json(election);
  } catch (err) {
    console.error("Error creating election:", err);
    res.status(500).json({ message: "Error creating election" });
  }
});

// Delete election
router.delete("/:electionId", verifyToken, async (req, res) => {
  try {
    const { electionId } = req.params;
    await Election.findByIdAndDelete(electionId);
    res.json({ message: "Election deleted successfully" });
  } catch (err) {
    console.error("Error deleting election:", err);
    res.status(500).json({ message: "Error deleting election" });
  }
});

// Get election stats
router.get("/stats", verifyToken, async (req, res) => {
  try {
    console.log("Calculating election stats...");
    const now = new Date();
    
    // Get all elections
    const elections = await Election.find();
    console.log("Total elections found:", elections.length);

    // Calculate active and completed elections
    const activeElections = elections.filter(election => {
      const startDate = new Date(election.startDate);
      const endDate = new Date(election.endDate);
      return startDate <= now && endDate >= now;
    }).length;

    const completedElections = elections.filter(election => {
      const endDate = new Date(election.endDate);
      return endDate < now;
    }).length;

    console.log("Active elections:", activeElections);
    console.log("Completed elections:", completedElections);

    // Calculate participation rate
    const totalVoters = await User.countDocuments({ role: 'voter' });
    const totalVotes = await Vote.countDocuments();
    const participation = totalVoters > 0 ? Math.round((totalVotes / (totalVoters * elections.length)) * 100) : 0;

    console.log("Participation stats:", {
      totalVoters,
      totalVotes,
      totalElections: elections.length,
      participation
    });

    const stats = {
      active: activeElections,
      completed: completedElections,
      participation,
      totalElections: elections.length,
      totalVoters,
      totalVotes
    };

    console.log("Sending stats:", stats);
    res.json(stats);
  } catch (err) {
    console.error("Error getting election stats:", err);
    res.status(500).json({ message: "Error getting election stats" });
  }
});

module.exports = router;
