const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

// SEO Middleware - Set common meta tags
app.use((req, res, next) => {
  res.locals.seo = {
    title: "SCORE Research Group - Sustainable Construction Research",
    description:
      "Research group led by Prof. Sandeep Chaudhary at IIT Indore, focusing on sustainable construction, structural engineering, and rural development.",
    keywords:
      "Sandeep Chaudhary, Sustainable Construction, IIT Indore, Civil Engineering, Research, Structural Engineering",
    author: "Prof. Sandeep Chaudhary",
    ogImage: "/images/profile.jpg",
    canonical: `https://sustainableconstructionlab.com${req.path}`,
  };
  next();
});

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day session
  })
);

// Current page middleware
app.use((req, res, next) => {
  let fullPath = req.path;
  let currentPage;

  if (fullPath === "/" || fullPath === "/index.html") {
    currentPage = "home";
  } else if (fullPath.endsWith(".html")) {
    currentPage = fullPath.replace(/^\//, "").replace(/\.html$/, "");
  } else {
    currentPage = fullPath.replace(/^\//, "");
    if (currentPage === "") currentPage = "home";
  }

  res.locals.currentPage = currentPage;
  next();
});

// SEO Routes
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  const robotsPath = path.join(__dirname, "public", "robots.txt");

  // Get file stats to set Last-Modified header
  fs.stat(robotsPath, (err, stats) => {
    if (err) {
      console.error("Error getting robots.txt stats:", err);
      return res.sendFile(robotsPath);
    }

    // Set Last-Modified header based on file modification time
    res.set("Last-Modified", stats.mtime.toUTCString());
    res.sendFile(robotsPath);
  });
});

app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  const sitemapPath = path.join(__dirname, "public", "sitemap.xml");

  // Get file stats to set Last-Modified header
  fs.stat(sitemapPath, (err, stats) => {
    if (err) {
      console.error("Error getting sitemap stats:", err);
      return res.sendFile(sitemapPath);
    }

    // Set Last-Modified header based on file modification time
    res.set("Last-Modified", stats.mtime.toUTCString());
    res.sendFile(sitemapPath);
  });
});

app.get("/sitemap2.html", (req, res) => res.render("sitemap"));

app.get("/sitemap.html", (req, res) => {
  res.render("sitemap", {
    title: "Sitemap - SCORE Research Group",
    description: "Complete site structure of SCORE Research Group website",
  });
});

// Google Site Verification Route
app.get("/googlef5c0188d6e6ea5f5.html", (req, res) => {
  res.setHeader("Content-Type", "text/html");

  // Get file stats to set Last-Modified header
  const verificationPath = path.join(
    __dirname,
    "public",
    "googlef5c0188d6e6ea5f5.html"
  );

  fs.stat(verificationPath, (err, stats) => {
    if (err) {
      console.error("Error getting verification file stats:", err);
      return res.send("google-site-verification: googlef5c0188d6e6ea5f5.html");
    }

    // Set Last-Modified header based on file modification time
    res.set("Last-Modified", stats.mtime.toUTCString());
    res.send("google-site-verification: googlef5c0188d6e6ea5f5.html");
  });
});

// Import routes
const adminRoutes = require("./routes/admin");
const publicationRoutes = require("./routes/publications");
const projectRoutes = require("./routes/projects");
const patentRoutes = require("./routes/patents");
const dissertationRoutes = require("./routes/dissertations");
const cvRoutes = require("./routes/cv");
const contactRoutes = require("./routes/contact");
const controlRoutes = require("./routes/control");
const ResearchGroup = require("./routes/researchGroup");
const ExtensionActivity = require("./routes/extension");
const fileRoutes = require("./routes/files");
const eResourceRoutes = require("./routes/eResources");
// Use routes
app.use("/admin", adminRoutes);
app.use("/", publicationRoutes);
app.use("/", projectRoutes);
app.use("/", patentRoutes);
app.use("/", dissertationRoutes);
app.use("/", cvRoutes);
app.use("/", contactRoutes);
app.use("/", controlRoutes);
app.use("/", ResearchGroup);
app.use("/", ExtensionActivity);

app.use("/", fileRoutes);
app.use("/", eResourceRoutes);
// Root routes
app.get("/", (req, res) => res.render("index"));
app.get("/index.html", (req, res) => res.render("index"));
app.get("/admin/formData", (req, res) =>
  res.render("admin/formData", { adminID: req.session.adminID })
);
app.get("/facilities.html", (req, res) => res.render("facilities"));
app.get("/aboutPI.html", (req, res) => res.render("aboutPI"));
app.get("/teaching.html", (req, res) => res.render("teaching"));
app.get("/Collaboration.html", (req, res) => res.render("Collaboration"));
app.get("/ResearchMembers.html", (req, res) => res.render("ResearchMembers"));
app.get("/keyTechnology.html", (req, res) => res.render("keyTechnology"));
app.get("/Awards.html", (req, res) => res.render("Awards"));
app.get("/positions.html", (req, res) => res.render("positions"));
app.get("/Grants.html", (req, res) => res.render("Grants"));
app.get("/Education.html", (req, res) => res.render("Education"));
app.get("/ongoingResearch.html", (req, res) => res.render("ongoingResearch"));
app.get("/existingCollab.html", (req, res) => res.render("existingCollab"));
app.get("/researchCollab.html", (req, res) => res.render("researchCollab"));
app.get("/phdOpportunities.html", (req, res) => res.render("phdOpportunities"));
app.get("/internships.html", (req, res) => res.render("internships"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Custom 404 handler - MUST BE AFTER ALL ROUTES
app.use((req, res, next) => {
  res.status(404).render("404", {
    title: "Page Not Found - SCORE Research Group",
    description: "The page you are looking for could not be found.",
  });
});

// Error handler - MUST BE THE LAST MIDDLEWARE
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", {
    title: "Server Error - SCORE Research Group",
    description: "An internal server error occurred.",
  });
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
