const mongoose = require("mongoose");

const conferenceSchema = new mongoose.Schema({
  author: String,
  title: String,
  conference: String,
  date: String,
  place: String,
  year: Number,
});

module.exports =
  mongoose.models.Conference || mongoose.model("Conference", conferenceSchema);
