const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  originalFilename: { type: String, required: true },
  storedFilename: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
});

// Add text indexes for search
fileSchema.index({ fileName: "text", description: "text" });

module.exports = mongoose.model("File", fileSchema);
