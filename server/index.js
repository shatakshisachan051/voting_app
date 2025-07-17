const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const voteRoutes = require("./routes/voteRoutes");
const { verifyToken } = require("./middlewares/authMiddleware");
const electionRoutes = require("./routes/electionRoutes");
const Election = require("./models/Election")
const Candidate = require("./models/Candidate")

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ parse JSON request bodies

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes); // ✅ No auth middleware for login/register
app.use("/api/users", verifyToken, userRoutes); // ✅ Protected
app.use("/api/votes", verifyToken, voteRoutes); // ✅ Protected
app.use("/api/elections",verifyToken, electionRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Voting App API is running");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
