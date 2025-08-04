const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const eResource = require("../models/eResources");

// Render

// client-side
router.get("/eResources.html", (req, res) => {
  res.render("eResources", { adminID: req.session.admin });
});

// Render file management page
router.get("/admin/eResources.html", (req, res) => {
    if (!req.session.admin) return res.redirect("/admin/login");
    res.render("admin/eResources", { adminID: req.session.admin });
  });

// Create upload directories if they don't exist
const uploadsDir = path.join(__dirname, "../public/uploads/resources");
const thumbnailsDir = path.join(__dirname, "../public/uploads/thumbnails");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Configure multer storage for main resources
const resourceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // If the file is an image from imageUpload field, store in thumbnails
    if (file.fieldname === 'image') {
      cb(null, thumbnailsDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    // Only allow images for thumbnails
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const isValidExt = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = allowedImageTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type for thumbnail. Only image formats are allowed."));
    }
  } else {
    // For regular resources, allow a wider range of file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|tar|gz|mp3|mp4|avi|json|xml|html/;
    const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = true; // Less strict on mime types for resource files

    if (isValidExt) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only common document, media, and image formats are allowed."));
    }
  }
};

// Configure multer upload
const upload = multer({
  storage: resourceStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter
});



// Get all eResources
router.get("/api/eresources", async (req, res) => {
  try {
    const resources = await eResource.find().sort({ uploadDate: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching resources",
      error: error.message
    });
  }
});

// Get single eResource by ID
router.get("/api/eresources/:id", async (req, res) => {
  try {
    const resource = await eResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching resource details",
      error: error.message
    });
  }
});


// UPDATED ROUTES - Update your existing upload route in eResources.js
router.post("/api/eresources/upload", upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { fileName, description, resourceType, youtubeUrl, youtubeId } = req.body;

    // Basic validation
    if (!fileName) {
      // Remove uploaded files if they exist
      if (req.files && req.files.file) {
        fs.unlinkSync(req.files.file[0].path);
      }
      if (req.files && req.files.image) {
        fs.unlinkSync(req.files.image[0].path);
      }
      
      return res.status(400).json({
        success: false,
        message: "Resource title is required"
      });
    }

    let newResource;

    // Handle YouTube video upload
    if (resourceType === 'youtube') {
      if (!youtubeUrl || !youtubeId) {
        return res.status(400).json({
          success: false,
          message: "YouTube URL and video ID are required"
        });
      }

      newResource = new eResource({
        fileName: fileName,
        description: description || "",
        resourceType: 'youtube',
        youtubeUrl: youtubeUrl,
        youtubeId: youtubeId,
        fileType: 'video/youtube',
        size: 0
      });
    } else {
      // Handle regular file upload
      if (!req.files || !req.files.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }

      const file = req.files.file[0];

      newResource = new eResource({
        fileName: fileName,
        description: description || "",
        resourceType: 'file',
        originalFilename: file.originalname,
        storedFilename: file.filename,
        fileType: file.mimetype,
        size: file.size
      });

      // Add thumbnail path if an image was uploaded
      if (req.files.image) {
        const thumbnailPath = `/uploads/thumbnails/${req.files.image[0].filename}`;
        newResource.image = thumbnailPath;
      }
    }

    // Save to database
    const savedResource = await newResource.save();

    res.status(201).json({
      success: true,
      message: "Resource uploaded successfully",
      resource: savedResource
    });
  } catch (error) {
    // Attempt to remove uploaded files if there was an error
    if (req.files && req.files.file) {
      try {
        fs.unlinkSync(req.files.file[0].path);
        if (req.files.image) {
          fs.unlinkSync(req.files.image[0].path);
        }
      } catch (unlinkError) {
        console.error("Error removing files after failed upload:", unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: "Error uploading resource",
      error: error.message
    });
  }
});

// UPDATE THE DOWNLOAD ROUTE to handle YouTube videos
router.get("/api/eresources/download/:id", async (req, res) => {
  try {
    const resource = await eResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    // YouTube videos can't be downloaded
    if (resource.resourceType === 'youtube') {
      return res.status(400).json({
        success: false,
        message: "Cannot download YouTube videos. Please watch them online."
      });
    }

    const filePath = path.join(uploadsDir, resource.storedFilename);

    // Check if file exists in filesystem
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resource file not found on server"
      });
    }

    // Update download count
    resource.downloadCount = (resource.downloadCount || 0) + 1;
    await resource.save();

    // Set appropriate headers
    res.setHeader("Content-Type", resource.fileType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resource.originalFilename}"`
    );

    // Stream the file to client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error downloading resource",
      error: error.message
    });
  }
});

// UPDATE THE DELETE ROUTE to handle YouTube videos
router.delete("/api/eresources/:id", async (req, res) => {
  try {
    const resource = await eResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    // Only delete physical files for file resources
    if (resource.resourceType === 'file' && resource.storedFilename) {
      const filePath = path.join(uploadsDir, resource.storedFilename);
      
      // Delete file from filesystem if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete thumbnail if it exists (both file and YouTube resources can have thumbnails)
    if (resource.image) {
      const thumbnailPath = path.join(__dirname, "../public", resource.image);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Delete record from database
    await eResource.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Resource deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting resource",
      error: error.message
    });
  }
});

// UPDATE THE SEARCH ROUTE to include YouTube fields
router.get("/api/eresources/search", async (req, res) => {
  try {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term is required"
      });
    }

    // Create a case-insensitive regex pattern for searching
    const searchPattern = new RegExp(searchTerm, 'i');
    
    // Search in multiple fields including YouTube fields
    const resources = await eResource.find({
      $or: [
        { fileName: searchPattern },
        { description: searchPattern },
        { originalFilename: searchPattern },
        { fileType: searchPattern },
        { youtubeUrl: searchPattern }
      ]
    }).sort({ uploadDate: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching resources",
      error: error.message
    });
  }
});
module.exports = router;