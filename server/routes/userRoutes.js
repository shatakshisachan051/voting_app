const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = file.fieldname === 'photo' ? 'uploads/photos' : 'uploads/documents';
    // Create directories if they don't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "photo") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed for photos"));
      }
    } else if (file.fieldname === "document") {
      if (!file.mimetype.startsWith("image/") && file.mimetype !== "application/pdf") {
        return cb(new Error("Only image or PDF files are allowed for documents"));
      }
    }
    cb(null, true);
  }
});

// Update profile route
router.put("/update/:userId", 
  verifyToken, 
  upload.fields([
    { name: 'photo', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, email, age, address } = req.body;

      // Verify user has permission to update this profile
      if (req.user.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this profile" });
      }

      // Find and update user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update fields
      user.name = name || user.name;
      user.email = email || user.email;
      user.age = age || user.age;
      user.address = address || user.address;

      // Handle photo upload
      if (req.files?.photo?.[0]) {
        // Delete old photo if it exists
        if (user.photoPath) {
          const oldPhotoPath = path.join(__dirname, '..', 'uploads', 'photos', user.photoPath);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }
        user.photoPath = req.files.photo[0].filename;
      }

      await user.save();

      // Return updated user data without sensitive information
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        address: user.address,
        photoPath: user.photoPath,
        isProfileComplete: user.isProfileComplete,
        isVerifiedByAdmin: user.isVerifiedByAdmin,
        voterId: user.voterId
      };

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: userResponse
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ message: "Error updating profile" });
    }
  }
);

// Complete profile route
router.post("/complete-profile", 
  verifyToken,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { name, age, address } = req.body;
      const userId = req.user.userId;

      // Validate inputs
      if (!name || !age || !address) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!req.files?.photo?.[0] || !req.files?.document?.[0]) {
        return res.status(400).json({ message: "Both photo and document are required" });
      }

      // Update user profile
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.name = name;
      user.age = age;
      user.address = address;
      user.photoPath = req.files.photo[0].filename;
      user.documentPath = req.files.document[0].filename;
      user.isProfileComplete = true;
      user.isVerifiedByAdmin = false;

      await user.save();

      // Return the updated user data without sensitive information
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        address: user.address,
        photoPath: user.photoPath,
        isProfileComplete: user.isProfileComplete,
        isVerifiedByAdmin: user.isVerifiedByAdmin,
        voterId: user.voterId
      };

      res.json({
        success: true,
        message: "Profile completed successfully. Waiting for admin verification.",
        user: userResponse
      });
    } catch (err) {
      console.error("Error completing profile:", err);
      res.status(500).json({ message: "Error completing profile" });
    }
  }
);

// Get profile status
router.get("/profile-status", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      isProfileComplete: user.isProfileComplete,
      isVerifiedByAdmin: user.isVerifiedByAdmin
    });
  } catch (err) {
    console.error("Error getting profile status:", err);
    res.status(500).json({ message: "Error getting profile status" });
  }
});

module.exports = router;
