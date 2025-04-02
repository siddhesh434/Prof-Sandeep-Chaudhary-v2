const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  const allowedTypes =
    /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt|csv|zip|rar|tar|gz/;
  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only common document and image formats are allowed."
      )
    );
  }
};

// Configure multer upload
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

// Define File Schema
const File = require("../models/File");

// Render file management page
router.get("/admin/files.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/files", { adminID: req.session.admin });
});

// Get all files
router.get("/api/files", async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching files",
      error: error.message,
    });
  }
});

// Upload file
router.post("/api/files/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { fileName, fileDescription } = req.body;

    // Basic validation
    if (!fileName) {
      // Remove uploaded file if fileName is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "File name is required",
      });
    }

    // Create new file record
    const newFile = new File({
      fileName: fileName,
      description: fileDescription || "",
      originalFilename: req.file.originalname,
      storedFilename: req.file.filename,
      fileType: req.file.mimetype,
      size: req.file.size,
    });

    // Save to database
    const savedFile = await newFile.save();

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: savedFile,
    });
  } catch (error) {
    // Attempt to remove uploaded file if there was an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error removing file after failed upload:", unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
});

// Download file
router.get("/api/files/download/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const filePath = path.join(uploadsDir, file.storedFilename);

    // Check if file exists in filesystem
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // Set appropriate headers
    res.setHeader("Content-Type", file.fileType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalFilename}"`
    );

    // Stream the file to client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error downloading file",
      error: error.message,
    });
  }
});

// Delete file
router.delete("/api/files/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const filePath = path.join(uploadsDir, file.storedFilename);

    // Delete file from filesystem if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record from database
    await File.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    });
  }
});

module.exports = router;
