const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const axios = require('axios');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

const ItemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", ItemSchema);

const publicationSchema = new mongoose.Schema({
  author: String,
  title: String,
  journal: String,
  year: Number,
  volumePages: String,
  publicationLink: String,
  publicationDate: String,
  impactFactor: Number,
});
const Publication = mongoose.model("Publication", publicationSchema);

// Conference Proceedings Schema
const conferenceSchema = new mongoose.Schema({
  author: String,
  title: String,
  conference: String,
  date: String,
  place: String,
  year: Number,
});
const Conference = mongoose.model("Conference", conferenceSchema);
// book
const bookSchema = new mongoose.Schema({
  author: String,
  title: String,
  year: Number,
  isbn: String,
  photo: String,
});

const Book = mongoose.model("Book", bookSchema);

// Define the Chapter schema
const ChapterSchema = new mongoose.Schema({
  author: String,
  chapterName: String,
  bookName: String,
  year: Number,
  ISBN: String,
  Page: String,
});
const Chapter = mongoose.model("Chapter", ChapterSchema);

// Projects
const ProjectSchema = new mongoose.Schema({
  title: String,
  year: String,
  funded: String,
  collaborator: String,
  projectType: String,
  role: String,
});
const Project = mongoose.model("Project", ProjectSchema);

// Research Group
const researchGroupSchema = new mongoose.Schema({
  name: String,
  position: String,
  scholarLink: String,
  scholarTopic: String,
  year: String,
  type: String,
  photoUrl: String,
});

const ResearchGroup = mongoose.model("ResearchGroup", researchGroupSchema);

// patent
const PatentSchema = new mongoose.Schema({
  title: String,
  authors: String,
  year: Number,
  applicationNumber: String,
  grantNumber: String,
  grantDate: String,
  description: String,
});

const Patent = mongoose.model("Patent", PatentSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

// Add this before your route handlers
app.use((req, res, next) => {
  // Get the full URL path
  let fullPath = req.path;

  // Extract the page name from the URL path
  let currentPage;

  if (fullPath === "/" || fullPath === "/index.html") {
    currentPage = "home";
  } else if (fullPath.endsWith(".html")) {
    // Remove .html and leading slash
    currentPage = fullPath.replace(/^\//, "").replace(/\.html$/, "");
  } else {
    // For paths without .html
    currentPage = fullPath.replace(/^\//, "");
    if (currentPage === "") currentPage = "home";
  }

  // Add currentPage to res.locals so it's available in all templates
  res.locals.currentPage = currentPage;

  // Log to debug
  console.log("Current page set to:", currentPage, "from path:", fullPath);

  next();
});

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/index.html", async (req, res) => {
  res.render("index");
});
app.get("/aboutPI.html", async (req, res) => {
  res.render("aboutPI");
});

app.get("/teaching.html", async (req, res) => {
  res.render("teaching");
});


app.get("/ResearchMembers.html", async (req, res) => {
  res.render("ResearchMembers");
});
app.get("/keyTechnology.html", async (req, res) => {
  res.render("keyTechnology");
});

app.get("/Awards.html", async (req, res) => {
  res.render("Awards");
});
app.get("/positions.html", async (req, res) => {
  res.render("positions");
});
app.get("/Grants.html", async (req, res) => {
  res.render("Grants");
});
app.get("/Education.html", async (req, res) => {
  res.render("Education");
});

app.get("/ongoingResearch.html", async (req, res) => {
  res.render("ongoingResearch");
});

app.get("/existingCollab.html", async (req, res) => {
  res.render("existingCollab");
});

app.get("/researchCollab.html", async (req, res) => {
  res.render("researchCollab");
});

app.get("/existingCollab.html", async (req, res) => {
  res.render("existingCollab");
});

app.get("/phdOpportunities.html", async (req, res) => {
  res.render("phdOpportunities");
});

app.get("/internships.html", async (req, res) => {
  res.render("internships");
});

app.get("/extension.html", async (req, res) => {
  res.render("extension");
});
app.get("/contact.html", async (req, res) => {
  res.render("contact");
});

const SHEET_ID_Dissertations = "1dWreGKaR-s9TjCFM5-U2LYS-uznRM7wg2o5ntdrPcDY"; // Replace with actual Sheet ID
const API_KEY = "AIzaSyAVI_jtr5QRz9ixcg5XOOkmUwED4F2gtMk";   // Replace with actual API Key
const RANGE_Dissertations = "Sheet1!A2:E";      // Adjust range based on sheet

app.get('/Dissertation.html', async (req, res) => {
  try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_Dissertations}/values/${RANGE_Dissertations}?key=${API_KEY}`;
      const response = await axios.get(url);

      const rows = response.data.values || [];
      const researchData = rows.map(row => ({
          name: row[0] || "N/A",
          title: row[1] || "N/A",
          year: row[2] || "N/A",
          coSupervisors: row[3] || "N/A",
          degree: row[4] || "N/A"
      }));
      res.render('Dissertation', { researchData });
  } catch (error) {
      console.error("Error fetching data:", error);
      res.render('Dissertation', { researchData: [] });
  }
});

// app.get("/Projects.html", async (req, res) => {
//   try {
//     // Fetch all projects from the database
//     const projects = await Project.find();

//     // Render the Projects.ejs page and pass projects
//     res.render("Projects", { projects });
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     res.status(500).send("Error loading projects");
//   }
// });

const SHEET_ID_Project = "1twUrNhruozD27bZxtuG799oEOSFGMDkMkYW1abBI2CM";
const API_KEY_Project = "AIzaSyC2tMNGZLpLl7vioXIR1-U8KZ8F12t2Sbg"
const RANGE_Project = "Sheet1!A1:F"; // Adjust based on your columns

app.get("/Projects.html", async (req, res) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_Project}/values/${RANGE_Project}?key=${API_KEY_Project}`;
    const response = await axios.get(url);
    
    // Convert sheet data into an array of objects
    const rows = response.data.values;
    const headers = rows[0]; // First row as headers
    const projects = rows.slice(1).map(row => ({
      title: row[0],
      year: row[1],
      funded: row[2],
      collaborator: row[3],
      projectType: row[4],
      role: row[5]
    }));

    // Render Projects.ejs with fetched data
    res.render("Projects", { projects });

  } catch (error) {
    console.error("Error fetching projects from Google Sheets:", error);
    res.status(500).send("Error loading projects");
  }
});


app.get("/patents.html", async (req, res) => {
  try {
    // Fetch all projects from the database
    const patents = await Patent.find();

    // Render the Projects.ejs page and pass projects
    res.render("patents", { patents });
  } catch (error) {
    console.error("Error fetching patents:", error);
    res.status(500).send("Error loading patents");
  }
});

// Publications route - new implementation
app.get("/publication.html", async (req, res) => {
  try {
    // Fetch all publications and sort by year (descending) and impact factor (descending)
    const publications = await Publication.find()
      .sort({ year: -1, impactFactor: -1 })
      .exec();
    // Group publications by year
    const publicationsByYear = {};
    publications.forEach((pub) => {
      if (!publicationsByYear[pub.year]) {
        publicationsByYear[pub.year] = [];
      }
      publicationsByYear[pub.year].push(pub);
    });

    // Fetch all conference proceedings and sort by year (descending)
    const conferences = await Conference.find()
      .sort({ year: -1, date: -1 })
      .exec();
    // Group conference proceedings by year
    const conferencesByYear = {};
    conferences.forEach((conf) => {
      if (!conferencesByYear[conf.year]) {
        conferencesByYear[conf.year] = [];
      }
      conferencesByYear[conf.year].push(conf);
    });

    // Fetch all books and sort by year (descending)
    const books = await Book.find().sort({ year: -1 }).exec();
    const booksByYear = {};
    books.forEach((book) => {
      if (!booksByYear[book.year]) {
        booksByYear[book.year] = [];
      }
      booksByYear[book.year].push(book);
    });

    // Fetch all chapters and sort by year (descending)
    const chapters = await Chapter.find().sort({ year: -1 }).exec();
    const chaptersByYear = {};
    chapters.forEach((chapter) => {
      if (!chaptersByYear[chapter.year]) {
        chaptersByYear[chapter.year] = [];
      }
      chaptersByYear[chapter.year].push(chapter);
    });

    // Render the publication page with all data
    res.render("publication", {
      publications,
      publicationsByYear,
      conferences,
      conferencesByYear,
      books,
      booksByYear,
      chapters,
      chaptersByYear, // Pass chapters and grouped chapters to the template
    });
  } catch (error) {
    console.error("Error fetching publications or conferences:", error);
    res.status(500).send("Error loading publications or conferences");
  }
});

// Add this route to your app.js file
app.get("/add-books", (req, res) => {
  res.render("add-books");
});

// Updated POST route to handle form submission with image URL
app.post("/add-books", async (req, res) => {
  try {
    // Create new book from form data
    const newBook = new Book({
      author: req.body.author,
      title: req.body.title,
      year: parseInt(req.body.year),
      isbn: req.body.isbn || "",
      photo: req.body.photo || "",
    });

    // Save to database
    await newBook.save();

    // Redirect to books page with success message
    res.redirect("/publication.html");
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).render("add-books", {
      error: "Failed to add book. Please try again.",
      formData: req.body,
    });
  }
});

// Add this route to your app.js file
app.get("/add-publication", (req, res) => {
  res.render("add-publication");
});

// POST route to handle publication form submission
app.post("/add-publication", async (req, res) => {
  try {
    const Publication = require("./models/publication-schema");

    // Create new publication from form data
    const newPublication = new Publication({
      author: req.body.author,
      title: req.body.title,
      journal: req.body.journal,
      year: parseInt(req.body.year),
      volumePages: req.body.volumePages || "-",
      publicationLink: req.body.publicationLink || "",
      publicationDate: req.body.publicationDate || "",
      impactFactor: parseFloat(req.body.impactFactor) || 0,
    });

    // Save to database
    await newPublication.save();

    // Redirect to publications page with success message
    res.redirect("/publication.html?success=true");
  } catch (error) {
    console.error("Error adding publication:", error);
    res.status(500).render("add-publication", {
      error: "Failed to add publication. Please try again.",
      formData: req.body,
    });
  }
});

// Add this route to your app.js file
app.get("/add-conference", (req, res) => {
  res.render("add-conference");
});

app.get("/adminPanel", (req, res) => {
  res.render("adminPanel");
});

// POST route to handle conference form submission
app.post("/add-conference", async (req, res) => {
  try {
    const Conference = require("./models/conference-schema");

    // Extract year from date
    const dateString = req.body.date || "";
    let year = parseInt(req.body.year);

    // If year not specified, try to extract from date (assuming format includes year at the end)
    if (!year && dateString) {
      const yearMatch = dateString.match(/\d{4}/); // Match 4-digit year
      if (yearMatch) {
        year = parseInt(yearMatch[0]);
      }
    }

    // Create new conference from form data
    const newConference = new Conference({
      author: req.body.author,
      title: req.body.title,
      conference: req.body.conference,
      date: dateString,
      place: req.body.place || "",
      year: year || new Date().getFullYear(),
    });

    // Save to database
    await newConference.save();

    // Redirect to publications page with success message
    res.redirect("/publication.html?success=true");
  } catch (error) {
    console.error("Error adding conference:", error);
    res.status(500).render("add-conference", {
      error: "Failed to add conference proceeding. Please try again.",
      formData: req.body,
    });
  }
});

// API routes to get counts
app.get("/api/counts", async (req, res) => {
  try {
    const bookCount = await Book.countDocuments();
    const conferenceCount = await Conference.countDocuments();
    const publicationCount = await Publication.countDocuments();

    res.json({
      books: bookCount,
      conferences: conferenceCount,
      publications: publicationCount,
      total: bookCount + conferenceCount + publicationCount,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ error: "Failed to fetch counts" });
  }
});

// API route to get recent activity
app.get("/api/recent-activity", async (req, res) => {
  try {
    const recentBooks = await Book.find().sort({ _id: -1 }).limit(1);
    const recentConferences = await Conference.find()
      .sort({ _id: -1 })
      .limit(1);
    const recentPublications = await Publication.find()
      .sort({ _id: -1 })
      .limit(1);

    const activities = [];

    if (recentBooks.length > 0) {
      activities.push({
        type: "book",
        title: recentBooks[0].title,
        timestamp: recentBooks[0]._id.getTimestamp(),
      });
    }

    if (recentConferences.length > 0) {
      activities.push({
        type: "conference",
        title: recentConferences[0].title,
        timestamp: recentConferences[0]._id.getTimestamp(),
      });
    }

    if (recentPublications.length > 0) {
      activities.push({
        type: "publication",
        title: recentPublications[0].title,
        timestamp: recentPublications[0]._id.getTimestamp(),
      });
    }

    // Sort by most recent
    activities.sort((a, b) => b.timestamp - a.timestamp);

    res.json(activities.slice(0, 3));
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
});

app.get("/researchGroups", async (req, res) => {
  try {
    // Fetch all research group data
    const allMembers = await ResearchGroup.find({});

    // Organize data by type
    const organizedData = {};

    // Create empty arrays for each research type
    const types = [
      "Research Scholar",
      "Research Alumni",
      "Research Under-Graduates",
      "Research Under-Graduates Alumni",
      "Research Interns Alumni",
      "Research Post-Graduates Alumni",
    ];

    // Initialize object with empty arrays for each type
    types.forEach((type) => {
      organizedData[type] = [];
    });

    // Populate the organized data
    allMembers.forEach((member) => {
      // If the type exists in our structure, add the member
      if (organizedData[member.type] !== undefined) {
        organizedData[member.type].push(member);
      } else {
        // If type is not in our structure, create it
        organizedData[member.type] = [member];
      }
    });

    // Send response
    res.status(200).json(organizedData);
  } catch (error) {
    console.error("Error fetching research group data:", error);
    res.status(500).json({ error: "Failed to fetch research group data" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

