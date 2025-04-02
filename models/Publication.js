const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
  author: String,
  title: String,
  journal: String,
  year: Number,
  volumePages: String,
  publicationLink: String,
  publicationDate: String,
  impactFactor: Number,
});

module.exports =
  mongoose.models.Publication ||
  mongoose.model("Publication", publicationSchema);
