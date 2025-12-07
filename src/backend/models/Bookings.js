// models/Booking.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: String },
    serviceName: { type: String, required: true },
    serviceImage: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true }, // yyyy-mm-dd
    time: { type: String, required: true }, // HH:MM
    specialRequests: { type: String },
    status: { type: String, default: "confirmed" } // confirmed | cancelled
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
