const express = require("express");
const router = express.Router();
const Vote = require("../models/Vote");
const { verifyToken } = require("../middlewares/authMiddleware"); // ✅ Correct import

// GET voting history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    // console.log(req,"req");
    // console.log(req.user,"req.user");
    // console.log(userId,"userId");

    const votes = await Vote.find({ user: userId })
      .populate("election", "title")
      .populate("candidate", "name");
   // console.log(votes,"votes");
    const result = votes.map((vote) => ({
      id: vote._id,
      electionName: vote.election.title,
      candidateName: vote.candidate.name,
      votedAt: vote.votedAt,
    }))
    //console.log(result)
    res.json(
       result


    );
    
  } catch (err) {
    console.error("❌ Error fetching voting history:", err);
    res.status(500).json({ message: "Server error while fetching history" });
  }
});

// POST /api/votes
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { electionId, candidateId } = req.body;

    // Prevent double voting in the same election
    const existingVote = await Vote.findOne({ user: userId, election: electionId });
    if (existingVote) {
      return res.status(400).json({ message: "You have already voted in this election." });
    }

    const vote = new Vote({
      user: userId,
      candidate: candidateId,
      election: electionId,
    });
    await vote.save();
    res.status(201).json({ message: "Vote submitted successfully." });
  } catch (err) {
    console.error("❌ Error submitting vote:", err);
    res.status(500).json({ message: "Server error while submitting vote." });
  }
});

module.exports = router;
