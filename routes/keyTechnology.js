const express = require("express");
const router = express.Router();
const KeyTechnology = require("../models/KeyTechnology");
const defaultKeyTechnologies = require("../data/defaultKeyTechnologies");

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
router.post("/api/key-technologies", async (req, res) => {
  try {
    const { title, description, imageUrl, tags } = req.body;

    if (!title || !description || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Title, description and image URL are required" });
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string" && tags.trim() !== ""
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
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
});

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
router.put("/api/key-technologies/:id", async (req, res) => {
  try {
    const { title, description, imageUrl, tags } = req.body;

    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string" && tags.trim() !== ""
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const updated = await KeyTechnology.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, tags: tagsArray },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Key technology not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating key technology:", error);
    res.status(500).json({ message: "Error updating key technology" });
  }
});

// Delete Key Technology
router.delete("/api/key-technologies/:id", async (req, res) => {
  try {
    const deleted = await KeyTechnology.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Key technology not found" });
    }
    res.json({ message: "Key technology deleted successfully" });
  } catch (error) {
    console.error("Error deleting key technology:", error);
    res.status(500).json({ message: "Error deleting key technology" });
  }
});

module.exports = router;


