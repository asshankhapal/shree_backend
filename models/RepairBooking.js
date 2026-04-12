const mongoose = require("mongoose");

const repairBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    deviceType: {
      type: String,
      enum: ["Laptop", "Desktop", "Phone", "Tablet"],
      required: true,
    },
    brand: { type: String, required: true },
    model: { type: String },
    issueDescription: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: {
      type: String,
      enum: ["9:00 AM - 11:00 AM", "11:00 AM - 1:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RepairBooking", repairBookingSchema);
