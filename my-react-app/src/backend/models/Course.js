// models/Course.js (ESM)
import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    _id: { type: String },
    title: { type: String, required: true },
    duration: { type: String },
    image: { type: String, default: "/images/course-placeholder.jpg" },
    bullets: { type: [String], default: [] },
    meta: { type: [String], default: [] },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
