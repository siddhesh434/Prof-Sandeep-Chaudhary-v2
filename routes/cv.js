const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { generateCV } = require("../cvGeneratorModule");

// Route to generate CV
router.post("/generate-cv", async (req, res) => {
  const { selectedComponents = [], additionalInfo = "" } = req.body;

  // Create configuration object
  const config = {
    selectedComponents,
    additionalInfo,
  };

  try {
    console.log("Generating CV with config:", config);
    
    // Generate CV using the module
    const cvPath = await generateCV(config);
    
    console.log("CV generated at:", cvPath);

    // Check if the file exists
    if (fs.existsSync(cvPath)) {
      // Send the file
      res.download(cvPath, "Sandeep_Chaudhary_CV.pdf", (err) => {
        if (err) {
          console.error(`Error sending file: ${err}`);
          if (!res.headersSent) {
            res.status(500).send("Error downloading CV");
          }
        }
      });
    } else {
      res.status(404).send("CV file not found");
    }
  } catch (error) {
    console.error("Error in CV generation route:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error generating CV", details: error.message });
    }
  }
});

// Serve the main HTML page
router.get("/admin/cvGenerator.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/cvGenerator");
});

module.exports = router;
