const express = require("express");
const router = express.Router();
const ResearchMember = require("../models/ResearchGroup");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../public/uploads/images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: Images Only!"));
  },
});

// Middleware to check admin authorization
const isAdmin = (req, res, next) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  next();
};

// Render the Research Members Management page
router.get("/admin/researchMembers.html", isAdmin, (req, res) => {
  res.render("admin/researchMembers", { adminID: req.session.admin });
});

// Get all research members
router.get("/members", isAdmin, async (req, res) => {
  try {
    const members = await ResearchMember.find().sort({ year: -1 });
    res.json(members);
  } catch (error) {
    console.error("Error fetching research members:", error);
    res.status(500).json({ message: "Failed to fetch research members" });
  }
});

// Get a specific research member by ID
router.get("/members/:id", isAdmin, async (req, res) => {
  try {
    const member = await ResearchMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Research member not found" });
    }
    res.json(member);
  } catch (error) {
    console.error("Error fetching research member:", error);
    res.status(500).json({ message: "Failed to fetch research member" });
  }
});

// Create a new research member
router.post("/members", isAdmin, upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      position,
      scholarLink,
      scholarTopic,
      year,
      type,
      status,
      // photoUrl is now handled via file upload or manual entry if needed (though UI will prioritize file)
      // We can still support a fallback manual URL if we really want, but let's stick to file first.
    } = req.body;

    // Basic validation
    if (!name || !type) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    let finalPhotoUrl = req.body.photoUrl || ""; // Allow manual URL if provided (legacy/fallback)
    if (req.file) {
      finalPhotoUrl = `/uploads/images/${req.file.filename}`;
    }

    const newMember = new ResearchMember({
      name,
      position,
      scholarLink,
      scholarTopic,
      year: year,
      type,
      photoUrl: finalPhotoUrl,
      status,
    });

    await newMember.save();
    res
      .status(201)
      .json({
        message: "Research member added successfully",
        member: newMember,
      });
  } catch (error) {
    console.error("Error adding research member:", error);
    res.status(500).json({ message: error.message || "Failed to add research member" });
  }
});

// Update a research member
router.put("/members/:id", isAdmin, upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      position,
      scholarLink,
      scholarTopic,
      year,
      type,
      status,
      photoUrl: existingPhotoUrl, 
    } = req.body;

    // Basic validation
    if (!name || !type) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    let finalPhotoUrl = existingPhotoUrl; // Start with existing/manual value
    if (req.file) {
      finalPhotoUrl = `/uploads/images/${req.file.filename}`;
    }

    const updatedMember = await ResearchMember.findByIdAndUpdate(
      req.params.id,
      {
        name,
        position,
        scholarLink,
        scholarTopic,
        year: year,
        type,
        photoUrl: finalPhotoUrl,
        status,
      },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Research member not found" });
    }

    res.json({
      message: "Research member updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Error updating research member:", error);
    res.status(500).json({ message: "Failed to update research member" });
  }
});

// Delete a research member
router.delete("/members/:id", isAdmin, async (req, res) => {
  try {
    const member = await ResearchMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Research member not found" });
    }

    // Optional: Delete the image file if it exists and is local
    if (member.photoUrl && member.photoUrl.startsWith("/uploads/images/")) {
        const filePath = path.join(__dirname, "../public", member.photoUrl);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (e) {
                console.warn("Could not delete image file:", e);
            }
        }
    }

    await ResearchMember.findByIdAndDelete(req.params.id);

    res.json({ message: "Research member deleted successfully" });
  } catch (error) {
    console.error("Error deleting research member:", error);
    res.status(500).json({ message: "Failed to delete research member" });
  }
});

// Public route for the research group page - grouped by type
router.get("/researchGroups", async (req, res) => {
  try {
    const members = await ResearchMember.find().sort({ year: -1 });

    // Group members by type
    // Return the raw list for frontend processing
    const result = members.map((member) => ({
      name: member.name,
      position: member.position,
      scholarLink: member.scholarLink,
      scholarTopic: member.scholarTopic,
      year: member.year,
      type: member.type,
      status: member.status || "Current", // Default to current if undefined
      photoUrl: member.photoUrl || "/images/placeholder.jpg",
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching research group members:", error);
    res.status(500).json({ error: "Error fetching research group members" });
  }
});

module.exports = router;