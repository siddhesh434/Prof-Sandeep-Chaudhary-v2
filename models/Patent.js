const mongoose = require("mongoose");

const patentSchema = new mongoose.Schema({
  title: String,
  authors: String,
  year: Number,
  applicationNumber: String,
  grantNumber: String,
  grantDate: String,
  description: String,
});

module.exports =
  mongoose.models.Patent || mongoose.model("Patent", patentSchema);
