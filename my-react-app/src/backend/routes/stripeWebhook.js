import express from "express";
import stripe from "../config/stripe.js";
import CourseBooking from "../models/CourseBooking.js";
import Course from "../models/Course.js";

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature failed:", err.message);
      return res.status(400).send(`Webhook Error`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const courseId = session.metadata.courseId;
      const userId = session.metadata.userId;

      const course = await Course.findById(courseId);

      await CourseBooking.create({
        user: userId,
        courseId,
        courseTitle: course.title,
        status: "paid",
        paymentId: session.payment_intent,
      });

      console.log("✅ Enrollment saved via webhook");
    }

    res.json({ received: true });
  }
);

export default router;
