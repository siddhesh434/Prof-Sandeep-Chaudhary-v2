const express = require("express");
const router = express.Router();
const Facility = require("../models/Facility");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/images/facility");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Admin page - render facilities management interface
router.get("/admin/facilities.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/facilities");
});

// API: Get all facilities (with optional category filter)
router.get("/api/facilities", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const facilities = await Facility.find(filter).sort({ category: 1, order: 1 });
    res.json(facilities);
  } catch (error) {
    console.error("Error fetching facilities:", error);
    res.status(500).json({ error: "Failed to fetch facilities" });
  }
});

// API: Create new facility
router.post("/api/facilities", upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, order, isVisible } = req.body;
    
    const facilityData = {
      name,
      description,
      category,
      order: order || 0,
      isVisible: isVisible === "true" || isVisible === true,
    };

    if (req.file) {
      facilityData.image = `/images/facility/${req.file.filename}`;
    }

    const facility = new Facility(facilityData);
    await facility.save();

    res.status(201).json(facility);
  } catch (error) {
    console.error("Error creating facility:", error);
    res.status(500).json({ error: "Failed to create facility", details: error.message });
  }
});

// API: Update facility
router.put("/api/facilities/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, order, isVisible } = req.body;

    const updateData = {
      name,
      description,
      category,
      order: order || 0,
      isVisible: isVisible === "true" || isVisible === true,
    };

    if (req.file) {
      // Delete old image if exists
      const oldFacility = await Facility.findById(id);
      if (oldFacility && oldFacility.image) {
        const oldImagePath = path.join(__dirname, "../public", oldFacility.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/images/facility/${req.file.filename}`;
    }

    const facility = await Facility.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    res.json(facility);
  } catch (error) {
    console.error("Error updating facility:", error);
    res.status(500).json({ error: "Failed to update facility", details: error.message });
  }
});

// API: Delete facility
router.delete("/api/facilities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    // Delete associated image
    if (facility.image) {
      const imagePath = path.join(__dirname, "../public", facility.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Facility.findByIdAndDelete(id);
    res.json({ message: "Facility deleted successfully" });
  } catch (error) {
    console.error("Error deleting facility:", error);
    res.status(500).json({ error: "Failed to delete facility", details: error.message });
  }
});

// Public page - render facilities page with data
router.get("/facilities.html", async (req, res) => {
  try {
    const facilities = await Facility.find({ isVisible: true }).sort({ category: 1, order: 1 });
    
    // Group facilities by category
    const groupedFacilities = {
      research: facilities.filter(f => f.category === 'research'),
      characteristics: facilities.filter(f => f.category === 'characteristics'),
      durability: facilities.filter(f => f.category === 'durability'),
      casting: facilities.filter(f => f.category === 'casting')
    };
    
    res.render("facilities", { facilities: groupedFacilities });
  } catch (error) {
    console.error("Error loading facilities page:", error);
    res.render("facilities", { facilities: { research: [], characteristics: [], durability: [], casting: [] } });
  }
});

module.exports = router;
