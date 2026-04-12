const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../utils/mailService");

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    await sendContactEmail({ name, email, subject, message });

    res.status(200).json({ message: "Your inquiry has been sent successfully. We'll get back to you soon!" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Failed to send your message. Please try again later." });
  }
});

module.exports = router;
