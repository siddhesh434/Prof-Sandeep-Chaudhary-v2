// Generate resource model schema for reference
// Include this in the appropriate models directory

const mongoose = require('mongoose');

const eResourceSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  storedFilename: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date
  }
});

const eResource = mongoose.model('eResource', eResourceSchema);

module.exports = eResource;
