const express = require("express"); // ✅ Express
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

// Register route
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
