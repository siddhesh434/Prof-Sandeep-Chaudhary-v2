const express = require("express");
const router = express.Router();
const Dissertation = require("../models/Dissertation");
const Visibility = require("../models/Visibility");

// Render Dissertation Admin Page
router.get("/admin/dissertations.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/dissertations", { adminID: req.session.admin });
});

// Create Dissertation (POST)
router.post("/dissertations", async (req, res) => {
  try {
    const newDissertation = new Dissertation(req.body);
    const savedDissertation = await newDissertation.save();
    res.status(201).json(savedDissertation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Dissertations (GET)
router.get("/dissertations", async (req, res) => {
  try {
    const dissertations = await Dissertation.find().sort({ year: -1 });
    res.json(dissertations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Dissertation (GET by ID)
router.get("/dissertations/:id", async (req, res) => {
  try {
    const dissertation = await Dissertation.findById(req.params.id);
    if (!dissertation) {
      return res.status(404).json({ message: "Dissertation not found" });
    }
    res.json(dissertation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Dissertation (PUT)
router.put("/dissertations/:id", async (req, res) => {
  try {
    const updatedDissertation = await Dissertation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDissertation) {
      return res.status(404).json({ message: "Dissertation not found" });
    }
    res.json(updatedDissertation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Dissertation (DELETE)
router.delete("/dissertations/:id", async (req, res) => {
  try {
    const deletedDissertation = await Dissertation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDissertation) {
      return res.status(404).json({ message: "Dissertation not found" });
    }
    res.json({ message: "Dissertation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dissertations page route
router.get("/Dissertation.html", async (req, res) => {
  try {
    const researchData = await Dissertation.find();
    const settings = (await Visibility.findOne()) || {};
    res.render("Dissertation", { settings, researchData });
  } catch (error) {
    console.error("Error fetching dissertations:", error);
    res.status(500).send("Error loading dissertations");
  }
});

module.exports = router;
