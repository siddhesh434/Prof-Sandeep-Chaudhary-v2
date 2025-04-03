const express = require("express");
const router = express.Router();
const ResearchGroup = require("../models/ResearchGroup");

// Get all research group members
router.get("/researchGroups", async (req, res) => {
    try {
      const members = await ResearchGroup.find();
      
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