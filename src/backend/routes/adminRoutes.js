// routes/adminRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// --- models (replace with your real imports if you have them) ---
const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  notes: String,
  specialRequests: String,
}, { timestamps: true });

const serviceBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  serviceId: String,
  serviceName: String,
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  specialRequests: String,
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
const ServiceBooking = mongoose.models.ServiceBooking || mongoose.model("ServiceBooking", serviceBookingSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);
// -----------------------------------------------------------------

// middleware: verify token & attach userId
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

// middleware: ensure the user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user || !user.isAdmin) return res.status(403).json({ message: "Admin only" });
    req.user = user;
    next();
  } catch (err) {
    console.error("requireAdmin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/stats
router.get("/stats", verifyToken, requireAdmin, async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const totalServiceBookings = await ServiceBooking.countDocuments();
    const activeUsers = await User.countDocuments(); // adapt for active definition

    res.json({ totalAppointments, totalServiceBookings, activeUsers });
  } catch (err) {
    console.error("GET /admin/stats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/admin/appointments
router.get("/appointments", verifyToken, requireAdmin, async (req, res) => {
  try {
    const appts = await Appointment.find().sort({ createdAt: -1 }).lean();
    res.json(appts);
  } catch (err) {
    console.error("GET /admin/appointments error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/admin/service-bookings
router.get("/service-bookings", verifyToken, requireAdmin, async (req, res) => {
  try {
    const bookings = await ServiceBooking.find().sort({ createdAt: -1 }).lean();
    res.json(bookings);
  } catch (err) {
    console.error("GET /admin/service-bookings error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/admin/appointments/:id
router.put("/appointments/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    const { date, time, specialRequests, notes } = req.body;
    if (date) appt.date = date;
    if (time) appt.time = time;
    if (specialRequests !== undefined) appt.specialRequests = specialRequests;
    if (notes !== undefined) appt.notes = notes;

    await appt.save();
    res.json({ message: "Updated", appointment: appt });
  } catch (err) {
    console.error("PUT /admin/appointments/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/admin/appointments/:id
router.delete("/appointments/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    await Appointment.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /admin/appointments/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/admin/service-bookings/:id
router.put("/service-bookings/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const b = await ServiceBooking.findById(req.params.id);
    if (!b) return res.status(404).json({ message: "Booking not found" });

    const { date, time, specialRequests } = req.body;
    if (date) b.date = date;
    if (time) b.time = time;
    if (specialRequests !== undefined) b.specialRequests = specialRequests;

    await b.save();
    res.json({ message: "Updated", booking: b });
  } catch (err) {
    console.error("PUT /admin/service-bookings/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/admin/service-bookings/:id
router.delete("/service-bookings/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const b = await ServiceBooking.findById(req.params.id);
    if (!b) return res.status(404).json({ message: "Booking not found" });
    await ServiceBooking.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /admin/service-bookings/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
