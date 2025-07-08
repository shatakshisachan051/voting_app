const express = require("express");
const { registerUser, loginUser, getProfile } = require("../controllers/authController");

const router = express.Router();

// Registration route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Profile route
router.get("/profile", getProfile);

module.exports = router;
