const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Book =
  mongoose.models.Book ||
  mongoose.model(
    "Book",
    new mongoose.Schema({
      author: String,
      title: String,
      year: Number,
      isbn: String,
      photo: String,
    })
  );


router.get("/admin/book.html", (req, res) => {
    if (!req.session.admin) return res.redirect("/admin/login"); // Redirect if not logged in
    res.render("admin/book", { adminID: req.session.admin }); // Render dashboard
  });
  
  router.post("/books", async (req, res) => {
    try {
      const newBook = new Book(req.body);
      const savedBook = await newBook.save();
      res.status(201).json(savedBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Read All (GET)
  router.get("/books", async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Read One (GET by ID)
  router.get("/books/:id", async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update (PUT)
  router.put("/books/:id", async (req, res) => {
    try {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(updatedBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete (DELETE)
  router.delete("/books/:id", async (req, res) => {
    try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      if (!deletedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
