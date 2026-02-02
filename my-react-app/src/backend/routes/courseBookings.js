// routes/courseBookingRoutes.js
import express from "express";
import CourseBooking from "../models/CourseBooking.js";
import Course from "../models/Course.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * GET /api/course-bookings
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await CourseBooking
      .find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ bookings });
  } catch (err) {
    console.error("GET bookings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/course-bookings
 * 🔒 PAYMENT IS MANDATORY
 */
/**
 * POST /api/course-bookings
 * ✅ DEMO MODE — allow booking BEFORE payment
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const {
      courseId,
      courseTitle,
      name,
      email,
      phone,
      preferredStart,
      notes,
      paymentId,
      paymentStatus,
    } = req.body;

    if (!courseId || !name || !email) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // 🔥 DEMO LOGIC
    const finalPaymentStatus = paymentStatus || "demo-pending";
    const finalPaymentId = paymentId || "demo";

    // get course title if not provided
    let finalCourseTitle = courseTitle;
    if (!finalCourseTitle) {
      const course = await Course.findById(courseId).lean();
      finalCourseTitle = course?.title || "Course";
    }

    const booking = new CourseBooking({
      user: userId,
      courseId,
      courseTitle: finalCourseTitle,
      name,
      email,
      phone: phone || "",
      preferredStart: preferredStart || null,
      notes: notes || "",
      status: "confirmed",
      paymentId: finalPaymentId,
      paymentStatus: finalPaymentStatus,
    });

    await booking.save();

    return res.status(201).json({
      message: "Booking saved (demo mode)",
      booking,
    });
  } catch (err) {
    console.error("POST booking error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/course-bookings/:id
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await CourseBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.user) !== String(req.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.json({ message: "Enrollment cancelled" });
  } catch (err) {
    console.error("DELETE booking error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
