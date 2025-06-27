const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  originalFilename: {
    type: String,
    required: true
  },
  storedFilename: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

// Virtual for getting the public URL (if needed)
ImageSchema.virtual('publicUrl').get(function() {
  return `/uploads/${this.storedFilename}`;
});

module.exports = mongoose.model('Image', ImageSchema);