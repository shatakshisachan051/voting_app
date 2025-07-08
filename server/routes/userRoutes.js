const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Update user profile
router.put("/update/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    console.log("✏️ User updated:", updatedUser.email);
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ message: "Error updating user" });
  }
});

module.exports = router;
