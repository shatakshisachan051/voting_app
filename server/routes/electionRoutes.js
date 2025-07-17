const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware"); // secure route

// Dummy elections data for now
const elections = [
  
];

// GET /api/elections - Get all elections (secured)
router.get("/", verifyToken, (req, res) => {
  res.status(200).json(elections);
});

module.exports = router;
