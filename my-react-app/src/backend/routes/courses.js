// routes/courses.js
import express from "express";
import Course from "../models/Course.js"; // ES module model

const router = express.Router();

// GET /api/courses
router.get("/", async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

// GET /api/courses/:id
router.get("/:id", async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    next(err);
  }
});

// POST /api/courses
router.post("/", async (req, res, next) => {
  try {
    const { title, duration, image, bullets, meta, price } = req.body;
    if (!title) return res.status(400).json({ message: "title required" });
    const c = new Course({ title, duration, image, bullets, meta, price });
    await c.save();
    res.status(201).json(c);
  } catch (err) {
    next(err);
  }
});

// PUT /api/courses/:id
router.put("/:id", async (req, res, next) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/courses/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
