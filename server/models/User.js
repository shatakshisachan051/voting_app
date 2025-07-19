const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["voter", "admin"], default: "voter" },
  voterId: { type: String, unique: true, sparse: true },
  
  // Profile fields
  age: { type: Number },
  address: { type: String },
  documentPath: { type: String }, // Path to identification document
  photoPath: { type: String }, // Path to user's photo
  isProfileComplete: { type: Boolean, default: false },
  isVerifiedByAdmin: { type: Boolean, default: false },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("User", userSchema);
