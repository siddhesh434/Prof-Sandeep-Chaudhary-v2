const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Request Model
const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  description: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
});

const Request = mongoose.model("Request", requestSchema);

// Home page - Request Form
router.get("/contact", (req, res) => {
  res.render("contact", { successMessage: req.query.success });
});

router.get("/contactform", (req, res) => {
  res.render("contactform", { successMessage: req.query.success });
});

// API - Create a new request
router.post("/api/requests", async (req, res) => {
  try {
    const { name, email, contact, description } = req.body;

    // Validation
    if (!name || !email || !contact || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new Request({
      name,
      email,
      contact,
      description,
    });

    await newRequest.save();
    res
      .status(201)
      .json({ message: "Request submitted successfully", request: newRequest });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// API - Get all requests
router.get("/api/requests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// API - Mark request as resolved
router.put("/api/requests/:id/resolve", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.resolved = true;
    request.resolvedAt = new Date();
    await request.save();

    res.json({ message: "Request marked as resolved", request });
  } catch (error) {
    console.error("Error resolving request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// API - Delete request
router.delete("/api/requests/:id", async (req, res) => {
  try {
    const result = await Request.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
