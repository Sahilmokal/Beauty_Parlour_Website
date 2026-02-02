// routes/serviceBookingRoutes.js
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// ServiceBooking schema
const serviceBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceId: { type: String },
  serviceName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true }, // store as "YYYY-MM-DD"
  time: { type: String, required: true }, // "HH:MM"
  specialRequests: { type: String },
}, { timestamps: true });

// avoid model overwrite in dev/hot-reload
const ServiceBooking = mongoose.models.ServiceBooking || mongoose.model("ServiceBooking", serviceBookingSchema);

// middleware: verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// helper: is a date in the past? (date string YYYY-MM-DD)
const isPastDate = (dateStr) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const d = new Date(dateStr + "T00:00:00");
    return d < today;
  } catch {
    return false;
  }
};

// POST /api/service-bookings  -> create booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const { serviceId, serviceName, name, email, date, time, specialRequests } = req.body;
    if (!serviceName || !name || !email || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // basic slot validation: HH:MM pattern and allowable slot list (10:00 - 20:30 30-min)
    const slotPattern = /^\d{2}:\d{2}$/;
    if (!slotPattern.test(time)) {
      return res.status(400).json({ message: "Invalid time format" });
    }

    // Additionally, ensure date is not in past
    if (isPastDate(date)) {
      return res.status(400).json({ message: "Cannot book for a past date" });
    }

    const booking = new ServiceBooking({
      user: req.userId,
      serviceId,
      serviceName,
      name,
      email,
      date,
      time,
      specialRequests,
    });

    await booking.save();
    res.json({ message: "Service booked successfully", booking });
  } catch (err) {
    console.error("POST /service-bookings error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/service-bookings -> list user's bookings
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await ServiceBooking.find({ user: req.userId }).sort({ createdAt: -1 }).lean();
    res.json(bookings);
  } catch (err) {
    console.error("GET /service-bookings error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/service-bookings/:id -> reschedule/update (only by owner, only future booking allowed)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { date, time, specialRequests } = req.body;
    const booking = await ServiceBooking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user && booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to modify this booking" });
    }

    // prevent updating past bookings
    if (isPastDate(booking.date)) {
      return res.status(400).json({ message: "Cannot modify past bookings" });
    }

    if (date) {
      if (isPastDate(date)) return res.status(400).json({ message: "Cannot set to a past date" });
      booking.date = date;
    }
    if (time) booking.time = time;
    if (specialRequests !== undefined) booking.specialRequests = specialRequests;

    await booking.save();
    res.json({ message: "Booking updated", booking });
  } catch (err) {
    console.error("PUT /service-bookings/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/service-bookings/:id -> cancel (only owner, only future booking allowed)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await ServiceBooking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user && booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    // prevent cancelling past bookings
    if (isPastDate(booking.date)) {
      return res.status(400).json({ message: "Cannot cancel past bookings" });
    }

    await ServiceBooking.deleteOne({ _id: id });
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("DELETE /service-bookings/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
