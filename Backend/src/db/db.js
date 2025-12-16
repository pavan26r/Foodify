const mongoose = require("mongoose");
require("dotenv").config();   // ✅ ADD THIS

function connectDB() {
    if (!process.env.MONGODB_URI) {
        console.error("❌ MONGODB_URI is not defined in .env file!");
        console.error("Please create a .env file in the Backend folder with:");
        console.error("MONGODB_URI=mongodb://localhost:27017/reelerdb");
        console.error("OR");
        console.error("MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reelerdb");
        return;
    }
    
    // Normalize database name to lowercase to avoid case sensitivity issues
    let mongoUri = process.env.MONGODB_URI;
    
    // Extract and normalize database name from URI (works with both mongodb:// and mongodb+srv://)
    // Pattern: .../DatabaseName? or .../DatabaseName& or .../DatabaseName
    try {
        // Find the database name (between last / and ? or & or end of string)
        // This handles: mongodb://host:port/ReelerDb?params or mongodb://host:port/ReelerDb
        const dbNameMatch = mongoUri.match(/\/([^/?&]+)(\?|&|$)/);
        if (dbNameMatch && dbNameMatch[1]) {
            const dbName = dbNameMatch[1];
            const normalizedDbName = dbName.toLowerCase();
            
            // Only replace if case is different
            if (dbName !== normalizedDbName) {
                // Use replace with regex to replace only the last occurrence (database name)
                mongoUri = mongoUri.replace(new RegExp(`/${dbName}(?=\\?|&|$)`), `/${normalizedDbName}`);
                console.log(`📝 Normalized database name: ${dbName} → ${normalizedDbName}`);
            }
        }
    } catch (e) {
        // If parsing fails, use original URI
        console.warn("Could not parse MongoDB URI, using as-is");
    }
    
    mongoose
        .connect(mongoUri)
        .then(() => {
            console.log("✅ Connected to MongoDB successfully");
            console.log(`📦 Database: ${mongoose.connection.name}`);
        })
        .catch((err) => {
            console.error("❌ MongoDB connection error:", err.message);
            
            // Check for case sensitivity error
            if (err.message.includes("different case")) {
                console.error("\n⚠️  DATABASE NAME CASE MISMATCH DETECTED!");
                console.error("Solution: Use lowercase database name in MONGODB_URI");
                console.error("Example: mongodb://localhost:27017/reelerdb (all lowercase)");
            }
            
            console.error("\nPlease check:");
            console.error("1. MongoDB is running (if local)");
            console.error("2. MONGODB_URI is correct in .env file");
            console.error("3. Database name should be lowercase: reelerdb");
            console.error("4. Network connection (if using MongoDB Atlas)");
        });
}

module.exports = connectDB;
