const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const axios = require('axios');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3010;

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

// Dissertation
const DissertationSchema = new mongoose.Schema({
  name: String,
  title: String,
  year: String,
  coSupervisors: String,
  degree: String,
});

const Dissertation = mongoose.model("Dissertation", DissertationSchema);


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
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


/////////////////////////////////////////Book///////////////////////////////////////////////////////

app.get('/admin/book.html',(req,res)=>{
  res.render("admin/book")
})

app.post("/books", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All (GET)
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One (GET by ID)
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update (PUT)
app.put("/books/:id", async (req, res) => {
  console.log("hi",req.body,"bi");
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    console.log(updatedBook);
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete (DELETE)
app.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////Publication///////////////////////////////////////////////////////
// Publication Routes

// Render Publication Admin Page
app.get('/admin/publication.html', (req, res) => {
  res.render("admin/publication")
})

// Create Publication (POST)
app.post("/publications", async (req, res) => {
  try {
    const newPublication = new Publication(req.body);
    const savedPublication = await newPublication.save();
    res.status(201).json(savedPublication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Publications (GET)
app.get("/publications", async (req, res) => {
  try {
    const publications = await Publication.find().sort({ year: -1 }); // Sort by most recent year
    res.json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Publication (GET by ID)
app.get("/publications/:id", async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }
    res.json(publication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Publication (PUT)
app.put("/publications/:id", async (req, res) => {
  try {
    const updatedPublication = await Publication.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedPublication) {
      return res.status(404).json({ message: "Publication not found" });
    }
    res.json(updatedPublication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Publication (DELETE)
app.delete("/publications/:id", async (req, res) => {
  try {
    const deletedPublication = await Publication.findByIdAndDelete(req.params.id);
    if (!deletedPublication) {
      return res.status(404).json({ message: "Publication not found" });
    }
    res.json({ message: "Publication deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Optional: Search Publications
app.get("/publications/search", async (req, res) => {
  try {
    const { query, year, journal } = req.query;
    
    // Build a dynamic search query
    let searchQuery = {};
    
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (year) {
      searchQuery.year = parseInt(year);
    }
    
    if (journal) {
      searchQuery.journal = { $regex: journal, $options: 'i' };
    }
    
    const publications = await Publication.find(searchQuery)
      .sort({ year: -1 })
      .limit(50); // Limit to prevent overly broad searches
    
    res.json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////Conference Routes/////////////////////////////////////////////////////////
// Conference Routes

// Render Conference Admin Page
app.get('/admin/conference.html', (req, res) => {
  res.render("admin/conference")
})

// Create Conference Proceeding (POST)
app.post("/conferences", async (req, res) => {
  try {
    const newConference = new Conference(req.body);
    const savedConference = await newConference.save();
    res.status(201).json(savedConference);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Conference Proceedings (GET)
app.get("/conferences", async (req, res) => {
  try {
    const conferences = await Conference.find().sort({ year: -1 }); // Sort by most recent year
    res.json(conferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Conference Proceeding (GET by ID)
app.get("/conferences/:id", async (req, res) => {
  try {
    const conference = await Conference.findById(req.params.id);
    if (!conference) {
      return res.status(404).json({ message: "Conference proceeding not found" });
    }
    res.json(conference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Conference Proceeding (PUT)
app.put("/conferences/:id", async (req, res) => {
  try {
    const updatedConference = await Conference.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedConference) {
      return res.status(404).json({ message: "Conference proceeding not found" });
    }
    res.json(updatedConference);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Conference Proceeding (DELETE)
app.delete("/conferences/:id", async (req, res) => {
  try {
    const deletedConference = await Conference.findByIdAndDelete(req.params.id);
    if (!deletedConference) {
      return res.status(404).json({ message: "Conference proceeding not found" });
    }
    res.json({ message: "Conference proceeding deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Optional: Search Conference Proceedings
app.get("/conferences/search", async (req, res) => {
  try {
    const { query, year, conference } = req.query;
    
    // Build a dynamic search query
    let searchQuery = {};
    
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (year) {
      searchQuery.year = parseInt(year);
    }
    
    if (conference) {
      searchQuery.conference = { $regex: conference, $options: 'i' };
    }
    
    const conferences = await Conference.find(searchQuery)
      .sort({ year: -1 })
      .limit(50); // Limit to prevent overly broad searches
    
    res.json(conferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Additional Optional Routes

// Get Unique Years for Filtering
app.get("/conferences/years", async (req, res) => {
  try {
    const years = await Conference.distinct('year');
    res.json(years.sort((a, b) => b - a));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Conferences by Year
app.get("/conferences/year/:year", async (req, res) => {
  try {
    const conferences = await Conference.find({ year: parseInt(req.params.year) })
      .sort({ date: 1 });
    res.json(conferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////chapters///////////////////////////////////////////////////////

// Book Chapter Routes

// Render Book Chapter Admin Page
app.get('/admin/chapters.html', (req, res) => {
  res.render("admin/chapters")
})

// Create Book Chapter (POST)
app.post("/chapters", async (req, res) => {
  try {
    const newChapter = new Chapter(req.body);
    const savedChapter = await newChapter.save();
    res.status(201).json(savedChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Book Chapters (GET)
app.get("/chapters", async (req, res) => {
  try {
    const chapters = await Chapter.find().sort({ year: -1 }); // Sort by most recent year
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Book Chapter (GET by ID)
app.get("/chapters/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: "Book chapter not found" });
    }
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Book Chapter (PUT)
app.put("/chapters/:id", async (req, res) => {
  try {
    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedChapter) {
      return res.status(404).json({ message: "Book chapter not found" });
    }
    res.json(updatedChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Book Chapter (DELETE)
app.delete("/chapters/:id", async (req, res) => {
  try {
    const deletedChapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!deletedChapter) {
      return res.status(404).json({ message: "Book chapter not found" });
    }
    res.json({ message: "Book chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Optional: Search Book Chapters
app.get("/chapters/search", async (req, res) => {
  try {
    const { query, year, bookName } = req.query;
    
    // Build a dynamic search query
    let searchQuery = {};
    
    if (query) {
      searchQuery.$or = [
        { chapterName: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (year) {
      searchQuery.year = parseInt(year);
    }
    
    if (bookName) {
      searchQuery.bookName = { $regex: bookName, $options: 'i' };
    }
    
    const chapters = await Chapter.find(searchQuery)
      .sort({ year: -1 })
      .limit(50); // Limit to prevent overly broad searches
    
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////projects////////////////////////////////////////////////////////

// Project Routes

// Render Project Admin Page
app.get('/admin/projects.html', (req, res) => {
  res.render("admin/projects")
})

// Create Project (POST)
app.post("/projects", async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Projects (GET)
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ year: -1 }); // Sort by most recent year
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Project (GET by ID)
app.get("/projects/:id", async (req, res) => {
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
app.put("/projects/:id", async (req, res) => {
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
app.delete("/projects/:id", async (req, res) => {
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

// Optional: Search Projects
app.get("/projects/search", async (req, res) => {
  try {
    const { query, year, projectType, funded } = req.query;
    
    // Build a dynamic search query
    let searchQuery = {};
    
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { collaborator: { $regex: query, $options: 'i' } },
        { role: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (year) {
      searchQuery.year = { $regex: year, $options: 'i' };
    }
    
    if (projectType) {
      searchQuery.projectType = { $regex: projectType, $options: 'i' };
    }
    
    if (funded) {
      searchQuery.funded = { $regex: funded, $options: 'i' };
    }
    
    const projects = await Project.find(searchQuery)
      .sort({ year: -1 })
      .limit(50); // Limit to prevent overly broad searches
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get projects by type
app.get("/projects/type/:projectType", async (req, res) => {
  try {
    const projectType = req.params.projectType;
    const projects = await Project.find({ projectType: projectType }).sort({ year: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get projects by role
app.get("/projects/role/:role", async (req, res) => {
  try {
    const role = req.params.role;
    const projects = await Project.find({ role: { $regex: role, $options: 'i' } }).sort({ year: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////Dissertation///////////////////////////////////////////////////
// Dissertation Routes

// Render Dissertation Admin Page
app.get('/admin/dissertations.html', (req, res) => {
  res.render("admin/dissertations")
})

// Create Dissertation (POST)
app.post("/dissertations", async (req, res) => {
  try {
    const newDissertation = new Dissertation(req.body);
    const savedDissertation = await newDissertation.save();
    res.status(201).json(savedDissertation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Dissertations (GET)
app.get("/dissertations", async (req, res) => {
  try {
    const dissertations = await Dissertation.find().sort({ year: -1 }); // Sort by most recent year
    res.json(dissertations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Dissertation (GET by ID)
app.get("/dissertations/:id", async (req, res) => {
  try {
    const dissertation = await Dissertation.findById(req.params.id);
    if (!dissertation) {
      return res.status(404).json({ message: "Dissertation not found" });
    }
    res.json(dissertation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Dissertation (PUT)
app.put("/dissertations/:id", async (req, res) => {
  try {
    const updatedDissertation = await Dissertation.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedDissertation) {
      return res.status(404).json({ message: "Dissertation not found" });
    }
    res.json(updatedDissertation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Dissertation (DELETE)
app.delete("/dissertations/:id", async (req, res) => {
  try {
    const deletedDissertation = await Dissertation.findByIdAndDelete(req.params.id);
    if (!deletedDissertation) {
      return res.status(404).json({ message: "Dissertation not found" });
    }
    res.json({ message: "Dissertation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Optional: Search Dissertations
app.get("/dissertations/search", async (req, res) => {
  try {
    const { query, year, degree } = req.query;
    
    // Build a dynamic search query
    let searchQuery = {};
    
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
        { coSupervisors: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (year) {
      searchQuery.year = { $regex: year, $options: 'i' };
    }
    
    if (degree) {
      searchQuery.degree = { $regex: degree, $options: 'i' };
    }
    
    const dissertations = await Dissertation.find(searchQuery)
      .sort({ year: -1 })
      .limit(50); // Limit to prevent overly broad searches
    
    res.json(dissertations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dissertations by degree
app.get("/dissertations/degree/:degree", async (req, res) => {
  try {
    const degree = req.params.degree;
    const dissertations = await Dissertation.find({ degree: { $regex: degree, $options: 'i' } }).sort({ year: -1 });
    res.json(dissertations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dissertations by supervisor
app.get("/dissertations/supervisor/:supervisor", async (req, res) => {
  try {
    const supervisor = req.params.supervisor;
    const dissertations = await Dissertation.find({ coSupervisors: { $regex: supervisor, $options: 'i' } }).sort({ year: -1 });
    res.json(dissertations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////patents/////////////////////////////////////////////////////
// Patent Routes
// Render Patent Admin Page
app.get('/admin/patents.html', (req, res) => {
  res.render("admin/patents")
})

// Create Patent (POST)
app.post("/patents", async (req, res) => {
  try {
    const newPatent = new Patent(req.body);
    const savedPatent = await newPatent.save();
    res.status(201).json(savedPatent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read All Patents (GET)
app.get("/patents", async (req, res) => {
  try {
    const patents = await Patent.find().sort({ year: -1 }); // Sort by most recent year
    res.json(patents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read One Patent (GET by ID)
app.get("/patents/:id", async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);
    if (!patent) {
      return res.status(404).json({ message: "Patent not found" });
    }
    res.json(patent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Patent (PUT)
app.put("/patents/:id", async (req, res) => {
  try {
    const updatedPatent = await Patent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
   
    if (!updatedPatent) {
      return res.status(404).json({ message: "Patent not found" });
    }
    res.json(updatedPatent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Patent (DELETE)
app.delete("/patents/:id", async (req, res) => {
  try {
    const deletedPatent = await Patent.findByIdAndDelete(req.params.id);
    if (!deletedPatent) {
      return res.status(404).json({ message: "Patent not found" });
    }
    res.json({ message: "Patent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Optional: Search Patents
app.get("/patents/search", async (req, res) => {
  try {
    const { query, year, grantNumber, applicationNumber } = req.query;
   
    // Build a dynamic search query
    let searchQuery = {};
   
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { authors: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
   
    if (year) {
      searchQuery.year = parseInt(year);
    }
   
    if (grantNumber) {
      searchQuery.grantNumber = { $regex: grantNumber, $options: 'i' };
    }
   
    if (applicationNumber) {
      searchQuery.applicationNumber = { $regex: applicationNumber, $options: 'i' };
    }
   
    const patents = await Patent.find(searchQuery)
      .sort({ year: -1 })
      .limit(50); // Limit to prevent overly broad searches
   
    res.json(patents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patents by year
app.get("/patents/year/:year", async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const patents = await Patent.find({ year: year }).sort({ grantDate: -1 });
    res.json(patents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patents by author
app.get("/patents/author/:authorName", async (req, res) => {
  try {
    const authorName = req.params.authorName;
    const patents = await Patent.find({ authors: { $regex: authorName, $options: 'i' } }).sort({ year: -1 });
    res.json(patents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/admin/index.html',(req,res)=>{
  res.render("admin/index")
})

app.get("/", async (req, res) => {
  res.render("index");
});
app.get("/facilities.html", async (req, res) => {
  res.render("facilities");
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

app.get("/Collaboration.html", async (req, res) => {
  res.render("Collaboration");
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



app.get("/Dissertation.html", async (req, res) => {
  try {
    // Fetch all projects from the database
    const researchData = await Dissertation.find();

    // Render the Projects.ejs page and pass projects
    res.render("Dissertation", { researchData });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send("Error loading projects");
  }
});

app.get("/Projects.html", async (req, res) => {
  try {
    // Fetch all projects from the database
    const projects = await Project.find();

    // Render the Projects.ejs page and pass projects
    res.render("Projects", { projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
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

