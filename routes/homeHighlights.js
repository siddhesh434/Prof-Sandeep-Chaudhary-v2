const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const HomeHighlight = require("../models/HomeHighlight");

const DISPLAY_MODES = ["both", "text", "image"];
const ROW_NUMBERS = [1, 2];

const uploadsDir = path.join(__dirname, "../public/uploads/homeHighlights");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedMime = /jpeg|jpg|png|gif|webp|pdf|doc|docx|ppt|pptx|xls|xlsx|zip|rar|txt/;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  const isExtValid = allowedMime.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeValid = allowedMime.test(file.mimetype);
  if (isExtValid || isMimeValid) {
    return cb(null, true);
  }
  return cb(
    new Error(
      "Unsupported file type. Please upload common images, documents or archives."
    )
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

const buildExternalMedia = (url = "") => {
  const trimmed = url.trim();
  if (!trimmed) {
    return clearMediaFields();
  }
  return {
    mediaType: detectTypeFromExtension(trimmed),
    mediaUrl: trimmed,
    storedFilename: null,
    mediaOriginalName: null,
    mediaMimeType: null,
    mediaSize: null,
  };
};

const buildFileMedia = (file) => {
  if (!file) return clearMediaFields();
  return {
    mediaType: detectTypeFromMime(file.mimetype),
    mediaUrl: `/uploads/homeHighlights/${file.filename}`,
    storedFilename: file.filename,
    mediaOriginalName: file.originalname,
    mediaMimeType: file.mimetype,
    mediaSize: file.size,
  };
};

function detectTypeFromMime(mime = "") {
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  return "file";
}

function detectTypeFromExtension(resource = "") {
  const lower = resource.toLowerCase();
  if (lower.match(/\.(png|jpe?g|gif|webp)$/)) return "image";
  if (lower.endsWith(".pdf")) return "pdf";
  if (!lower) return "none";
  return "link";
}

function clearMediaFields() {
  return {
    mediaType: "none",
    mediaUrl: "",
    storedFilename: null,
    mediaOriginalName: null,
    mediaMimeType: null,
    mediaSize: null,
  };
}

function removeStoredFile(filename) {
  if (!filename) return;
  const filePath = path.join(uploadsDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.warn("Failed to remove media file:", error.message);
  }
}

function toBoolean(value, defaultValue = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  }
  if (typeof value === "number") return value === 1;
  return defaultValue;
}

function parseOrder(value) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) return parsed;
  return Date.now();
}

function normalizeDisplayMode(mode = "both") {
  if (DISPLAY_MODES.includes(mode)) return mode;
  return "both";
}

function normalizeRowNumber(value, fallback = 1) {
  const parsed = Number(value);
  if (ROW_NUMBERS.includes(parsed)) return parsed;
  return fallback;
}

router.get("/admin/homeHighlights.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  return res.render("admin/homeHighlights", { adminID: req.session.admin });
});

router.get("/api/home-highlights", async (req, res) => {
  try {
    const highlights = await HomeHighlight.find()
      .sort({ category: 1, order: 1, createdAt: -1 })
      .lean();
    res.json(highlights);
  } catch (error) {
    console.error("Error fetching home highlights:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch highlights", error: error.message });
  }
});

router.post(
  "/api/home-highlights",
  upload.single("mediaFile"),
  async (req, res) => {
    const { category, title, summary } = req.body;
    const displayMode = normalizeDisplayMode(req.body.displayMode);
    const rowNumber = normalizeRowNumber(req.body.rowNumber, 1);
    const rowVisible = toBoolean(req.body.rowVisible, true);
    const summaryRequired = displayMode !== "image";
    const mediaOption = req.body.mediaOption || "none";
    const hasUpload = Boolean(req.file);
    const hasExternal = mediaOption === "external" && req.body.mediaUrl;
    const hasMedia = hasUpload || hasExternal;
    if (!category || !title || (summaryRequired && !summary)) {
      if (req.file) removeStoredFile(req.file.filename);
      return res
        .status(400)
        .json({ message: "Category, title and summary are required" });
    }
    if (displayMode === "image" && !hasMedia) {
      if (req.file) removeStoredFile(req.file.filename);
      return res
        .status(400)
        .json({ message: "Please attach an image when choosing image-only mode" });
    }

    try {
      const baseData = {
        category,
        title,
        summary,
        ctaLabel: req.body.ctaLabel?.trim() || "View Details",
        ctaUrl: req.body.ctaUrl?.trim(),
        rowNumber,
        order: rowNumber, // keep order aligned to row number for sorting
        isVisible: toBoolean(req.body.isVisible, true),
        rowVisible,
        displayMode,
      };

      let mediaPayload = clearMediaFields();
      if (req.file && mediaOption === "upload") {
        mediaPayload = buildFileMedia(req.file);
      } else if (mediaOption === "external" && req.body.mediaUrl) {
        if (req.file) removeStoredFile(req.file.filename);
        mediaPayload = buildExternalMedia(req.body.mediaUrl);
      } else if (req.file) {
        mediaPayload = buildFileMedia(req.file);
      }

      const highlight = new HomeHighlight({
        ...baseData,
        ...mediaPayload,
      });

      const saved = await highlight.save();
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error creating home highlight:", error);
      if (req.file) removeStoredFile(req.file.filename);
      res
        .status(500)
        .json({ message: "Failed to create highlight", error: error.message });
    }
  }
);

router.put(
  "/api/home-highlights/:id",
  upload.single("mediaFile"),
  async (req, res) => {
    try {
      const highlight = await HomeHighlight.findById(req.params.id);
      if (!highlight) {
        if (req.file) removeStoredFile(req.file.filename);
        return res.status(404).json({ message: "Highlight not found" });
      }

      const nextDisplayMode = normalizeDisplayMode(
        req.body.displayMode || highlight.displayMode
      );
      const nextRowNumber = normalizeRowNumber(
        req.body.rowNumber || highlight.rowNumber,
        highlight.rowNumber
      );

      highlight.category = req.body.category || highlight.category;
      highlight.title = req.body.title || highlight.title;
      highlight.summary = req.body.summary || highlight.summary;
      highlight.ctaLabel =
        req.body.ctaLabel?.trim() || highlight.ctaLabel || "View Details";
      highlight.ctaUrl = req.body.ctaUrl?.trim() || highlight.ctaUrl;
      highlight.rowNumber = nextRowNumber;
      highlight.order = nextRowNumber;
      highlight.isVisible = toBoolean(
        req.body.isVisible,
        highlight.isVisible
      );
      highlight.rowVisible = toBoolean(
        req.body.rowVisible,
        highlight.rowVisible
      );
      highlight.displayMode = nextDisplayMode;

      const mediaOption = req.body.mediaOption;
      const clearMedia = toBoolean(req.body.clearMedia, false);
      let newMedia = null;

      if (req.file) {
        removeStoredFile(highlight.storedFilename);
        newMedia = buildFileMedia(req.file);
      } else if (mediaOption === "external" && req.body.mediaUrl) {
        removeStoredFile(highlight.storedFilename);
        newMedia = buildExternalMedia(req.body.mediaUrl);
      } else if (clearMedia || mediaOption === "none") {
        removeStoredFile(highlight.storedFilename);
        newMedia = clearMediaFields();
      }

      if (newMedia) {
        Object.assign(highlight, newMedia);
      }

      const finalMediaType = newMedia
        ? newMedia.mediaType
        : highlight.mediaType;
      if (nextDisplayMode === "image" && (!finalMediaType || finalMediaType === "none")) {
        if (req.file) removeStoredFile(req.file.filename);
        return res
          .status(400)
          .json({ message: "Please attach an image when choosing image-only mode" });
      }

      const saved = await highlight.save();
      res.json(saved);
    } catch (error) {
      console.error("Error updating home highlight:", error);
      if (req.file) removeStoredFile(req.file.filename);
      res
        .status(500)
        .json({ message: "Failed to update highlight", error: error.message });
    }
  }
);

router.delete("/api/home-highlights/:id", async (req, res) => {
  try {
    const highlight = await HomeHighlight.findById(req.params.id);
    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }
    removeStoredFile(highlight.storedFilename);
    await highlight.deleteOne();
    res.json({ message: "Highlight removed" });
  } catch (error) {
    console.error("Error deleting home highlight:", error);
    res
      .status(500)
      .json({ message: "Failed to delete highlight", error: error.message });
  }
});

module.exports = router;

