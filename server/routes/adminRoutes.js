const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Error checking admin status" });
  }
};

// Get all users with optional filter
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const { filter = "all" } = req.query;
    let query = {};

    switch (filter) {
      case "pending":
        query = { isProfileComplete: true, isVerifiedByAdmin: false };
        break;
      case "verified":
        query = { isProfileComplete: true, isVerifiedByAdmin: true };
        break;
      case "incomplete":
        query = { isProfileComplete: false };
        break;
      // "all" returns everyone
    }

    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get user details by ID
router.get("/users/:userId", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Error fetching user details" });
  }
});

// Verify or reject user profile
router.put("/users/:userId/verify", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isProfileComplete) {
      return res.status(400).json({ message: "User profile is not complete" });
    }

    user.isVerifiedByAdmin = action === "approve";
    if (action === "approve") {
      // Generate voter ID only when approving
      user.voterId = `VOTER${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(7)}`;
    }

    await user.save();

    res.json({
      success: true,
      message: `User profile ${action === "approve" ? "approved" : "rejected"} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
        isVerifiedByAdmin: user.isVerifiedByAdmin,
        voterId: user.voterId
      }
    });
  } catch (err) {
    console.error("Error verifying user:", err);
    res.status(500).json({ message: "Error updating user verification status" });
  }
});

module.exports = router; 