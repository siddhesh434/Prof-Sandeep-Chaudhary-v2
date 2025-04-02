const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  author: String,
  chapterName: String,
  bookName: String,
  year: Number,
  ISBN: String,
  Page: String,
});

module.exports =
  mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);
