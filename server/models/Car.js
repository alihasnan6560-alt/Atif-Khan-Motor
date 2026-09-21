const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    make: {
      type: String,
      default: "",
      trim: true,
    },

    model: {
      type: String,
      default: "",
      trim: true,
    },

    year: {
      type: Number,
      default: null,
    },

    color: {
      type: String,
      default: "",
      trim: true,
    },

    // Engine & Performance
    engineCC: {
      type: Number,
      default: null,
    },

    fuelType: {
      type: String,
      default: "",
      trim: true,
    },

    transmission: {
      type: String,
      default: "",
      trim: true,
    },

    mileage: {
      type: Number,
      default: null,
    },

    // Vehicle Details
    bodyType: {
      type: String,
      default: "",
      trim: true,
    },

    driveType: {
      type: String,
      default: "",
      trim: true,
    },

    condition: {
      type: String,
      default: "",
      trim: true,
    },

    seats: {
      type: Number,
      default: null,
    },

    doors: {
      type: Number,
      default: null,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    // Images
    imageUrl: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    // Description
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Car", carSchema);