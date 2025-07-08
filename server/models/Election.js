const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  candidates: [String], // Array of candidate names
  startDate: Date,
  endDate: Date,
});

module.exports = mongoose.model("Election", electionSchema);
