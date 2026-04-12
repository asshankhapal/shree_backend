require("dotenv").config();
const mongoose = require("mongoose");
const LaptopOrder = require("./models/LaptopOrder");
const RepairBooking = require("./models/RepairBooking");

async function checkDates() {
  await mongoose.connect(process.env.MONGO_URI);
  const orders = await LaptopOrder.find();
  const repairs = await RepairBooking.find();
  
  console.log("ORDERS DATES:");
  orders.forEach(o => console.log(o.createdAt));
  
  console.log("\nREPAIRS DATES:");
  repairs.forEach(r => console.log(r.preferredDate));
  
  process.exit(0);
}

checkDates();
