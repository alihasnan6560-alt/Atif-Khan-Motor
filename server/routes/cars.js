const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const Car = require("../models/Car");

const router = express.Router();

/* =====================================================
   MULTER SETUP
===================================================== */

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${Date.now()}${extension}`);
  },
});

const upload = multer({
  storage,
});

/* =====================================================
   GET ALL CARS
   GET /api/cars
===================================================== */

router.get("/", async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    console.error("Get cars error:", err);

    res.status(500).json({
      message: "Failed to fetch cars",
      error: err.message,
    });
  }
});

/* =====================================================
   GET SINGLE CAR
   GET /api/cars/:id
===================================================== */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid car ID",
      });
    }

    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.json(car);
  } catch (err) {
    console.error("Get single car error:", err);

    res.status(500).json({
      message: "Failed to fetch car",
      error: err.message,
    });
  }
});

/* =====================================================
   ADD CAR
   POST /api/cars/add
===================================================== */

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const name = (req.body.name || "").trim();
    const price = Number(req.body.price);

    if (!name) {
      return res.status(400).json({
        message: "Car name is required",
      });
    }

    if (!Number.isFinite(price)) {
      return res.status(400).json({
        message: "Valid car price is required",
      });
    }

    const newCar = new Car({
      name,
      price,
      imageUrl: `/uploads/${req.file.filename}`,
      description: req.body.description || "",
    });

    await newCar.save();

    res.status(201).json(newCar);
  } catch (err) {
    console.error("Add car error:", err);

    res.status(500).json({
      message: "Failed to add car",
      error: err.message,
    });
  }
});

/* =====================================================
   EDIT CAR
   PUT /api/cars/edit/:id
===================================================== */

router.put("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid car ID",
      });
    }

    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    const name = (req.body.name || "").trim();
    const price = Number(req.body.price);

    if (!name) {
      return res.status(400).json({
        message: "Car name is required",
      });
    }

    if (!Number.isFinite(price)) {
      return res.status(400).json({
        message: "Valid car price is required",
      });
    }

    // Update text fields
    car.name = name;
    car.price = price;

    if (req.body.description !== undefined) {
      car.description = req.body.description;
    }

    // Replace image only if a new image was selected
    if (req.file) {
      car.imageUrl = `/uploads/${req.file.filename}`;
    }

    await car.save();

    res.json({
      success: true,
      message: "Car updated successfully",
      car,
    });
  } catch (err) {
    console.error("Edit car error:", err);

    res.status(500).json({
      message: "Failed to update car",
      error: err.message,
    });
  }
});

/* =====================================================
   DELETE CAR
   DELETE /api/cars/delete/:id
===================================================== */

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid car ID",
      });
    }

    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (err) {
    console.error("Delete car error:", err);

    res.status(500).json({
      message: "Failed to delete car",
      error: err.message,
    });
  }
});

module.exports = router;