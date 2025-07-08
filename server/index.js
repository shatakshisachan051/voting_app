const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // <-- CRUCIAL for req.body

mongoose.connect("mongodb://127.0.0.1:27017/voting_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/auth", require("./routes/authRoutes"));

app.listen(8080, () => console.log("🚀 Server running on port 8080"));
