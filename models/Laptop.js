const mongoose = require("mongoose");

const laptopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, default: "" },
    specs: {
      processor: { type: String },
      ram: { type: String },
      storage: { type: String },
      display: { type: String },
    },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Laptop", laptopSchema);
