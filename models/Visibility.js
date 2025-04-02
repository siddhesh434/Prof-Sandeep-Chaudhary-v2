const mongoose = require("mongoose");

const visibilitySchema = new mongoose.Schema({
  showPublications: { type: Boolean, default: false },
  showPatents: { type: Boolean, default: false },
  showProjects: { type: Boolean, default: false },
  showDissertation: { type: Boolean, default: false },
});

module.exports =
  mongoose.models.Visibility || mongoose.model("Visibility", visibilitySchema);
