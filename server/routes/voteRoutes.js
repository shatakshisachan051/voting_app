const express = require("express");
const router = express.Router();
const { submitVote } = require("../controllers/voteController"); // ✅ correct import

router.post("/", submitVote); // ✅ handler is a function

module.exports = router;
