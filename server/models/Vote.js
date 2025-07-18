const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    election: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
    candidateName: { type: String, required: true },
    votedAt: { type: Date, default: Date.now }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteSchema);
