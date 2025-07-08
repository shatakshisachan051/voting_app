const User = require("../models/User");
const bcrypt = require('bcrypt');


// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, voterId } = req.body;
    console.log("📥 Register request:", req.body);

    // Simple validation
    if (!name || !email || !password || !voterId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save user
    const newUser = new User({ name, email, password, voterId });
    await newUser.save();

    console.log("✅ User registered:", email);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
exports.login = async (req, res) => {
  console.log("📥 Login attempt:", req.body);

  const { email, password } = req.body;

  // Check user
  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ User not found");
    return res.status(401).json({ msg: "Invalid email or password" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("❌ Password mismatch");
    return res.status(401).json({ msg: "Invalid email or password" });
  }

  console.log("✅ Login successful for:", email);
  res.status(200).json({ msg: "Login success", user });
};




// Update voter profile
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    console.log(`📥 Update request for user ${id}:`, req.body);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Profile updated:", updatedUser.email);
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
