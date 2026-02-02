import express from "express";
import stripe from "../config/stripe.js";
import Course from "../models/Course.js";
import CourseBooking from "../models/CourseBooking.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-checkout-session", requireAuth, async (req, res) => {
  try {
    const { courseId, notes } = req.body; // ✅ READ NOTES FROM FRONTEND
    const user = req.user;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ SAVE BOOKING FIRST (DEMO MODE)
   await CourseBooking.create({
  user: user._id,
  courseId,
  courseTitle: course.title,
  name: user.name || "Demo User",
  email: user.email || "demo@email.com",
  notes: notes || "",
  status: "pending", // ✅ ADMIN / USER APPROVAL REQUIRED
});

    // ✅ STRIPE CHECKOUT (FOR SHOW ONLY)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: course.title },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/enrollments",
      cancel_url: "http://localhost:5173/enrollments",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ message: "Stripe checkout failed" });
  }
});

export default router;
