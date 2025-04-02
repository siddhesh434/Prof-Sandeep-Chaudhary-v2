const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Visibility = require("../models/Visibility");

// Render Project Admin Page
router.get("/admin/projects.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/projects", { adminID: req.session.admin });
});

// Create Project (POST)
router.post("/projects", async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Projects (GET)
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ year: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Project (GET by ID)
router.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Project (PUT)
router.put("/projects/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Project (DELETE)
router.delete("/projects/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Projects page route
router.get("/Projects.html", async (req, res) => {
  try {
    const projects = await Project.find();
    const settings = (await Visibility.findOne()) || {};
    res.render("Projects", { settings, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send("Error loading projects");
  }
});

module.exports = router;
