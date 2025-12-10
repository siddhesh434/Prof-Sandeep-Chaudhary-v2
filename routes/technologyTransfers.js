const express = require("express");
const router = express.Router();
const TechnologyTransfer = require("../models/TechnologyTransfer");

// Create Technology Transfer (POST)
router.post("/technology-transfers", async (req, res) => {
  try {
    const newTransfer = new TechnologyTransfer(req.body);
    const savedTransfer = await newTransfer.save();
    res.status(201).json(savedTransfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Technology Transfers (GET)
router.get("/technology-transfers", async (req, res) => {
  try {
    const transfers = await TechnologyTransfer.find().sort({ year: -1 });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Technology Transfer (GET by ID)
router.get("/technology-transfers/:id", async (req, res) => {
  try {
    const transfer = await TechnologyTransfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Technology Transfer not found" });
    }
    res.json(transfer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Technology Transfer (PUT)
router.put("/technology-transfers/:id", async (req, res) => {
  try {
    const updatedTransfer = await TechnologyTransfer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTransfer) {
      return res.status(404).json({ message: "Technology Transfer not found" });
    }
    res.json(updatedTransfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Technology Transfer (DELETE)
router.delete("/technology-transfers/:id", async (req, res) => {
  try {
    const deletedTransfer = await TechnologyTransfer.findByIdAndDelete(req.params.id);
    if (!deletedTransfer) {
      return res.status(404).json({ message: "Technology Transfer not found" });
    }
    res.json({ message: "Technology Transfer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
