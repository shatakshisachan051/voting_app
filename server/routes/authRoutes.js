const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register Route
router.post("/register", authController.register);

// Login Route
router.post("/login", authController.login);

// Update Profile Route
router.put("/update/:id", authController.updateProfile);

module.exports = router;
