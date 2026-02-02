// routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js"; // for /me

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // force role to "user" to avoid accidental privilege escalation
    const user = new User({ username, password: hashed, role: "user" });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    // include role in token; if role missing in DB fallback to "user"
    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login success", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// optional: get current user (protected)
router.get("/me", requireAuth, async (req, res) => {
  // requireAuth attaches req.user (without password)
  res.json(req.user);
});
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid username or password" });

    const role = user.role || "user";
    if (role !== "admin") return res.status(403).json({ message: "Admin access only" });

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Admin login success", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// optional: /me endpoint to fetch current user (protected)
router.get("/me", requireAuth, async (req, res) => {
  res.json(req.user);
});

export default router;
