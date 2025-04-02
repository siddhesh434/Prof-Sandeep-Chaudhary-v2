const mongoose = require("mongoose");

const researchGroupSchema = new mongoose.Schema({
  name: String,
  position: String,
  scholarLink: String,
  scholarTopic: String,
  year: String,
  type: String,
  photoUrl: String,
});

module.exports =
  mongoose.models.ResearchGroup ||
  mongoose.model("ResearchGroup", researchGroupSchema);
