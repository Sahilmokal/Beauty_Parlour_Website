// models/CourseBooking.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const CourseBookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // <-- important
    courseId: { type: String, required: true },       // store course _id (string)
    courseTitle: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    preferredStart: { type: Date },                   // optional preferred start date
    status: { type: String, enum: ["pending","confirmed","cancelled"], default: "confirmed" },
    notes: { type: String },
  },
  { timestamps: true }
);

// prevent model overwrite in dev/hot-reload (Vite/ Nodemon)
export default mongoose.models.CourseBooking || mongoose.model("CourseBooking", CourseBookingSchema);
