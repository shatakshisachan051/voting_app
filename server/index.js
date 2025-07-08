const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// ✅ API routes
app.use("/api/auth", authRoutes);  // For register & login
app.use("/api/users", userRoutes); // For updating user profile

// ✅ Home route for testing
app.get("/", (req, res) => {
  res.send("🚀 Voting App Backend is running!");
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/voting_app")
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
