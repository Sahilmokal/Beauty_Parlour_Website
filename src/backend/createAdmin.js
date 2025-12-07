// src/backend/createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; // path is correct because this file is in backend/

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/yourdbname";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    // ✅ IMPORTANT: no old options here
    await mongoose.connect(MONGODB_URI);

    console.log("Connected!");

    const username = "admin";
    const password = "Admin123!"; // change after first login
    const email = "admin@example.com";

    const existing = await User.findOne({ username });
    if (existing) {
      console.log("Admin already exists:", existing.username);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = new User({
      username,
      password: hashed,
      email,
      role: "admin", // make sure 'role' is in your schema
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    console.log("Username:", username);
    console.log("Password:", password);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

run();
