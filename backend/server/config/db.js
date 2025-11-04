import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB || "collegeelections";

  if (!uri || !/^mongodb(\+srv)?:\/\//.test(uri)) {
    console.warn("⚠️ Skipping MongoDB connection: set a valid MONGO_URI in .env");
    return;
  }

  // Prevent silent buffering when MongoDB is down
  mongoose.set("bufferCommands", false);
  mongoose.set("strictQuery", true);

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}/${dbName}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("⚠️ Check your IP whitelist or credentials in MongoDB Atlas.");
    process.exit(1); // Stop server if connection fails
  }
};
