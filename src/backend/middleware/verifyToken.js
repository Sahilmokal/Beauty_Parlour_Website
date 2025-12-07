// middleware/verifyToken.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

export default function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header) return res.status(401).json({ message: "No token provided" });
    const token = header.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = jwt.verify(token, JWT_SECRET);
    // Accept userId or id in token payload
    req.userId = payload.userId || payload.id || payload._id;
    return next();
  } catch (err) {
    console.error("verifyToken error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}
