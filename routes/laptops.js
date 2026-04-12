const express = require("express");
const router = express.Router();
const Laptop = require("../models/Laptop");
const LaptopOrder = require("../models/LaptopOrder");
const protect = require("../middleware/auth");
const adminProtect = require("../middleware/adminAuth");



const upload = require("../config/cloudinaryConfig");

// GET /api/laptops - Get all laptops (public)
router.get("/", async (req, res) => {
  try {
    const laptops = await Laptop.find().sort({ createdAt: -1 });
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/laptops - Create a laptop (admin only with upload)
router.post("/", protect, adminProtect, upload.single("image"), async (req, res) => {
  try {
    const laptopData = { ...req.body };
    
    // Parse specs if they are sent as a string (happens with FormData)
    if (typeof laptopData.specs === "string") {
      try {
        laptopData.specs = JSON.parse(laptopData.specs);
      } catch (e) {
        // Fallback or ignore if already an object or invalid
      }
    }

    if (req.file) {
      laptopData.image = req.file.path;
    }

    const laptop = await Laptop.create(laptopData);
    res.status(201).json(laptop);
  } catch (error) {
    res.status(400).json({ message: "Failed to create laptop", error: error.message });
  }
});

// PUT /api/laptops/:id - Update a laptop (admin only with upload)
router.put("/:id", protect, adminProtect, upload.single("image"), async (req, res) => {
  try {
    const laptopData = { ...req.body };

    // Parse specs if they are sent as a string
    if (typeof laptopData.specs === "string") {
      try {
        laptopData.specs = JSON.parse(laptopData.specs);
      } catch (e) {
        // Fallback
      }
    }

    if (req.file) {
      laptopData.image = req.file.path;
    }

    const laptop = await Laptop.findByIdAndUpdate(req.params.id, laptopData, { new: true });
    if (!laptop) return res.status(404).json({ message: "Laptop not found" });
    res.json(laptop);
  } catch (error) {
    res.status(400).json({ message: "Failed to update laptop", error: error.message });
  }
});

// DELETE /api/laptops/:id - Delete a laptop (admin only)
router.delete("/:id", protect, adminProtect, async (req, res) => {
  try {
    const laptop = await Laptop.findByIdAndDelete(req.params.id);
    if (!laptop) return res.status(404).json({ message: "Laptop not found" });
    res.json({ message: "Laptop deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete laptop", error: error.message });
  }
});

// GET /api/laptops/orders - Get all orders (admin only)
router.get("/orders", protect, adminProtect, async (req, res) => {
  try {
    const orders = await LaptopOrder.find().populate("laptopId").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/laptops/book - Book/order a laptop (user)
router.post("/book", protect, async (req, res) => {
  try {
    const { laptopId, name, email, phone } = req.body;

    const laptop = await Laptop.findById(laptopId);
    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }
    if (!laptop.inStock) {
      return res.status(400).json({ message: "Laptop is out of stock" });
    }

    const order = await LaptopOrder.create({
      userId: req.user._id,
      laptopId,
      name,
      email,
      phone,
    });

    res.status(201).json({
      message: "Laptop booked successfully!",
      order,
      laptop: laptop.name,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/laptops/my-orders - Get current user's laptop orders (user)
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await LaptopOrder.find({ userId: req.user._id }).populate("laptopId").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/laptops/orders/:id - Delete own laptop order (user)
router.delete("/orders/:id", protect, async (req, res) => {
  try {
    const order = await LaptopOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this order" });
    }
    await LaptopOrder.findByIdAndDelete(req.params.id);
    res.json({ message: "Laptop order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
});

module.exports = router;
