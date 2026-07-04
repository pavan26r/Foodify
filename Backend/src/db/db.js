const mongoose = require("mongoose");
require("dotenv").config();

function connectDB() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("❌ MONGODB_URI is missing in .env file.");
        process.exit(1);
    }
    mongoose
        .connect(mongoUri)
        .then(() => {
            console.log("✅ Connected to MongoDB successfully");
        })
        .catch((err) => {
            console.error("❌ MongoDB connection error:", err.message);
        });
}
module.exports = connectDB;
