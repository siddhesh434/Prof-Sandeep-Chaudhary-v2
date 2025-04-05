const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Conference =
  mongoose.models.Conference ||
  mongoose.model(
    "Conference",
    new mongoose.Schema({
      author: String,
      title: String,
      conference: String,
      date: String,
      place: String,
      year: Number,
    })
  );


///////////////////////////////////////Conference Routes/////////////////////////////////////////////////////////
// Conference Routes

// Render Conference Admin Page
router.get("/admin/conference.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login"); // Redirect if not logged in
  res.render("admin/conference", { adminID: req.session.admin }); // Render dashboard
});

// Create Conference Proceeding (POST)
router.post("/conferences", async (req, res) => {
  try {
    const newConference = new Conference(req.body);
    const savedConference = await newConference.save();
    res.status(201).json(savedConference);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Conference Proceedings (GET)
router.get("/conferences", async (req, res) => {
  try {
    const conferences = await Conference.find().sort({ year: -1 }); // Sort by most recent year
    res.json(conferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Conference Proceeding (GET by ID)
router.get("/conferences/:id", async (req, res) => {
  try {
    const conference = await Conference.findById(req.params.id);
    if (!conference) {
      return res
        .status(404)
        .json({ message: "Conference proceeding not found" });
    }
    res.json(conference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Conference Proceeding (PUT)
router.put("/conferences/:id", async (req, res) => {
  try {
    const updatedConference = await Conference.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedConference) {
      return res
        .status(404)
        .json({ message: "Conference proceeding not found" });
    }
    res.json(updatedConference);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Conference Proceeding (DELETE)
router.delete("/conferences/:id", async (req, res) => {
  try {
    const deletedConference = await Conference.findByIdAndDelete(req.params.id);
    if (!deletedConference) {
      return res
        .status(404)
        .json({ message: "Conference proceeding not found" });
    }
    res.json({ message: "Conference proceeding deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Optional: Search Conference Proceedings
router.get("/conferences/search", async (req, res) => {
  try {
    const { query, year, conference } = req.query;

    // Build a dynamic search query
    let searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ];
    }

    if (year) {
      searchQuery.year = parseInt(year);
    }

    if (conference) {
      searchQuery.conference = { $regex: conference, $options: "i" };
    }

    const conferences = await Conference.find(searchQuery)
      .sort({ year: -1 })
      .limit(50); // Limit to prevent overly broad searches

    res.json(conferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Additional Optional Routes

// Get Unique Years for Filtering
router.get("/conferences/years", async (req, res) => {
  try {
    const years = await Conference.distinct("year");
    res.json(years.sort((a, b) => b - a));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Conferences by Year
router.get("/conferences/year/:year", async (req, res) => {
  try {
    const conferences = await Conference.find({
      year: parseInt(req.params.year),
    }).sort({ date: 1 });
    res.json(conferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
////////////////////////////////////////////////////////////////////////////////////////////////
