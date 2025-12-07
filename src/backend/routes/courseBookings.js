// routes/courseBookingRoutes.js
import express from "express";
import CourseBooking from "../models/CourseBooking.js";
import Course from "../models/Course.js"; // optional: to fetch course title/price
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * GET /api/course-bookings
 * Returns bookings of the logged-in user
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await CourseBooking.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return res.json({ bookings });
  } catch (err) {
    console.error("GET /api/course-bookings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/course-bookings
 * Create a new booking for logged-in user
 * Body: { courseId, courseTitle?(optional), name, email, phone?, preferredStart?, notes? }
 * Protected: requires verifyToken
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId, courseTitle, name, email, phone, preferredStart, notes } = req.body;

    if (!courseId || !name || !email) {
      return res.status(400).json({ message: "Missing required fields: courseId, name, email" });
    }

    // If courseTitle not provided, try to fetch from Course model (optional)
    let finalCourseTitle = courseTitle;
    try {
      if (!finalCourseTitle) {
        const course = await Course.findById(courseId).lean();
        if (course) finalCourseTitle = course.title || course.courseTitle || "";
      }
    } catch (err) {
      // ignore fetch errors — we can still continue with provided courseTitle
      console.warn("Could not fetch course title:", err.message);
    }

    const booking = new CourseBooking({
      user: userId,
      courseId,
      courseTitle: finalCourseTitle || `Course ${courseId}`,
      name,
      email,
      phone: phone || "",
      preferredStart: preferredStart || null,
      notes: notes || "",
      status: "pending",
    });

    await booking.save();
    return res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error("POST /api/course-bookings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/course-bookings/:id
 * Cancel enrollment (soft-cancel: mark status) — only owner.
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;
    const booking = await CourseBooking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (String(booking.user) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    // soft-cancel
    booking.status = "cancelled";
    await booking.save();

    return res.json({ message: "Enrollment cancelled", bookingId: id });
  } catch (err) {
    console.error("DELETE /api/course-bookings/:id error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
