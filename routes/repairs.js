const express = require("express");
const router = express.Router();
const RepairBooking = require("../models/RepairBooking");
const protect = require("../middleware/auth");

const adminProtect = require("../middleware/adminAuth");

// POST /api/repairs/book - Book a repair slot (user)
router.post("/book", protect, async (req, res) => {
  try {
    const { name, email, phone, deviceType, brand, model, issueDescription, preferredDate, preferredTime } = req.body;

    const booking = await RepairBooking.create({
      userId: req.user._id,
      name,
      email,
      phone,
      deviceType,
      brand,
      model,
      issueDescription,
      preferredDate,
      preferredTime,
    });

    res.status(201).json({
      message: "Repair slot booked successfully!",
      booking,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/repairs/my - Get current user's repair bookings (user)
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await RepairBooking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/repairs - Get all repair bookings (admin only)
router.get("/", protect, adminProtect, async (req, res) => {
  try {
    const bookings = await RepairBooking.find().populate("userId", "username email").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/repairs/:id/status - Update repair booking status (admin only)
router.put("/:id/status", protect, adminProtect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await RepairBooking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: "Failed to update status", error: error.message });
  }
});

// DELETE /api/repairs/:id - Delete own repair booking (user)
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await RepairBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this booking" });
    }
    await RepairBooking.findByIdAndDelete(req.params.id);
    res.json({ message: "Repair booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking", error: error.message });
  }
});

module.exports = router;
