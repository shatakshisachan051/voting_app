const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        voterId: {
            type: String,
            required: [true, "Voter ID is required"],
            unique: true,
            trim: true,
        },
    },
    { timestamps: true }
);

// Debug log after saving
userSchema.post("save", function (doc) {
    console.log("🆕 New user created & saved:", doc.email);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
