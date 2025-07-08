const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  votes: { type: Number, default: 0 }, // to keep vote count
});

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
