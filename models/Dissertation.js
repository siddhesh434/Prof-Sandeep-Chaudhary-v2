const mongoose = require("mongoose");

const dissertationSchema = new mongoose.Schema({
  name: String,
  title: String,
  year: String,
  coSupervisors: String,
  degree: String,
});

module.exports =
  mongoose.models.Dissertation ||
  mongoose.model("Dissertation", dissertationSchema);
