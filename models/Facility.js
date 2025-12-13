const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    required: true,
    enum: ['research', 'characteristics', 'durability', 'casting'],
    default: 'general'
  },
  image: {
    type: String,
    default: ""
  },
  order: {
    type: Number,
    default: 0
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
facilitySchema.index({ category: 1, order: 1 });

const Facility = mongoose.model("Facility", facilitySchema);

module.exports = Facility;
