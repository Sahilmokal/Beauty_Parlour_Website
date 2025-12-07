// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

export const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    // get fresh user from DB (ensure role is current)
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // attach full user (sans password)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

export const requireAdmin = (req, res, next) => {
  // assume requireAuth ran already
  const role = req.user?.role || "user";
  if (role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};
