const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Get all users with optional filter
router.get("/", async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};
    
    if (filter === 'voters') {
      query.role = 'voter';
    } else if (filter === 'admins') {
      query.role = 'admin';
    }
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Update user role (make/remove admin)
router.patch("/:userId/role", async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role: isAdmin ? 'admin' : 'voter' },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Error updating user role" });
  }
});

// Delete user
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// ✅ Update profile
router.put("/update/:userId", async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// ✅ Change password
router.put("/change-password/:userId", async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Error changing password" });
  }
});

module.exports = router;
