const express = require("express");
const router = express.Router();
const Patent = require("../models/Patent");
const Visibility = require("../models/Visibility");

// Render Patent Admin Page
router.get("/admin/patents.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/patents", { adminID: req.session.admin });
});

// Create Patent (POST)
router.post("/patents", async (req, res) => {
  try {
    const newPatent = new Patent(req.body);
    const savedPatent = await newPatent.save();
    res.status(201).json(savedPatent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Patents (GET)
router.get("/patents", async (req, res) => {
  try {
    const patents = await Patent.find().sort({ year: -1 });
    res.json(patents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Patent (GET by ID)
router.get("/patents/:id", async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);
    if (!patent) {
      return res.status(404).json({ message: "Patent not found" });
    }
    res.json(patent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Patent (PUT)
router.put("/patents/:id", async (req, res) => {
  try {
    const updatedPatent = await Patent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPatent) {
      return res.status(404).json({ message: "Patent not found" });
    }
    res.json(updatedPatent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Patent (DELETE)
router.delete("/patents/:id", async (req, res) => {
  try {
    const deletedPatent = await Patent.findByIdAndDelete(req.params.id);
    if (!deletedPatent) {
      return res.status(404).json({ message: "Patent not found" });
    }
    res.json({ message: "Patent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Patents page route
router.get("/patents.html", async (req, res) => {
  try {
    const Patent = require("../models/Patent");
    const TechnologyTransfer = require("../models/TechnologyTransfer");
    const Visibility = require("../models/Visibility");
    
    const patents = await Patent.find();
    const technologyTransfers = await TechnologyTransfer.find();
    const settings = (await Visibility.findOne()) || {};
    
    res.render("patents", { settings, patents, technologyTransfers });
  } catch (error) {
    console.error("Error fetching patents:", error);
    res.status(500).send("Error loading patents");
  }
});

module.exports = router;
