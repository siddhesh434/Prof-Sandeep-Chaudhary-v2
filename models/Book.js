const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  author: String,
  title: String,
  year: Number,
  isbn: String,
  photo: String,
  link: String,
});

module.exports = mongoose.models.Book || mongoose.model("Book", bookSchema);
