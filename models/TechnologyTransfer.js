const mongoose = require("mongoose");

const technologyTransferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // Can include bullet points
  transferredTo: { type: String, required: true }, // e.g., "M/s Abhishek Bricks, Indore, M.P., India"
  transferPeriod: { type: String, required: true }, // e.g., "April 1, 2022 - March 31, 2025"
});

module.exports =
  mongoose.models.TechnologyTransfer ||
  mongoose.model("TechnologyTransfer", technologyTransferSchema);
