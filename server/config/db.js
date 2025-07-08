const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/voting_app", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ Connected to Local MongoDB: ${conn.connection.name}`);
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
