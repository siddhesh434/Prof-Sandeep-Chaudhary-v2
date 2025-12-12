const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { generateCV } = require("../cvGeneratorModule");

// Import Models
const CVConfig = require("../models/CVConfig");
const Project = require("../models/Project");
const Patent = require("../models/Patent");
const Publication = require("../models/Publication");
const Book = require("../models/Book");
const Chapter = require("../models/Chapter");
const Conference = require("../models/Conference");
const Dissertation = require("../models/Dissertation");
const TechnologyTransfer = require("../models/TechnologyTransfer");
const ExtensionActivity = require("../models/ExtensionActivity");

// Helper: Get or Create Config
async function getCVConfig() {
    let config = await CVConfig.findOne();
    if (!config) {
        config = new CVConfig();
        await config.save();
    }
    return config;
}

// Route to get current CV Config
router.get("/api/cv-config", async (req, res) => {
    try {
        const config = await getCVConfig();
        res.json(config);
    } catch (error) {
        console.error("Error fetching CV Config:", error);
        res.status(500).json({ error: "Failed to fetch config" });
    }
});

// Route to save CV Config
router.post("/api/cv-config", async (req, res) => {
    try {
        const updateData = req.body;
        let config = await CVConfig.findOne();
        
        if (!config) {
            config = new CVConfig(updateData);
        } else {
            // Update fields
            Object.assign(config, updateData);
        }
        
        config.updatedAt = Date.now();
        await config.save();
        res.json({ message: "Configuration saved successfully", config });
    } catch (error) {
        console.error("Error saving CV Config:", error);
        res.status(500).json({ error: "Failed to save config" });
    }
});

// Route to get ALL data for selection UI
router.get("/api/all-cv-data", async (req, res) => {
    try {
        const [
            projects, 
            patents, 
            publications, 
            books, 
            chapters, 
            conferences, 
            dissertations,
            extensionActivities,
            technologyTransfers
        ] = await Promise.all([
            Project.find().sort({ year: -1 }),
            Patent.find().sort({ year: -1 }),
            Publication.find().sort({ year: -1 }),
            Book.find().sort({ year: -1 }),
            Chapter.find().sort({ year: -1 }),
            Conference.find().sort({ year: -1 }),
            Dissertation.find().sort({ year: -1 }),
            ExtensionActivity.find().sort({ startDate: -1 }),
            TechnologyTransfer.find().sort({ year: -1 })
        ]);

        // Calculate Statistics
        const roleGroups = [
             { label: "As Principal Investigator", matches: ["Principal Investigator", "PI"] },
             { label: "As Scientific Director", matches: ["Scientific Director"] },
             { label: "As Scientist Mentor", matches: ["Scientist Mentor", "Mentor"] },
             { label: "As Co-Principal Investigator", matches: ["Co-Principal Investigator", "Co-PI", "Co-PI/Co-Guide"] },
             { label: "As Guide", matches: ["Guide"] }
        ];
        const normalizeRole = r => r ? r.trim() : "";
        const isOngoing = (y) => y && (y.toLowerCase().includes('cont') || y.toLowerCase().includes('ongoing') || y.toLowerCase().includes('present'));

        const patentsGranted = patents.filter(p => p.grantNumber).length;
        const patentsOther = patents.length - patentsGranted;
        
        const phds = dissertations.filter(d => d.degree && d.degree.includes('Ph.D'));
        const phdOngoing = phds.filter(d => isOngoing(d.year)).length;
        const phdCompleted = phds.length - phdOngoing;
        
        const mtechs = dissertations.filter(d => d.degree && (d.degree.includes('M.Tech') || d.degree.includes('M.Sc')));
        const mtechOngoing = mtechs.filter(d => isOngoing(d.year)).length;
        const mtechCompleted = mtechs.length - mtechOngoing;

        const projectCounts = roleGroups.map(group => {
            return projects.filter(p => {
                const r = normalizeRole(p.role);
                return group.matches.some(m => r.toLowerCase() === m.toLowerCase()); 
            }).length;
        });
        const projectCountStr = projectCounts.map(c => c.toString().padStart(2, '0')).join('/');

        const calculatedStats = {
             techTransfer: `${technologyTransfers.length.toString().padStart(2, '0')}/02`, 
             patents: `${patentsGranted.toString().padStart(2, '0')}/${patentsOther.toString().padStart(2, '0')}/01/01`,
             journals: publications.filter(p => !p.journal || p.journal !== 'Conference').length.toString(),
             conferences: conferences.length.toString(),
             books: books.length.toString().padStart(2, '0'),
             technicalReports: "01",
             chapters: chapters.length.toString().padStart(2, '0'),
             phdSupervision: `${phdCompleted}/${phdOngoing.toString().padStart(2, '0')}`,
             mtechSupervision: `${mtechCompleted}/${mtechOngoing.toString().padStart(2, '0')}`,
             sponsoredProjects: projects.length.toString(),
             projectRoles: `(${projectCountStr})`
        };

        res.json({
            projects,
            patents,
            publications,
            books,
            chapters,
            conferences,
            dissertations,
            extensionActivities,
            technologyTransfers,
            calculatedStats
        });
    } catch (error) {
        console.error("Error fetching all CV data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Route to generate CV
router.post("/generate-cv", async (req, res) => {
  // The body contains the FULL configuration (text fields + selected IDs)
  // We might want to auto-save this config too? 
  // For now, let's assume the user clicked "Save" or we just use the body data to generate PDF one-time.
  // Actually, keeping them separate is safer: Save button saves, Generate just generates.
  // BUT the generate function needs the IDs to filter data.
  
  const config = req.body;

  try {
    console.log("Generating CV...");
    
    // Generate CV using the module
    const cvPath = await generateCV(config);
    
    // Check if the file exists
    if (fs.existsSync(cvPath)) {
      res.download(cvPath, "Sandeep_Chaudhary_CV.pdf", (err) => {
        if (err) {
            console.error(`Error sending file: ${err}`);
             if (!res.headersSent) res.status(500).send("Error downloading CV");
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
