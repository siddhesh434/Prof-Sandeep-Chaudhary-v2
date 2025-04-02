const express = require("express");
const router = express.Router();
const Publication = require("../models/Publication");
const Conference = require("../models/Conference");
const Book = require("../models/Book");
const Chapter = require("../models/Chapter");
const Visibility = require("../models/Visibility");

// Render Publication Admin Page
router.get("/admin/publication.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/publication", { adminID: req.session.admin });
});

// Create Publication (POST)
router.post("/publications", async (req, res) => {
  try {
    const newPublication = new Publication(req.body);
    const savedPublication = await newPublication.save();
    res.status(201).json(savedPublication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Publications (GET)
router.get("/publications", async (req, res) => {
  try {
    const publications = await Publication.find().sort({ year: -1 });
    res.json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Publication (GET by ID)
router.get("/publications/:id", async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }
    res.json(publication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Publication (PUT)
router.put("/publications/:id", async (req, res) => {
  try {
    const updatedPublication = await Publication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPublication) {
      return res.status(404).json({ message: "Publication not found" });
    }
    res.json(updatedPublication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Publication (DELETE)
router.delete("/publications/:id", async (req, res) => {
  try {
    const deletedPublication = await Publication.findByIdAndDelete(
      req.params.id
    );
    if (!deletedPublication) {
      return res.status(404).json({ message: "Publication not found" });
    }
    res.json({ message: "Publication deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Publications page route
router.get("/publication.html", async (req, res) => {
  try {
    const publications = await Publication.find().sort({
      year: -1,
      impactFactor: -1,
    });
    const conferences = await Conference.find().sort({ year: -1, date: -1 });
    const books = await Book.find().sort({ year: -1 });
    const chapters = await Chapter.find().sort({ year: -1 });
    const settings = (await Visibility.findOne()) || {};

    // Group by year
    const publicationsByYear = {};
    const conferencesByYear = {};
    const booksByYear = {};
    const chaptersByYear = {};

    publications.forEach((pub) => {
      if (!publicationsByYear[pub.year]) publicationsByYear[pub.year] = [];
      publicationsByYear[pub.year].push(pub);
    });

    conferences.forEach((conf) => {
      if (!conferencesByYear[conf.year]) conferencesByYear[conf.year] = [];
      conferencesByYear[conf.year].push(conf);
    });

    books.forEach((book) => {
      if (!booksByYear[book.year]) booksByYear[book.year] = [];
      booksByYear[book.year].push(book);
    });

    chapters.forEach((chapter) => {
      if (!chaptersByYear[chapter.year]) chaptersByYear[chapter.year] = [];
      chaptersByYear[chapter.year].push(chapter);
    });

    res.render("publication", {
      settings,
      publications,
      publicationsByYear,
      conferences,
      conferencesByYear,
      books,
      booksByYear,
      chapters,
      chaptersByYear,
    });
  } catch (error) {
    console.error("Error fetching publications:", error);
    res.status(500).send("Error loading publications");
  }
});

module.exports = router;
