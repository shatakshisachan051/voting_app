const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (role === "voter" && req.body.voterId) {
      const existingVoterId = await User.findOne({ voterId: req.body.voterId });
      if (existingVoterId) {
        return res.status(400).json({ message: "Voter ID already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { 
      name, 
      email, 
      password: hashedPassword, 
      role: role === "admin" ? "admin" : "voter",
      isProfileComplete: false,
      isVerifiedByAdmin: false
    };
    
    if (role === "voter" && req.body.voterId) {
      userData.voterId = req.body.voterId;
    }
    
    console.log("Registering user:", userData);
    const user = new User(userData);
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    console.log("Login attempt for:", email);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "No user found for this email." });
    }
    
    if (role && user.role !== role) {
      return res.status(401).json({ message: `Role mismatch. User is '${user.role}', you selected '${role}'.` });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // Create token payload
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    console.log("Creating token with payload:", tokenPayload);

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Verify token immediately after creation (debug)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified token contains:", decoded);

    // Return complete user data
    res.status(200).json({
      message: "Login successful",
      token,
      user: { 
        _id: user._id,
        email: user.email, 
        name: user.name, 
        role: user.role,
        voterId: user.voterId,
        age: user.age,
        address: user.address,
        photoPath: user.photoPath,
        documentPath: user.documentPath,
        isProfileComplete: user.isProfileComplete,
        isVerifiedByAdmin: user.isVerifiedByAdmin
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { registerUser, loginUser };
