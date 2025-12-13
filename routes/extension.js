const express = require('express');
const router = express.Router();
const ExtensionActivity = require('../models/ExtensionActivity');

// Middleware to check admin authorization
const isAdmin = (req, res, next) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  next();
};

// Render the Research Members Management page
router.get("/admin/extension.html", isAdmin, (req, res) => {
  res.render("admin/extension", { adminID: req.session.admin });
});


// Route to render extension activities page (already exists in your code)
router.get('/extension.html', async (req, res) => {
  try {
    // Fetch all extension activities from the database
    const activities = await ExtensionActivity.find({}).sort({ role: 1 });
    
    // Render the extension template and pass the activities data
    res.render('extension', {
      activities: activities,
      title: 'Extension Activities - Prof. Sandeep Chaudhary'
    });
  } catch (err) {
    console.error('Error fetching extension activities:', err);
    res.status(500).render('error', {
      message: 'Error loading extension activities',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});


// API Routes for Extension Activities Management

// GET all extension activities
router.get('/api/activities', async (req, res) => {
  try {
    const activities = await ExtensionActivity.find({});
    res.json(activities);
  } catch (err) {
    console.error('Error fetching extension activities:', err);
    res.status(500).json({ message: 'Server error while fetching activities' });
  }
});

// GET a single extension activity by ID
router.get('/api/activities/:id', async (req, res) => {
  try {
    const activity = await ExtensionActivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (err) {
    console.error('Error fetching extension activity:', err);
    res.status(500).json({ message: 'Server error while fetching activity' });
  }
});

// POST create a new extension activity
router.post('/api/activities', async (req, res) => {
  try {
    const { serialNumber, role, title, description, location } = req.body;
    
    // Validate required fields
    if (!role || !title || !description || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newActivity = new ExtensionActivity({
      serialNumber,
      role,
      title,
      description,
      location
    });
    
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (err) {
    console.error('Error creating extension activity:', err);
    res.status(500).json({ message: 'Server error while creating activity' });
  }
});

// PUT update an extension activity
router.put('/api/activities/rename-role', async (req, res) => {
  try {
    const { oldRole, newRole } = req.body;
    
    // Validate required fields
    if (!oldRole || !newRole) {
      return res.status(400).json({ message: 'Old role and new role are required' });
    }
    
    // Perform bulk update
    const result = await ExtensionActivity.updateMany(
      { role: oldRole },
      { $set: { role: newRole } }
    );
    
    res.json({ 
      message: 'Roles updated successfully', 
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    console.error('Error renaming role:', err);
    res.status(500).json({ message: 'Server error while renaming role' });
  }
});

// PUT update an extension activity
router.put('/api/activities/:id', async (req, res) => {
  try {
    const { serialNumber, role, title, description, location } = req.body;
    
    // Validate required fields
    if (!role || !title || !description || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const updatedActivity = await ExtensionActivity.findByIdAndUpdate(
      req.params.id,
      { serialNumber, role, title, description, location },
      { new: true, runValidators: true }
    );
    
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.json(updatedActivity);
  } catch (err) {
    console.error('Error updating extension activity:', err);
    res.status(500).json({ message: 'Server error while updating activity' });
  }
});

// DELETE an extension activity
router.delete('/api/activities/:id', async (req, res) => {
  try {
    const deletedActivity = await ExtensionActivity.findByIdAndDelete(req.params.id);
    
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    console.error('Error deleting extension activity:', err);
    res.status(500).json({ message: 'Server error while deleting activity' });
  }
});

module.exports = router;