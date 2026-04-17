require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const laptopRoutes = require("./routes/laptops");
const repairRoutes = require("./routes/repairs");
const contactRoutes = require("./routes/contact");

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://www.shreeenterprise.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in whitelist or is a authorized domain
    const isAllowed = allowedOrigins.some(allowed => {
      if (!allowed) return false;
      return origin.startsWith(allowed.replace(/\/$/, ''));
    }) || 
    /^http:\/\/localhost:\d+$/.test(origin) ||
    origin.endsWith(".onrender.com") ||
    origin.includes("shreeenterprise.app");

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/laptops", laptopRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Super Computers API is running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  console.error("STACK:", err.stack);
  res.status(500).json({ message: err.message, stack: err.stack });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
