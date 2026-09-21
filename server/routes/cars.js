const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");

const Car = require("../models/Car");

const router = express.Router();

// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================================================
// MULTER SETUP
// =====================================================
// Files are kept temporarily in memory and uploaded
// directly to Cloudinary.

const storage = multer.memoryStorage();

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
// CLOUDINARY UPLOAD HELPER
// =====================================================

const uploadToCloudinary = (file, folder = "hasnain-automotive") => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("Invalid image file"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};

// =====================================================
// UPLOAD MULTIPLE IMAGES
// =====================================================

const uploadImagesToCloudinary = async (
  files = [],
  folder = "hasnain-automotive"
) => {
  if (!files.length) {
    return [];
  }

  return Promise.all(
    files.map((file) => uploadToCloudinary(file, folder))
  );
};

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

      // -------------------------------------------------
      // UPLOAD MAIN IMAGE TO CLOUDINARY
      // -------------------------------------------------

      const mainUpload = await uploadToCloudinary(
        mainImage,
        "hasnain-automotive/cars"
      );

      // -------------------------------------------------
      // UPLOAD GALLERY IMAGES TO CLOUDINARY
      // -------------------------------------------------

      const galleryUploads = await uploadImagesToCloudinary(
        galleryImages,
        "hasnain-automotive/cars"
      );

      // -------------------------------------------------
      // CREATE CAR
      // -------------------------------------------------

      const newCar = new Car({
        ...fields,

        imageUrl: mainUpload.secure_url,

        images: galleryUploads.map(
          (image) => image.secure_url
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

      // -------------------------------------------------
      // UPDATE VEHICLE INFORMATION
      // -------------------------------------------------

      Object.assign(car, fields);

      // -------------------------------------------------
      // MAIN IMAGE
      // -------------------------------------------------

      const newMainImage = req.files?.image?.[0];

      if (newMainImage) {
        const mainUpload = await uploadToCloudinary(
          newMainImage,
          "hasnain-automotive/cars"
        );

        car.imageUrl = mainUpload.secure_url;
      }

      // -------------------------------------------------
      // EXISTING GALLERY IMAGES
      // -------------------------------------------------

      let existingImages = [];

      if (req.body.existingImages !== undefined) {
        try {
          const parsed = JSON.parse(
            req.body.existingImages
          );

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

      const newGalleryImages = req.files?.images || [];

      const galleryUploads = await uploadImagesToCloudinary(
        newGalleryImages,
        "hasnain-automotive/cars"
      );

      const newGalleryUrls = galleryUploads.map(
        (image) => image.secure_url
      );

      // -------------------------------------------------
      // KEEP EXISTING + ADD NEW
      // -------------------------------------------------

      car.images = [
        ...existingImages,
        ...newGalleryUrls,
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
// MULTER / UPLOAD ERROR HANDLER
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