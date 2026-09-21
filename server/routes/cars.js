const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const Car = require("../models/Car");

const router = express.Router();

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =====================================================
// MULTER SETUP
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    files: 13,
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// =====================================================
// HELPERS
// =====================================================

const parseOptionalNumber = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "null"
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

const cleanString = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

const getCarFields = (body) => ({
  name: cleanString(body.name),

  price: Number(body.price),

  make: cleanString(body.make),

  model: cleanString(body.model),

  year: parseOptionalNumber(body.year),

  color: cleanString(body.color),

  engineCC: parseOptionalNumber(body.engineCC),

  fuelType: cleanString(body.fuelType),

  transmission: cleanString(body.transmission),

  mileage: parseOptionalNumber(body.mileage),

  bodyType: cleanString(body.bodyType),

  driveType: cleanString(body.driveType),

  condition: cleanString(body.condition),

  seats: parseOptionalNumber(body.seats),

  doors: parseOptionalNumber(body.doors),

  location: cleanString(body.location),

  description: cleanString(body.description),
});

// =====================================================
// GET ALL CARS
// GET /api/cars
// =====================================================

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

// =====================================================
// GET SINGLE CAR
// GET /api/cars/:id
// =====================================================

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

// =====================================================
// ADD CAR
// POST /api/cars/add
//
// image  = main image
// images = gallery images
// =====================================================

router.post(
  "/add",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 12,
    },
  ]),
  async (req, res) => {
    try {
      const mainImage = req.files?.image?.[0];

      const galleryImages = req.files?.images || [];

      if (!mainImage) {
        return res.status(400).json({
          message: "Main image is required",
        });
      }

      const fields = getCarFields(req.body);

      if (!fields.name) {
        return res.status(400).json({
          message: "Car name is required",
        });
      }

      if (!Number.isFinite(fields.price) || fields.price <= 0) {
        return res.status(400).json({
          message: "Valid car price is required",
        });
      }

      const newCar = new Car({
        ...fields,

        imageUrl: `/uploads/${mainImage.filename}`,

        images: galleryImages.map(
          (file) => `/uploads/${file.filename}`
        ),
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
  }
);

// =====================================================
// EDIT CAR
// PUT /api/cars/edit/:id
//
// image = optional new main image
// images = new gallery images
// existingImages = gallery images to keep
// =====================================================

router.put(
  "/edit/:id",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 12,
    },
  ]),
  async (req, res) => {
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

      const fields = getCarFields(req.body);

      if (!fields.name) {
        return res.status(400).json({
          message: "Car name is required",
        });
      }

      if (!Number.isFinite(fields.price) || fields.price <= 0) {
        return res.status(400).json({
          message: "Valid car price is required",
        });
      }

      // Update all vehicle information
      Object.assign(car, fields);

      // -------------------------------------------------
      // MAIN IMAGE
      // -------------------------------------------------

      const newMainImage = req.files?.image?.[0];

      if (newMainImage) {
        car.imageUrl = `/uploads/${newMainImage.filename}`;
      }

      // -------------------------------------------------
      // EXISTING GALLERY IMAGES
      // -------------------------------------------------

      let existingImages = [];

      if (req.body.existingImages !== undefined) {
        try {
          const parsed = JSON.parse(req.body.existingImages);

          if (Array.isArray(parsed)) {
            existingImages = parsed.filter(
              (image) =>
                typeof image === "string" &&
                image.trim() !== ""
            );
          }
        } catch (parseError) {
          console.warn(
            "Could not parse existingImages:",
            parseError.message
          );
        }
      } else {
        // Backward compatibility
        existingImages = Array.isArray(car.images)
          ? car.images
          : [];
      }

      // -------------------------------------------------
      // NEW GALLERY IMAGES
      // -------------------------------------------------

      const newGalleryImages = (
        req.files?.images || []
      ).map((file) => `/uploads/${file.filename}`);

      // Keep existing + add new
      car.images = [
        ...existingImages,
        ...newGalleryImages,
      ];

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
  }
);

// =====================================================
// DELETE CAR
// DELETE /api/cars/delete/:id
// =====================================================

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

// =====================================================
// MULTER ERROR HANDLER
// =====================================================

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);

    return res.status(400).json({
      message: `Upload error: ${err.message}`,
      code: err.code,
    });
  }

  if (err) {
    console.error("Upload error:", err);

    return res.status(400).json({
      message: err.message || "File upload failed",
    });
  }

  next();
});

module.exports = router;