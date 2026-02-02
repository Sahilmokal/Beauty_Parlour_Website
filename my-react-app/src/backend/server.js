// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import stripeWebhook from "./routes/stripeWebhook.js";

import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import serviceBookingRoutes from "./routes/serviceBookingRoutes.js";
import myBookingRoute from "./routes/myBookingRoutes.js";
import coursesRoutes from "./routes/courses.js";
import meRoutes from "./routes/me.js";
import Course from "./models/Course.js";
import courseBookingsRoutes from "./routes/courseBookings.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.post("/api/stripe/webhook", stripeWebhook);
// Serve uploaded files (avatars, etc.) from /uploads
const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));
app.use("/api/admin", adminRoutes);
// Serve static images used by courses (project-root/public/images)
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use("/api/payments", paymentRoutes);

// Mount API routes (keep order: static served above, API routes next)
app.use("/api/me", meRoutes); // profile + avatar routes
app.use("/api/course-bookings", courseBookingsRoutes);

// --- existing routes ---
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/service-bookings", serviceBookingRoutes);
app.use("/api", myBookingRoute);
app.use("/api/courses", coursesRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

// Error handler
app.use((err, req, res, next) => {
  console.error("== Server error ==");
  console.error(err && err.stack ? err.stack : err);

  const isProd = process.env.NODE_ENV === "production";
  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : "Internal Server Error";

  res.status(status).json({
    ok: false,
    status,
    message,
    ...(isProd ? {} : { stack: err && err.stack ? err.stack.split("\n") : [] }),
  });
});

const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/loginapp";
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("Connecting to MongoDB:", MONGO);
    await mongoose.connect(MONGO, { serverSelectionTimeoutMS: 30000 });
    console.log("MongoDB connected ✅");

    // Optional seed
    try { await maybeSeedCourses(); } catch (seedErr) { console.error("Seed error:", seedErr); }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err && err.message ? err.message : err);
    process.exit(1);
  }
}

startServer();

async function maybeSeedCourses() {
  const FORCE = process.env.FORCE_SEED === "true";
  const sampleCourses = [
    { _id: "hair-001", title: "Professional Hair Styling", duration: "6–8 weeks", image: "/images/course-hair.jpg", bullets: [], meta: [], price: 12500 },
    { _id: "makeup-001", title: "Bridal & Party Makeup", duration: "5–6 weeks", image: "/images/course-makeup.jpg", bullets: [], meta: [], price: 9500 },
    { _id: "skin-001", title: "Skin & Beauty Treatments", duration: "4–6 weeks", image: "/images/course-skin.jpg", bullets: [], meta: [], price: 8500 },
    { _id: "nail-001", title: "Nail Art & Extensions", duration: "3–5 weeks", image: "/images/course-nail.jpg", bullets: [], meta: [], price: 6500 },
  ];

  const count = await Course.countDocuments({});
  if (count === 0 || FORCE) {
    if (FORCE) {
      const ids = sampleCourses.map((c) => c._id);
      await Course.deleteMany({ _id: { $in: ids } });
    }
    await Course.insertMany(sampleCourses, { ordered: false });
    console.log("Sample courses seeded.");
  } else {
    console.log(`Courses present (${count}) — seeding skipped.`);
  }
}
