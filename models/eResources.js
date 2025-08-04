// UPDATED MODEL - models/eResources.js
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
  resourceType: {
    type: String,
    enum: ['file', 'youtube'],
    default: 'file'
  },
  // File-specific fields
  originalFilename: {
    type: String,
    required: function() { return this.resourceType === 'file'; }
  },
  storedFilename: {
    type: String,
    required: function() { return this.resourceType === 'file'; }
  },
  fileType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: function() { return this.resourceType === 'file'; },
    default: 0
  },
  // YouTube-specific fields
  youtubeUrl: {
    type: String,
    required: function() { return this.resourceType === 'youtube'; }
  },
  youtubeId: {
    type: String,
    required: function() { return this.resourceType === 'youtube'; }
  },
  // Common fields
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
