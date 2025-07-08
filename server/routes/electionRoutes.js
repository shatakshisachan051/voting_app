const express = require("express");
const router = express.Router();

const Election = require("../models/Election");

// GET /api/elections -> fetch all elections
router.get("/", async (req, res) => {
  try {
    const elections = await Election.find();
    res.json(elections);
  } catch (error) {
    console.error("❌ Error fetching elections:", error);
    res.status(500).json({ message: "Failed to fetch elections" });
  }
});

module.exports = router;
