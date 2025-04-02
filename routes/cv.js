const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Route to generate CV
router.post("/generate-cv", (req, res) => {
  // Execute the CV generator script
  exec("node cvGenerator.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing CV generator: ${error}`);
      return res.status(500).send("Error generating CV");
    }

    const cvPath = path.join(__dirname, "../cv.pdf");

    // Check if the file exists
    if (fs.existsSync(cvPath)) {
      // Send the file
      res.download(cvPath, "Sandeep_Chaudhary_CV.pdf", (err) => {
        if (err) {
          console.error(`Error sending file: ${err}`);
          res.status(500).send("Error downloading CV");
        }
      });
    } else {
      res.status(404).send("CV file not found");
    }
  });
});

// Serve the main HTML page
router.get("/admin/cvGenerator.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/cvGenerator");
});

module.exports = router;
