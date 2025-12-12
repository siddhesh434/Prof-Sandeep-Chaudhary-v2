const express = require("express");
const router = express.Router();
const KeyTechnology = require("../models/KeyTechnology");
const defaultKeyTechnologies = require("../data/defaultKeyTechnologies");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure upload directory
const uploadDir = path.join(__dirname, "../public/uploads/keyTechnology");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

// Render Key Technologies Admin Page
router.get("/admin/keyTechnology.html", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");

  try {
    const count = await KeyTechnology.countDocuments();
    if (count === 0) {
      await KeyTechnology.insertMany(defaultKeyTechnologies);
    }
  } catch (error) {
    console.error("Error seeding default key technologies:", error);
  }

  res.render("admin/keyTechnology", { adminID: req.session.admin });
});

// Create Key Technology
router.post(
  "/api/key-technologies",
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, tags } = req.body;
      let imageUrl = req.body.imageUrl; // Fallback if no file

      if (req.file) {
        imageUrl = `/uploads/keyTechnology/${req.file.filename}`;
      }

      if (!title || !description || !imageUrl) {
        return res.status(400).json({
          message: "Title, description and image are required",
        });
      }

      const tagsArray = Array.isArray(tags)
        ? tags
        : typeof tags === "string" && tags.trim() !== ""
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const tech = new KeyTechnology({
        title,
        description,
        imageUrl,
        tags: tagsArray,
      });

      const saved = await tech.save();
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error creating key technology:", error);
      res.status(500).json({ message: "Error creating key technology" });
    }
  }
);

// Read All Key Technologies
router.get("/api/key-technologies", async (req, res) => {
  try {
    const techs = await KeyTechnology.find().sort({ createdAt: -1 });
    res.json(techs);
  } catch (error) {
    console.error("Error fetching key technologies:", error);
    res.status(500).json({ message: "Error fetching key technologies" });
  }
});

// Read One Key Technology
router.get("/api/key-technologies/:id", async (req, res) => {
  try {
    const tech = await KeyTechnology.findById(req.params.id);
    if (!tech) {
      return res.status(404).json({ message: "Key technology not found" });
    }
    res.json(tech);
  } catch (error) {
    console.error("Error fetching key technology:", error);
    res.status(500).json({ message: "Error fetching key technology" });
  }
});

// Update Key Technology
router.put(
  "/api/key-technologies/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, tags } = req.body;
      let imageUrl = req.body.imageUrl;

      const tech = await KeyTechnology.findById(req.params.id);
      if (!tech) {
        return res.status(404).json({ message: "Key technology not found" });
      }

      if (req.file) {
        // Delete old image if it exists and is local
        if (
          tech.imageUrl &&
          tech.imageUrl.startsWith("/uploads/keyTechnology/")
        ) {
          const oldPath = path.join(
            __dirname,
            "../public",
            tech.imageUrl.replace(/\//g, path.sep)
          );
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        imageUrl = `/uploads/keyTechnology/${req.file.filename}`;
      } else {
        // Keep existing image if no new file or url provided
        imageUrl = imageUrl || tech.imageUrl;
      }

      const tagsArray = Array.isArray(tags)
        ? tags
        : typeof tags === "string" && tags.trim() !== ""
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const updated = await KeyTechnology.findByIdAndUpdate(
        req.params.id,
        { title, description, imageUrl, tags: tagsArray },
        { new: true, runValidators: true }
      );

      res.json(updated);
    } catch (error) {
      console.error("Error updating key technology:", error);
      res.status(500).json({ message: "Error updating key technology" });
    }
  }
);

// Delete Key Technology
router.delete("/api/key-technologies/:id", async (req, res) => {
  try {
    const tech = await KeyTechnology.findById(req.params.id);
    if (!tech) {
      return res.status(404).json({ message: "Key technology not found" });
    }

    // Delete image file if it exists and is local
    if (tech.imageUrl && tech.imageUrl.startsWith("/uploads/keyTechnology/")) {
      const imagePath = path.join(
        __dirname,
        "../public",
        tech.imageUrl.replace(/\//g, path.sep)
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await KeyTechnology.findByIdAndDelete(req.params.id);
    res.json({ message: "Key technology deleted successfully" });
  } catch (error) {
    console.error("Error deleting key technology:", error);
    res.status(500).json({ message: "Error deleting key technology" });
  }
});

module.exports = router;


