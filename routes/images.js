const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Image = require("../models/Image");

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, "../public/uploads/images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    // Use original filename (with sanitization)
    const sanitizedName = file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    cb(null, sanitizedName);
  }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images (JPEG, JPG, PNG, GIF, WEBP) are allowed."));
  }
};

// Configure multer upload for images
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for images
  fileFilter: imageFilter
});

// Get all images
router.get("/api/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadDate: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching images",
      error: error.message
    });
  }
});

// Upload image
router.post("/api/images/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    // Create new image record
    const newImage = new Image({
      originalFilename: req.file.originalname,
      storedFilename: req.file.filename,
      url: `/uploads/images/${req.file.filename}`,
      fileType: req.file.mimetype,
      size: req.file.size
    });

    // Save to database
    const savedImage = await newImage.save();

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: savedImage
    });
  } catch (error) {
    // Attempt to remove uploaded image if there was an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error removing image after failed upload:", unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message
    });
  }
});

// Delete image
router.delete("/api/images/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found"
      });
    }

    const imagePath = path.join(imagesDir, image.storedFilename);

    // Delete image from filesystem if it exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete record from database
    await Image.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Image deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message
    });
  }
});

module.exports = router;