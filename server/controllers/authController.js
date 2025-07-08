const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, voterId } = req.body;
    console.log("📥 /register hit");

    if (!name || !email || !password || !voterId) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      voterId,
    });

    await newUser.save();
    console.log("🆕 New user created & saved:", email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Error in register:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 /login hit");

    if (!email || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login successful for user:", email);
    res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email, voterId: user.voterId } });
  } catch (err) {
    console.error("❌ Error in login:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const { email } = req.query;
    console.log("📥 /profile hit for email:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      console.log("❌ User not found for profile:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User profile fetched:", user.email);
    res.status(200).json({ user });
  } catch (err) {
    console.error("❌ Error fetching profile:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getProfile };
