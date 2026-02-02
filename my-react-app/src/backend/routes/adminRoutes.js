import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";
import CourseBooking from "../models/CourseBooking.js";
import { sendMail } from "../../utils/mailer.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

/* ================= MODELS ================= */

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    phone: String,
    date: { type: Date, required: true }, // ✅ Date
    time: String, // HH:mm
    specialRequests: String,
  },
  { timestamps: true }
);

const serviceBookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serviceName: String,
    name: String,
    email: String,
    date: String,
    time: String,
    status: { type: String, default: "Booked" },
  },
  { timestamps: true }
);

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

const ServiceBooking =
  mongoose.models.ServiceBooking ||
  mongoose.model("ServiceBooking", serviceBookingSchema);

/* ================= MIDDLEWARE ================= */

const verifyToken = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ message: "No token" });

  try {
    const token = h.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const requireAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId).lean();
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

/* ================= ROUTES ================= */

/* ---------- STATS ---------- */
router.get("/stats", verifyToken, requireAdmin, async (req, res) => {
  res.json({
    totalAppointments: await Appointment.countDocuments(),
    totalServiceBookings: await ServiceBooking.countDocuments(),
    activeUsers: await User.countDocuments(),
  });
});

/* ---------- COURSE BOOKINGS ---------- */
router.get("/course-bookings", verifyToken, requireAdmin, async (req, res) => {
  res.json(await CourseBooking.find().sort({ createdAt: -1 }));
});

router.put("/course-bookings/:id", verifyToken, requireAdmin, async (req, res) => {
  const b = await CourseBooking.findById(req.params.id);
  if (!b) return res.status(404).json({ message: "Not found" });

  b.status = req.body.status || b.status;
  await b.save();

  try {
    await sendMail({
      to: b.email,
      subject: "Course Booking Updated",
      html: `<p>Your course <b>${b.courseTitle}</b> is now ${b.status}</p>`,
    });
  } catch (e) {
    console.error("Mail failed (course):", e.message);
  }

  res.json(b);
});

router.delete("/course-bookings/:id", verifyToken, requireAdmin, async (req, res) => {
  const b = await CourseBooking.findById(req.params.id);
  if (!b) return res.status(404).json({ message: "Not found" });

  await CourseBooking.deleteOne({ _id: b._id });
  res.json({ ok: true });
});

/* ---------- APPOINTMENTS ---------- */
router.get("/appointments", verifyToken, requireAdmin, async (req, res) => {
  res.json(await Appointment.find().sort({ createdAt: -1 }));
});

/* 🔥 UPDATE APPOINTMENT (30-MIN SLOT) */
router.put("/appointments/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { date, time } = req.body;
    console.log("✏️ Update appointment:", req.params.id, req.body);

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Not found" });

    /* SLOT VALIDATION */
    const [hh, mm] = time.split(":").map(Number);

    if (hh < 10 || hh > 20 || (hh === 20 && mm > 30)) {
      return res.status(400).json({
        message: "Time must be between 10:00 AM and 9:00 PM",
      });
    }

    if (![0, 30].includes(mm)) {
      return res.status(400).json({
        message: "Only 30-minute slots allowed",
      });
    }

    appt.date = new Date(date);
    appt.time = time;
    await appt.save();

    /* ✅ SAFE DATE FORMAT */
    const formattedDate = new Date(appt.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    /* SAFE MAIL */
    try {
      await sendMail({
        to: appt.email,
        subject: "Appointment Updated",
        html: `
          <p>Hello ${appt.name},</p>
          <p>Your appointment is updated:</p>
          <p><b>Date:</b> ${formattedDate}</p>
          <p><b>Time:</b> ${appt.time}</p>
        `,
      });
    } catch (e) {
      console.error("Mail failed (appointment):", e.message);
    }

    res.json(appt);
  } catch (err) {
    console.error("Update appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* DELETE APPOINTMENT */
router.delete("/appointments/:id", verifyToken, requireAdmin, async (req, res) => {
  const a = await Appointment.findById(req.params.id);
  if (!a) return res.status(404).json({ message: "Not found" });

  await Appointment.deleteOne({ _id: a._id });

  try {
    await sendMail({
      to: a.email,
      subject: "Appointment Cancelled",
      html: `<p>Your appointment was cancelled.</p>`,
    });
  } catch (e) {
    console.error("Mail failed (delete appointment)");
  }

  res.json({ ok: true });
});

/* ---------- SERVICE BOOKINGS (NO MAIL) ---------- */
router.get("/service-bookings", verifyToken, requireAdmin, async (req, res) => {
  res.json(await ServiceBooking.find().sort({ createdAt: -1 }));
});

router.put("/service-bookings/:id", verifyToken, requireAdmin, async (req, res) => {
  const b = await ServiceBooking.findById(req.params.id);
  if (!b) return res.status(404).json({ message: "Not found" });

  b.date = req.body.date || b.date;
  b.time = req.body.time || b.time;
  b.status = req.body.status || b.status;

  await b.save();
  res.json(b);
});

router.delete("/service-bookings/:id", verifyToken, requireAdmin, async (req, res) => {
  await ServiceBooking.deleteOne({ _id: req.params.id });
  res.json({ ok: true });
});

export default router;
