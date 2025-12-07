// middleware/auth.js
import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "yourSecretKey"; 

export default function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer") {
      return res.status(401).json({ message: "Invalid auth format" });
    }

    const payload = jwt.verify(token, SECRET);

    // ✔ Correct key for your system
    req.userId = payload.id;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
