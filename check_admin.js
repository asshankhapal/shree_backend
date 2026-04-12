require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("-----------------------------------------");
    console.log("DIAGNOSTIC: Checking Admin User Status");
    console.log("-----------------------------------------");

    const admin = await User.findOne({ email: "admin@shree.com" });
    
    if (!admin) {
      console.log("RESULT: [NOT FOUND] No user found with email admin@shree.com");
    } else {
      console.log(`RESULT: [FOUND]`);
      console.log(`- Username: ${admin.username}`);
      console.log(`- Email: ${admin.email}`);
      console.log(`- Role: ${admin.role}`);
      console.log(`- Password Hash exists: ${!!admin.password}`);
      console.log(`- Created At: ${admin.createdAt}`);
      
      if (admin.role !== "admin") {
        console.log("WARNING: User found but ROLE is NOT admin!");
      }
    }
    console.log("-----------------------------------------");
    process.exit(0);
  } catch (error) {
    console.error("DIAGNOSTIC ERROR:", error.message);
    process.exit(1);
  }
};

checkAdmin();
