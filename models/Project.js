const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  year: String,
  funded: String,
  collaborator: String,
  projectType: String,
  role: String,
});

module.exports =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
