const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const voteRoutes = require("./routes/voteRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { verifyToken } = require("./middlewares/authMiddleware");
const electionRoutes = require("./routes/electionRoutes");
const Election = require("./models/Election")
const Candidate = require("./models/Candidate")
const fs = require("fs");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Serve static files with proper CORS and MIME types
const serveStatic = (directory) => {
  return express.static(path.join(__dirname, directory), {
    setHeaders: (res, filePath) => {
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      
      // Set proper MIME types for face-api model files
      if (filePath.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
      } else if (filePath.endsWith('-shard1')) {
        res.setHeader('Content-Type', 'application/octet-stream');
      }
      
      // Set caching headers
      if (filePath.includes('face-api')) {
        // Cache face-api models for longer
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
      } else {
        // Cache other static files for less time
        res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
      }
    }
  });
};

// Create upload directories if they don't exist
const createDirIfNotExists = (dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
};

createDirIfNotExists('uploads/photos');
createDirIfNotExists('uploads/documents');
createDirIfNotExists('models/face-api');

// Static file serving with explicit routes
app.use("/uploads", serveStatic("uploads"));
app.use("/models/face-api", serveStatic("models/face-api"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", verifyToken, userRoutes);
app.use("/api/votes", verifyToken, voteRoutes);
app.use("/api/elections", verifyToken, electionRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Voting App API is running");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
