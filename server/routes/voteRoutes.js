const express = require("express");
const { getCandidates, castVote } = require("../controllers/voteController");

const router = express.Router();

router.get("/candidates", getCandidates);
router.post("/vote", castVote);

module.exports = router;
