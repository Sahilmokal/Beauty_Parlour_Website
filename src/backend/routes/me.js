// routes/me.js
import express from "express";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// GET /api/me — return current user (no password)
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...safe } = user;
    return res.json(safe);
  } catch (err) {
    console.error("GET /api/me error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Simple email validator
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  // basic regex (sufficient for sanity check)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// PUT /api/me — update profile (name, email, phone, location, bio)
router.put("/", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, location, bio } = req.body;

    // Optionally validate email if provided
    if (email !== undefined && !isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If user tries to change email to the same value, skip uniqueness check
    if (email !== undefined && String(user.email || "") !== String(email)) {
      // set email (mongoose unique index will enforce uniqueness)
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;

    // Save with try/catch to catch duplicate-key errors
    await user.save();

    const { password, ...safe } = user.toObject();
    return res.json(safe);
  } catch (err) {
    console.error("PUT /api/me error:", err);

    // Handle duplicate key (unique email) gracefully
    if (err && err.code === 11000) {
      // find which key caused duplication
      const dupKey = err.keyPattern ? Object.keys(err.keyPattern)[0] : "field";
      return res.status(409).json({ message: `The ${dupKey} is already in use` });
    }

    // Other validation errors
    if (err && err.name === "ValidationError") {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({ message: messages.join("; ") || "Validation error" });
    }

    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
