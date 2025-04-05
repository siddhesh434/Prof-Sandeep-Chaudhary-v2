const mongoose = require('mongoose');

// Define the Extension Activity schema
const ExtensionActivitySchema = new mongoose.Schema({
  serialNumber: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Government Advisory Roles', 'International Contributions', 'National Contributions']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: String,
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model('ExtensionActivity', ExtensionActivitySchema);