const mongoose = require("mongoose");

const keyTechnologySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    // Store tags as an array of strings for flexible filtering
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.KeyTechnology ||
  mongoose.model("KeyTechnology", keyTechnologySchema);


