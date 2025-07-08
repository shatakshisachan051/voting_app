const express = require("express");
const router = express.Router();
const Election = require("../models/Election");

// POST /api/elections
router.post("/", async (req, res) => {
  try {
    const election = new Election(req.body);
    await election.save();
    res.status(201).json({ message: "Election created!", election });
  } catch (err) {
    res.status(500).json({ message: "Error creating election", error: err });
  }
});

module.exports = router;
