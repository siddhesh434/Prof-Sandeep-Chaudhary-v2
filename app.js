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

// Import routes
const adminRoutes = require("./routes/admin");
const publicationRoutes = require("./routes/publications");
const projectRoutes = require("./routes/projects");
const patentRoutes = require("./routes/patents");
const dissertationRoutes = require("./routes/dissertations");
const cvRoutes = require("./routes/cv");
const contactRoutes = require("./routes/contact");
const controlRoutes = require("./routes/control");
const ResearchGroup=require("./routes/researchGroup")
const ExtensionActivity=require("./routes/extension")
//const fileRoutes = require("./routes/files");
// Use routes
app.use("/admin", adminRoutes);
app.use("/", publicationRoutes);
app.use("/", projectRoutes);
app.use("/", patentRoutes);
app.use("/", dissertationRoutes);
app.use("/", cvRoutes);
app.use("/", contactRoutes);
app.use("/", controlRoutes);
app.use('/',ResearchGroup);
app.use('/',ExtensionActivity);

//app.use("/", fileRoutes);
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

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
