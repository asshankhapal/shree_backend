require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@shree.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Existing user promoted to admin:", adminEmail);
    } else {
      await User.create({
        username: "Admin",
        email: adminEmail,
        password: "adminpassword123",
        role: "admin",
      });
      console.log("New admin user created:", adminEmail);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
