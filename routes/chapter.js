const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Chapter =
  mongoose.models.Chapter ||
  mongoose.model(
    "Chapter",
    new mongoose.Schema({
      author: String,
      chapterName: String,
      bookName: String,
      year: Number,
      ISBN: String,
      Page: String,
    })
  );


/////////////////////////////////////////chapters///////////////////////////////////////////////////////

// Book Chapter Routes

// Render Book Chapter Admin Page
router.get("/admin/chapters.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login"); // Redirect if not logged in
  res.render("admin/chapters", { adminID: req.session.admin }); // Render dashboard
});

// Create Book Chapter (POST)
router.post("/chapters", async (req, res) => {
  try {
    const newChapter = new Chapter(req.body);
    const savedChapter = await newChapter.save();
    res.status(201).json(savedChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Book Chapters (GET)
router.get("/chapters", async (req, res) => {
  try {
    const chapters = await Chapter.find().sort({ year: -1 }); // Sort by most recent year
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Book Chapter (GET by ID)
router.get("/chapters/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: "Book chapter not found" });
    }
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Book Chapter (PUT)
router.put("/chapters/:id", async (req, res) => {
  try {
    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedChapter) {
      return res.status(404).json({ message: "Book chapter not found" });
    }
    res.json(updatedChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Book Chapter (DELETE)
router.delete("/chapters/:id", async (req, res) => {
  try {
    const deletedChapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!deletedChapter) {
      return res.status(404).json({ message: "Book chapter not found" });
    }
    res.json({ message: "Book chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Optional: Search Book Chapters
router.get("/chapters/search", async (req, res) => {
  try {
    const { query, year, bookName } = req.query;

    // Build a dynamic search query
    let searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { chapterName: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ];
    }

    if (year) {
      searchQuery.year = parseInt(year);
    }

    if (bookName) {
      searchQuery.bookName = { $regex: bookName, $options: "i" };
    }

    const chapters = await Chapter.find(searchQuery)
      .sort({ year: -1 })
      .limit(50); // Limit to prevent overly broad searches

    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;