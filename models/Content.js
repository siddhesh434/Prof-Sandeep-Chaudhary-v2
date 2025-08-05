// models/Content.js - Updated MongoDB Schema for Bulletin and Carousel
const mongoose = require('mongoose');

// Bulletin Schema
const bulletinSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    required: true,
    default: 'Latest News :'
  },
  message: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    default: 15,
    min: 5,
    max: 30
  },
  color: {
    type: String,
    enum: ['blue', 'red', 'green', 'orange', 'purple'],
    default: 'blue'
  },
  priority: {
    type: String,
    enum: ['normal', 'high', 'urgent'],
    default: 'normal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Carousel Slide Schema - Updated to store file paths instead of Base64
const carouselSlideSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String, // File path instead of Base64 (e.g., '/images/scoreCarousel/filename.jpg')
    required: true,
    default: '/images/placeholder.jpg'
  },
  order: {
    type: Number,
    required: true,
    default: 1
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
carouselSlideSchema.index({ order: 1 });
carouselSlideSchema.index({ active: 1 });
carouselSlideSchema.index({ id: 1 }, { unique: true });

// Middleware to update updatedAt timestamp
bulletinSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

carouselSlideSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual to get full image URL
carouselSlideSchema.virtual('imageUrl').get(function() {
  if (this.image && this.image.startsWith('/')) {
    return this.image; // Already a full path
  }
  return `/images/scoreCarousel/${this.image}`;
});

// Ensure virtual fields are serialized
carouselSlideSchema.set('toJSON', { virtuals: true });
carouselSlideSchema.set('toObject', { virtuals: true });

const Bulletin = mongoose.model('Bulletin', bulletinSchema);
const CarouselSlide = mongoose.model('CarouselSlide', carouselSlideSchema);

module.exports = { Bulletin, CarouselSlide };