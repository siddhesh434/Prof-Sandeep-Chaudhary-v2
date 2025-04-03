const express = require("express");
const router = express.Router();
const ResearchMember = require("../models/ResearchGroup"); // Assuming this model exists

// Middleware to check admin authorization
const isAdmin = (req, res, next) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  next();
};

// Render the Research Members Management page
router.get("/admin/researchMembers.html", isAdmin, (req, res) => {
  res.render("admin/researchMembers", { adminID: req.session.admin });
});

// Get all research members
router.get("/members", isAdmin, async (req, res) => {
  try {
    const members = await ResearchMember.find();
    res.json(members);
  } catch (error) {
    console.error("Error fetching research members:", error);
    res.status(500).json({ message: "Failed to fetch research members" });
  }
});

// Get a specific research member by ID
router.get("/members/:id", isAdmin, async (req, res) => {
  try {
    const member = await ResearchMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Research member not found" });
    }
    res.json(member);
  } catch (error) {
    console.error("Error fetching research member:", error);
    res.status(500).json({ message: "Failed to fetch research member" });
  }
});

// Create a new research member
router.post("/members", isAdmin, async (req, res) => {
  try {
    const { name, position, scholarLink, scholarTopic, year, type, photoUrl } = req.body;
    
    // Basic validation
    if (!name || !type) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    
    const newMember = new ResearchMember({
      name,
      position,
      scholarLink,
      scholarTopic,
      year: year,
      type,
      photoUrl
    });
    
    await newMember.save();
    res.status(201).json({ message: "Research member added successfully", member: newMember });
  } catch (error) {
    console.error("Error adding research member:", error);
    res.status(500).json({ message: "Failed to add research member" });
  }
});

// Update a research member
router.put("/members/:id", isAdmin, async (req, res) => {
  try {
    const { name, position, scholarLink, scholarTopic, year, type, photoUrl } = req.body;
    
    // Basic validation
    if (!name || !type) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    
    const updatedMember = await ResearchMember.findByIdAndUpdate(
      req.params.id,
      {
        name,
        position,
        scholarLink,
        scholarTopic,
        year: year,
        type,
        photoUrl
      },
      { new: true }
    );
    
    if (!updatedMember) {
      return res.status(404).json({ message: "Research member not found" });
    }
    
    res.json({ message: "Research member updated successfully", member: updatedMember });
  } catch (error) {
    console.error("Error updating research member:", error);
    res.status(500).json({ message: "Failed to update research member" });
  }
});

// Delete a research member
router.delete("/members/:id", isAdmin, async (req, res) => {
  try {
    const deletedMember = await ResearchMember.findByIdAndDelete(req.params.id);
    
    if (!deletedMember) {
      return res.status(404).json({ message: "Research member not found" });
    }
    
    res.json({ message: "Research member deleted successfully" });
  } catch (error) {
    console.error("Error deleting research member:", error);
    res.status(500).json({ message: "Failed to delete research member" });
  }
});

// Public route for the research group page - grouped by type
router.get("/researchGroups", async (req, res) => {
  try {
    const members = await ResearchMember.find();
    
    // Group members by type
    const groupedMembers = {};
    
    // Process each member and organize by type
    members.forEach(member => {
      const type = member.type || "Other";
      
      // Create array for this type if it doesn't exist
      if (!groupedMembers[type]) {
        groupedMembers[type] = [];
      }
      
      // Add member to the appropriate type array
      groupedMembers[type].push({
        name: member.name,
        position: member.position,
        scholarLink: member.scholarLink,
        scholarTopic: member.scholarTopic,
        year: member.year,
        photoUrl: member.photoUrl || "/images/placeholder.jpg" // Provide default if missing
      });
    });
    
    res.json(groupedMembers);
  } catch (error) {
    console.error("Error fetching research group members:", error);
    res.status(500).json({ error: "Error fetching research group members" });
  }
});

module.exports = router;