// routes/Content.js - Improved API routes for content management
const express = require('express');
const router = express.Router();
const { Bulletin, CarouselSlide } = require('../models/Content');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for image uploads - Save to disk instead of Base64
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/images/scoreCarousel');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      console.error('Error creating upload directory:', error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `carousel-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit (increased from 5MB)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware for basic auth check
const requireAuth = (req, res, next) => {
  // Add your authentication logic here
  // For now, allowing all requests - CHANGE THIS IN PRODUCTION
  next();
};

// ===========================================
// BULLETIN MANAGEMENT ROUTES
// ===========================================

// GET: Retrieve all bulletins (admin)
router.get('/admin/api/bulletins', async (req, res) => {
  try {
    const bulletins = await Bulletin.find().sort({ createdAt: -1 });
    res.json({ success: true, bulletins });
  } catch (error) {
    console.error('Error fetching bulletins:', error);
    res.status(500).json({ success: false, message: 'Error fetching bulletins', error: error.message });
  }
});

// GET: Retrieve latest bulletin (backward compatibility)
router.get('/admin/api/bulletin', async (req, res) => {
  try {
    const bulletin = await Bulletin.findOne().sort({ createdAt: -1 });
    res.json({ success: true, bulletin });
  } catch (error) {
    console.error('Error fetching bulletin:', error);
    res.status(500).json({ success: false, message: 'Error fetching bulletin', error: error.message });
  }
});

// POST: Create bulletin
router.post('/admin/api/bulletins', requireAuth, async (req, res) => {
  try {
    const { enabled, title, message, speed, color, priority, linkUrl } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }
    if (speed && (speed < 5 || speed > 30)) {
      return res.status(400).json({ success: false, message: 'Speed must be between 5 and 30 seconds' });
    }
    const bulletin = new Bulletin({
      enabled: enabled !== undefined ? enabled : true,
      title,
      message,
      speed: speed || 15,
      color: color || 'blue',
      priority: priority || 'normal',
      linkUrl: linkUrl || ''
    });
    await bulletin.save();
    res.status(201).json({ success: true, bulletin });
  } catch (error) {
    console.error('Error creating bulletin:', error);
    res.status(500).json({ success: false, message: 'Error creating bulletin', error: error.message });
  }
});

// PUT: Update bulletin
router.put('/admin/api/bulletins/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled, title, message, speed, color, priority, linkUrl } = req.body;
    if (speed && (speed < 5 || speed > 30)) {
      return res.status(400).json({ success: false, message: 'Speed must be between 5 and 30 seconds' });
    }
    const bulletin = await Bulletin.findById(id);
    if (!bulletin) {
      return res.status(404).json({ success: false, message: 'Bulletin not found' });
    }
    bulletin.enabled = enabled !== undefined ? enabled : bulletin.enabled;
    bulletin.title = title || bulletin.title;
    bulletin.message = message || bulletin.message;
    bulletin.speed = speed || bulletin.speed;
    bulletin.color = color || bulletin.color;
    bulletin.priority = priority || bulletin.priority;
    bulletin.linkUrl = linkUrl !== undefined ? linkUrl : bulletin.linkUrl;
    bulletin.updatedAt = new Date();
    await bulletin.save();
    res.json({ success: true, bulletin });
  } catch (error) {
    console.error('Error updating bulletin:', error);
    res.status(500).json({ success: false, message: 'Error updating bulletin', error: error.message });
  }
});

// DELETE: Remove bulletin
router.delete('/admin/api/bulletins/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Bulletin.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Bulletin not found' });
    }
    res.json({ success: true, message: 'Bulletin deleted' });
  } catch (error) {
    console.error('Error deleting bulletin:', error);
    res.status(500).json({ success: false, message: 'Error deleting bulletin', error: error.message });
  }
});

// Public: active bulletins
router.get('/api/bulletins', async (req, res) => {
  try {
    const bulletins = await Bulletin.find({ enabled: true }).sort({ createdAt: -1 });
    res.json({ success: true, bulletins });
  } catch (error) {
    console.error('Error fetching bulletins:', error);
    res.status(500).json({ success: false, message: 'Error fetching bulletins', error: error.message });
  }
});

// ===========================================
// CAROUSEL MANAGEMENT ROUTES
// ===========================================

// GET: Retrieve all carousel slides
router.get('/admin/api/carousel', async (req, res) => {
  console.log('GET carousel endpoint hit');
  try {
    const slides = await CarouselSlide.find().sort({ order: 1 });
    
    res.json({
      success: true,
      slides: slides
    });
  } catch (error) {
    console.error('Error fetching carousel slides:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching carousel slides',
      error: error.message
    });
  }
});

// GET: Retrieve active carousel slides for public display
router.get('/api/carousel/active', async (req, res) => {
  try {
    const slides = await CarouselSlide.find({ active: true }).sort({ order: 1 });
    
    res.json({
      success: true,
      slides: slides
    });
  } catch (error) {
    console.error('Error fetching active carousel slides:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching carousel slides',
      error: error.message
    });
  }
});

// POST: Create new carousel slide with file upload
router.post('/admin/api/carousel/slides', requireAuth, upload.single('imageFile'), async (req, res) => {
  console.log('POST carousel slide endpoint hit');
  try {
    const { title, description, order, active, imageBase64 } = req.body;
    let slideId = req.body.id || generateId();

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Check if slide with same ID already exists
    const existingSlide = await CarouselSlide.findOne({ id: slideId });
    if (existingSlide) {
      return res.status(400).json({
        success: false,
        message: 'Slide with this ID already exists'
      });
    }

    let imagePath = '/images/placeholder.jpg'; // Default image

    // Handle image upload - either file upload or base64
    if (req.file) {
      // File was uploaded via multer
      imagePath = `/images/scoreCarousel/${req.file.filename}`;
    } else if (imageBase64 && imageBase64.startsWith('data:image/')) {
      // Handle base64 image - convert to file
      try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Create filename
        const ext = imageBase64.match(/^data:image\/(\w+);base64,/)[1];
        const filename = `carousel-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
        const uploadPath = path.join(__dirname, '../public/images/scoreCarousel');
        const filePath = path.join(uploadPath, filename);
        
        // Ensure directory exists
        await fs.mkdir(uploadPath, { recursive: true });
        
        // Write file
        await fs.writeFile(filePath, buffer);
        imagePath = `/images/scoreCarousel/${filename}`;
      } catch (imageError) {
        console.error('Error processing base64 image:', imageError);
        // Continue with default image
      }
    }

    // Adjust orders if necessary
    if (order) {
      await CarouselSlide.updateMany(
        { order: { $gte: order } },
        { $inc: { order: 1 } }
      );
    }

    const slide = new CarouselSlide({
      id: slideId,
      title,
      description,
      image: imagePath,
      order: order || await getNextOrder(),
      active: active !== undefined ? active : true
    });

    await slide.save();

    res.json({
      success: true,
      message: 'Slide created successfully',
      slide: slide
    });
  } catch (error) {
    console.error('Error creating slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating slide',
      error: error.message
    });
  }
});

// PUT: Update existing carousel slide
router.put('/admin/api/carousel/slides', requireAuth, upload.single('imageFile'), async (req, res) => {
  console.log('PUT carousel slide endpoint hit');
  try {
    const { id, title, description, order, active, imageBase64 } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Slide ID is required'
      });
    }

    const slide = await CarouselSlide.findOne({ id: id });
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    // Handle order change
    if (order && order !== slide.order) {
      if (order > slide.order) {
        await CarouselSlide.updateMany(
          { order: { $gt: slide.order, $lte: order } },
          { $inc: { order: -1 } }
        );
      } else {
        await CarouselSlide.updateMany(
          { order: { $gte: order, $lt: slide.order } },
          { $inc: { order: 1 } }
        );
      }
    }

    // Handle image update
    let newImagePath = slide.image;
    
    if (req.file) {
      // New file uploaded
      newImagePath = `/images/scoreCarousel/${req.file.filename}`;
      
      // Delete old image file if it's not the default
      if (slide.image && slide.image !== '/images/placeholder.jpg' && slide.image.includes('/scoreCarousel/')) {
        try {
          const oldImagePath = path.join(__dirname, '../public', slide.image);
          await fs.unlink(oldImagePath);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
        }
      }
    } else if (imageBase64 && imageBase64.startsWith('data:image/')) {
      // Handle base64 image
      try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        const ext = imageBase64.match(/^data:image\/(\w+);base64,/)[1];
        const filename = `carousel-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
        const uploadPath = path.join(__dirname, '../public/images/scoreCarousel');
        const filePath = path.join(uploadPath, filename);
        
        await fs.mkdir(uploadPath, { recursive: true });
        await fs.writeFile(filePath, buffer);
        
        newImagePath = `/images/scoreCarousel/${filename}`;
        
        // Delete old image
        if (slide.image && slide.image !== '/images/placeholder.jpg' && slide.image.includes('/scoreCarousel/')) {
          try {
            const oldImagePath = path.join(__dirname, '../public', slide.image);
            await fs.unlink(oldImagePath);
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError);
          }
        }
      } catch (imageError) {
        console.error('Error processing base64 image:', imageError);
      }
    }

    // Update slide
    slide.title = title || slide.title;
    slide.description = description || slide.description;
    slide.order = order || slide.order;
    slide.active = active !== undefined ? active : slide.active;
    slide.image = newImagePath;
    slide.updatedAt = new Date();

    await slide.save();

    res.json({
      success: true,
      message: 'Slide updated successfully',
      slide: slide
    });
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating slide',
      error: error.message
    });
  }
});

// DELETE: Remove carousel slide
router.delete('/admin/api/carousel/slides/:slideId', requireAuth, async (req, res) => {
  console.log('DELETE carousel slide endpoint hit');
  try {
    const { slideId } = req.params;

    const slide = await CarouselSlide.findOne({ id: slideId });
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    // Delete image file if it's not the default
    if (slide.image && slide.image !== '/images/placeholder.jpg' && slide.image.includes('/scoreCarousel/')) {
      try {
        const imagePath = path.join(__dirname, '../public', slide.image);
        await fs.unlink(imagePath);
      } catch (deleteError) {
        console.error('Error deleting image file:', deleteError);
      }
    }

    // Adjust orders of remaining slides
    await CarouselSlide.updateMany(
      { order: { $gt: slide.order } },
      { $inc: { order: -1 } }
    );

    await CarouselSlide.deleteOne({ id: slideId });

    res.json({
      success: true,
      message: 'Slide deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting slide',
      error: error.message
    });
  }
});

// PATCH: Move slide up or down
router.patch('/admin/api/carousel/slides/:slideId/move', requireAuth, async (req, res) => {
  console.log('PATCH move slide endpoint hit');
  try {
    const { slideId } = req.params;
    const { direction } = req.body;

    const slide = await CarouselSlide.findOne({ id: slideId });
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    const totalSlides = await CarouselSlide.countDocuments();
    let newOrder;

    if (direction === 'up' && slide.order > 1) {
      newOrder = slide.order - 1;
      await CarouselSlide.updateOne(
        { order: newOrder },
        { order: slide.order }
      );
    } else if (direction === 'down' && slide.order < totalSlides) {
      newOrder = slide.order + 1;
      await CarouselSlide.updateOne(
        { order: newOrder },
        { order: slide.order }
      );
    } else {
      return res.status(400).json({
        success: false,
        message: 'Cannot move slide in that direction'
      });
    }

    slide.order = newOrder;
    slide.updatedAt = new Date();
    await slide.save();

    res.json({
      success: true,
      message: 'Slide moved successfully'
    });
  } catch (error) {
    console.error('Error moving slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error moving slide',
      error: error.message
    });
  }
});

// ===========================================
// UTILITY ROUTES
// ===========================================

// GET: Get bulletin and carousel data for home page
router.get('/api/content/home', async (req, res) => {
  try {
    const bulletin = await Bulletin.findOne().sort({ createdAt: -1 });
    const carouselSlides = await CarouselSlide.find({ active: true }).sort({ order: 1 });

    res.json({
      success: true,
      data: {
        bulletin: bulletin,
        carousel: carouselSlides
      }
    });
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
});

// ===========================================
// HELPER FUNCTIONS
// ===========================================

async function getNextOrder() {
  const lastSlide = await CarouselSlide.findOne().sort({ order: -1 });
  return lastSlide ? lastSlide.order + 1 : 1;
}

function generateId() {
  return 'slide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Error handling middleware
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }
  }
  
  console.error('Content route error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

module.exports = router;