const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Get MongoDB URI from environment variables, fallback to Atlas if not specified
        const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;
        
        if (!MONGODB_URI) {
            throw new Error("MongoDB connection URI not found in environment variables");
        }

        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ Connected to MongoDB: ${conn.connection.name}`);
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
