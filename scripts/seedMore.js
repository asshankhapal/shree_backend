require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");
const Laptop = require("../models/Laptop");
const RepairBooking = require("../models/RepairBooking");
const LaptopOrder = require("../models/LaptopOrder");

const seedExtraData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for extra seeding");

    const admin = await User.findOne({ role: "admin" });
    console.log("Found admin:", admin ? admin.email : "NOT FOUND");
    
    if (!admin) {
      console.error("Admin user not found, please run node seedAdmin.js first");
      process.exit(1);
    }

    const laptops = await Laptop.find().limit(3);
    if (laptops.length === 0) {
      console.error("No laptops found, please ensure they are seeded");
      process.exit(1);
    }

    // Create dummy Repair Bookings
    const repairCount = await RepairBooking.countDocuments();
    if (repairCount === 0) {
      await RepairBooking.insertMany([
        {
          userId: admin._id,
          name: "John Doe",
          email: "john@example.com",
          phone: "9876543210",
          deviceType: "Laptop",
          brand: "Dell",
          model: "Inspiron 15",
          issueDescription: "Screen flickering and battery draining fast",
          preferredDate: new Date(Date.now() + 86400000), // tomorrow
          preferredTime: "11:00 AM - 1:00 PM",
          status: "Pending",
        },
        {
          userId: admin._id,
          name: "Alice Smith",
          email: "alice@example.com",
          phone: "9988776655",
          deviceType: "Phone",
          brand: "Samsung",
          model: "S23 Ultra",
          issueDescription: "Water damage",
          preferredDate: new Date(Date.now() + 172800000), // day after tomorrow
          preferredTime: "2:00 PM - 4:00 PM",
          status: "Confirmed",
        },
      ]);
      console.log("Seeded dummy repair bookings");
    }

    // Create dummy Laptop Orders
    const orderCount = await LaptopOrder.countDocuments();
    if (orderCount === 0) {
      await LaptopOrder.insertMany([
        {
          userId: admin._id,
          laptopId: laptops[0]._id,
          name: "Bob Wilson",
          email: "bob@example.com",
          phone: "9123456789",
          status: "Pending",
        },
        {
          userId: admin._id,
          laptopId: laptops[1]._id,
          name: "Charlie Brown",
          email: "charlie@example.com",
          phone: "9223344556",
          status: "Delivered",
        },
      ]);
      console.log("Seeded dummy laptop orders");
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding extra data:", error.message);
    process.exit(1);
  }
};

seedExtraData();
