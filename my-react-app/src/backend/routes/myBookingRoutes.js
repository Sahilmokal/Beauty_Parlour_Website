// routes/myBookingsRoute.js
import express from "express";
import Booking from "../models/Bookings.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    return res.json({ bookings });
  } catch (err) {
    console.error("GET /my-bookings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
