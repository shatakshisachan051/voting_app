const User = require("../models/User");
const bcrypt = require("bcrypt");

// ✅ Register Controller
const registerUser = async (req, res) => {
    try {
        console.log("📥 /register hit");
        const { name, email, password, voterId } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password || !voterId) {
            console.log("⚠️ Missing fields in register");
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("⚠️ User already exists with email:", email);
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            voterId,
        });

        await newUser.save();
        console.log("✅ User registered successfully:", email);

        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("❌ Error in registerUser:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Login Controller
const loginUser = async (req, res) => {
    try {
        console.log("📥 /login hit");
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            console.log("⚠️ Missing email or password");
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("❌ Invalid password for email:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("✅ Login successful for user:", email);
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("❌ Error in loginUser:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
