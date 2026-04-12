require("dotenv").config();
const mongoose = require("mongoose");
const RepairBooking = require("../models/RepairBooking");
const LaptopOrder = require("../models/LaptopOrder");

const clearStaticData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for data cleanup");

    // Clear Repair Bookings
    const repairResult = await RepairBooking.deleteMany({});
    console.log(`Deleted ${repairResult.deletedCount} repair bookings`);

    // Clear Laptop Orders
    const orderResult = await LaptopOrder.deleteMany({});
    console.log(`Deleted ${orderResult.deletedCount} laptop orders`);

    console.log("Cleanup complete! The admin portal will now only show new user data.");
    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error.message);
    process.exit(1);
  }
};

clearStaticData();
