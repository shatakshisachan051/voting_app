const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  voterId: { type: String, required: true, unique: true, default: () => `VID${Math.floor(100000 + Math.random() * 900000)}` }, // 6-digit voter ID
  address: String,
  age: Number
});

module.exports = mongoose.model("User", userSchema);
