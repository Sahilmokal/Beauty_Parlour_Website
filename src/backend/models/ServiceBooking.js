import mongoose from "mongoose";

const serviceBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  serviceId: { type: String },      // Optional if you have a service database
  serviceName: { type: String, required: true },

  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:MM slot

  specialRequests: { type: String, default: "" },

  status: { 
    type: String, 
    enum: ["Booked", "Completed", "Cancelled"],
    default: "Booked"
  },

}, { timestamps: true });

export default mongoose.models.ServiceBooking || 
       mongoose.model("ServiceBooking", serviceBookingSchema);
