const mongoose = require("mongoose");

const VALID_CATEGORIES = ["paper", "project", "technology"];
const MEDIA_TYPES = ["image", "pdf", "file", "link", "none"];
const DISPLAY_MODES = ["both", "text", "image"];
const ROW_NUMBERS = [1, 2];

const homeHighlightSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: VALID_CATEGORIES,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: function summaryRequired() {
        return this.displayMode !== "image";
      },
      trim: true,
    },
    ctaLabel: {
      type: String,
      default: "View Details",
      trim: true,
    },
    ctaUrl: {
      type: String,
      trim: true,
    },
    mediaType: {
      type: String,
      enum: MEDIA_TYPES,
      default: "none",
    },
    mediaUrl: {
      type: String,
      trim: true,
    },
    mediaOriginalName: String,
    mediaMimeType: String,
    mediaSize: Number,
    storedFilename: String,
    displayMode: {
      type: String,
      enum: DISPLAY_MODES,
      default: "both",
    },
    rowNumber: {
      type: Number,
      enum: ROW_NUMBERS,
      default: 1,
      index: true,
    },
    rowVisible: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: Date.now,
    },
    isVisible: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

homeHighlightSchema.index({ category: 1, order: 1, createdAt: -1 });

module.exports = mongoose.models.HomeHighlight
  ? mongoose.models.HomeHighlight
  : mongoose.model("HomeHighlight", homeHighlightSchema);

