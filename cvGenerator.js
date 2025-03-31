// cv-generator.js - Script to generate CV PDF from MongoDB data
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Define Book schema
const bookSchema = new mongoose.Schema({
  author: String,
  title: String,
  year: Number,
  isbn: String,
  photo: String,
});

// Define Chapter schema
const chapterSchema = new mongoose.Schema({
  author: String,
  chapterName: String,
  bookName: String,
  year: Number,
  ISBN: String,
  Page: String,
});

// Define Conference Proceedings schema
const conferenceSchema = new mongoose.Schema({
  author: String,
  title: String,
  conference: String,
  date: String,
  place: String,
  year: Number, // Extracted from date for grouping purposes
});

// Define Dissertation schema
const dissertationSchema = new mongoose.Schema({
  name: String,
  title: String,
  year: String,
  coSupervisors: String,
  degree: String,
});

// Define Patent schema
const patentSchema = new mongoose.Schema({
  title: String,
  authors: String,
  year: Number,
  applicationNumber: String,
  grantNumber: String,
  grantDate: String,
  description: String,
});

// Define Project schema
const projectSchema = new mongoose.Schema({
  title: String,
  year: String,
  funded: String,
  collaborator: String,
  projectType: String,
  role: String
});

// Define Publication schema
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

// Create models
const Book = mongoose.model("Book", bookSchema);
const Chapter = mongoose.model("Chapter", chapterSchema);
const Conference = mongoose.model("Conference", conferenceSchema);
const Dissertation = mongoose.model("Dissertation", dissertationSchema);
const Patent = mongoose.model("Patent", patentSchema);
const Project = mongoose.model("Project", projectSchema);
const Publication = mongoose.model("Publication", publicationSchema);

// Function to generate the PDF CV
async function generateCV() {
  try {
    // Fetch data from MongoDB
    const books = await Book.find().sort({ year: -1 });
    const chapters = await Chapter.find().sort({ year: -1 });
    const conferences = await Conference.find().sort({ year: -1 });
    const dissertations = await Dissertation.find().sort({ year: -1 });
    const patents = await Patent.find().sort({ year: -1 });
    const projects = await Project.find().sort({ year: -1 });
    const publications = await Publication.find().sort({ year: -1 });
    
    // Create a PDF document
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      size: "A4",
    });
    
    // Pipe PDF to write stream
    const outputPath = "./cv.pdf";
    doc.pipe(fs.createWriteStream(outputPath));
    
    // Add CV header
    doc.fontSize(24).font('Helvetica-Bold').text("Curriculum Vitae", { align: "center" });
    doc.moveDown();
    
    // Add a line
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();
    
    // Add personal info section (placeholder - you can customize this)
    doc.fontSize(16).font('Helvetica-Bold').text("Personal Information");
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text("Name: Prof. Sandeep Chaudhary");
    doc.text("Email: schaudhary@iiti.ac.in");
    doc.text("Mobile: 9549654195, 9414475375");
    doc.text("Phone: +91-731-660-3256");
    doc.moveDown();
    
    // Add publications section if data exists
    if (publications.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text("Journal Publications");
      doc.moveDown();
      
      publications.forEach((pub, index) => {
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`${index + 1}. ${pub.title}`);
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Author(s): ${pub.author}`);
        doc.text(`Journal: ${pub.journal}`);
        doc.text(`Year: ${pub.year}`);
        doc.text(`Volume/Pages: ${pub.volumePages}`);
        
        if (pub.impactFactor) {
          doc.text(`Impact Factor: ${pub.impactFactor}`);
        }
        
        if (pub.publicationLink) {
          doc.text(`Link: ${pub.publicationLink}`);
        }
        
        doc.moveDown();
      });
    }
    
    // Add books section if data exists
    if (books.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text("Books");
      doc.moveDown();
      
      books.forEach((book, index) => {
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`${index + 1}. ${book.title}`);
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Author(s): ${book.author}`);
        doc.text(`Year: ${book.year}`);
        doc.text(`ISBN: ${book.isbn}`);
        
        // Add image if available and path is valid
        if (book.photo && fs.existsSync(book.photo.startsWith('/') ? `.${book.photo}` : book.photo)) {
          try {
            const imgPath = book.photo.startsWith('/') ? `.${book.photo}` : book.photo;
            doc.image(imgPath, { width: 100 });
          } catch (error) {
            console.log(`Error adding image for book: ${book.title}`, error);
          }
        }
        
        doc.moveDown();
      });
    }
    
    // Add book chapters section if data exists
    if (chapters.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text("Book Chapters");
      doc.moveDown();
      
      chapters.forEach((chapter, index) => {
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`${index + 1}. ${chapter.chapterName}`);
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Author(s): ${chapter.author}`);
        doc.text(`Book: ${chapter.bookName}`);
        doc.text(`Year: ${chapter.year}`);
        doc.text(`ISBN: ${chapter.ISBN}`);
        doc.text(`Page: ${chapter.Page}`);
        
        doc.moveDown();
      });
    }
    
    // Add conference proceedings section if data exists
    if (conferences.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text("Conference Proceedings");
      doc.moveDown();
      
      conferences.forEach((conf, index) => {
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`${index + 1}. ${conf.title}`);
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Author(s): ${conf.author}`);
        doc.text(`Conference: ${conf.conference}`);
        doc.text(`Date: ${conf.date}`);
        doc.text(`Place: ${conf.place}`);
        doc.text(`Year: ${conf.year}`);
        
        doc.moveDown();
      });
    }
    
    // Add patents section if data exists
    if (patents.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text("Patents");
      doc.moveDown();
      
      patents.forEach((patent, index) => {
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`${index + 1}. ${patent.title}`);
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Author(s): ${patent.authors}`);
        doc.text(`Year: ${patent.year}`);
        doc.text(`Application Number: ${patent.applicationNumber}`);
        doc.text(`Grant Number: ${patent.grantNumber}`);
        doc.text(`Grant Date: ${patent.grantDate}`);
        doc.text(`Description: ${patent.description}`);
        
        doc.moveDown();
      });
    }
    
    // Add projects section if data exists
    if (projects.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text("Research Projects");
      doc.moveDown();
      
      projects.forEach((project, index) => {
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`${index + 1}. ${project.title}`);
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Year: ${project.year}`);
        doc.text(`Funded By: ${project.funded}`);
        doc.text(`Collaborator(s): ${project.collaborator}`);
        doc.text(`Project Type: ${project.projectType}`);
        doc.text(`Role: ${project.role}`);
        
        doc.moveDown();
      });
    }
    
    // Add dissertations section if data exists
    if (dissertations.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text("Supervised Dissertations");
      doc.moveDown();
      
      dissertations.forEach((dissertation, index) => {
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`${index + 1}. ${dissertation.title}`);
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Name: ${dissertation.name}`);
        doc.text(`Year: ${dissertation.year}`);
        doc.text(`Co-Supervisors: ${dissertation.coSupervisors}`);
        doc.text(`Degree: ${dissertation.degree}`);
        
        doc.moveDown();
      });
    }
    
    // Finalize PDF
    doc.end();
    
    console.log(`CV generated successfully at ${outputPath}`);
  } catch (error) {
    console.error("Error generating CV:", error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
  }
}

// Run the function
generateCV();