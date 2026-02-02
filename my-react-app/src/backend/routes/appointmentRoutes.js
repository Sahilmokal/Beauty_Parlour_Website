// routes/appointmentRoutes.js
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey"; // use env var in production

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true }, // store as YYYY-MM-DD or ISO string
  time: { type: String, required: true }, // HH:MM
  notes: { type: String },              // legacy
  specialRequests: { type: String },    // canonical
}, { timestamps: true });

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

// Middleware to verify JWT
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

// Helper: return true if dateStr is before today (date-only comparison)
function isPastDateString(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d)) return false;
  d.setHours(0,0,0,0);
  const today = new Date();
  today.setHours(0,0,0,0);
  return d < today;
}

// -----------------------------
// POST /api/appointments
// Create a new appointment
// -----------------------------
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, date, time, specialRequests, notes } = req.body;

    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // If user attempts to create for a past date, block
    if (isPastDateString(date)) {
      return res.status(400).json({ message: "Cannot create appointment for a past date" });
    }

    const canonicalRequests = specialRequests ?? notes ?? "";

    const appointment = new Appointment({
      user: req.userId,
      name,
      email,
      phone,
      date,
      time,
      notes: notes || canonicalRequests,
      specialRequests: canonicalRequests,
    });

    await appointment.save();
    res.json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("POST /api/appointments error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -----------------------------
// GET /api/appointments
// Get all appointments for logged-in user
// -----------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.userId }).sort({ createdAt: -1 }).lean();
    res.json(appointments);
  } catch (err) {
    console.error("GET /api/appointments error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -----------------------------
// PUT /api/appointments/:id
// Reschedule (or update) appointment - only owner allowed
// Body: { date, time, specialRequests? }
// -----------------------------
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const apptId = req.params.id;
    const { date, time, specialRequests, notes } = req.body;

    if (!date && !time && specialRequests === undefined && notes === undefined) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const appointment = await Appointment.findById(apptId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // ownership check
    if (appointment.user && appointment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to modify this appointment" });
    }

    // cannot modify past appointments
    if (isPastDateString(appointment.date)) {
      return res.status(400).json({ message: "Past appointments cannot be modified" });
    }

    // if trying to set new date to past, deny
    if (date && isPastDateString(date)) {
      return res.status(400).json({ message: "Cannot reschedule to a past date" });
    }

    // perform updates
    if (date) appointment.date = date;
    if (time) appointment.time = time;

    if (specialRequests !== undefined) {
      appointment.specialRequests = specialRequests;
      appointment.notes = appointment.notes || specialRequests;
    } else if (notes !== undefined) {
      appointment.notes = notes;
      appointment.specialRequests = appointment.specialRequests || notes;
    }

    await appointment.save();
    res.json({ message: "Appointment updated", appointment });
  } catch (err) {
    console.error("PUT /api/appointments/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -----------------------------
// DELETE /api/appointments/:id
// Cancel appointment - only owner allowed
// -----------------------------
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const apptId = req.params.id;
    const appointment = await Appointment.findById(apptId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // ownership check
    if (appointment.user && appointment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to cancel this appointment" });
    }

    // cannot cancel past appointments
    if (isPastDateString(appointment.date)) {
      return res.status(400).json({ message: "Past appointments cannot be cancelled" });
    }

    await Appointment.deleteOne({ _id: apptId });
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    console.error("DELETE /api/appointments/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
