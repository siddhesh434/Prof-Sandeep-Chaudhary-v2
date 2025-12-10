// cv-generator-module.js - CV generation as a module
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Define schemas
const bookSchema = new mongoose.Schema({
  author: String,
  title: String,
  year: Number,
  isbn: String,
  photo: String,
});

const chapterSchema = new mongoose.Schema({
  author: String,
  chapterName: String,
  bookName: String,
  year: Number,
  ISBN: String,
  Page: String,
});

const conferenceSchema = new mongoose.Schema({
  author: String,
  title: String,
  conference: String,
  date: String,
  place: String,
  year: Number,
});

const dissertationSchema = new mongoose.Schema({
  name: String,
  title: String,
  year: String,
  coSupervisors: String,
  degree: String,
});

const patentSchema = new mongoose.Schema({
  title: String,
  authors: String,
  year: Number,
  applicationNumber: String,
  grantNumber: String,
  grantDate: String,
  description: String,
});

const projectSchema = new mongoose.Schema({
  title: String,
  year: String,
  funded: String,
  collaborator: String,
  projectType: String,
  role: String
});

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

// Create models - check if they already exist first
const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);
const Conference = mongoose.models.Conference || mongoose.model("Conference", conferenceSchema);
const Dissertation = mongoose.models.Dissertation || mongoose.model("Dissertation", dissertationSchema);
const Patent = mongoose.models.Patent || mongoose.model("Patent", patentSchema);
const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
const Publication = mongoose.models.Publication || mongoose.model("Publication", publicationSchema);

// Helper function to check if component should be included
function shouldInclude(componentName, selectedComponents) {
  return selectedComponents.includes(componentName);
}

// Helper function to format publication in APA style
function formatPublicationAPA(pub) {
  let apa = '';
  
  if (pub.author) {
    apa += pub.author;
  }
  
  if (pub.year) {
    apa += ` (${pub.year}). `;
  } else {
    apa += '. ';
  }
  
  if (pub.title) {
    apa += pub.title + '. ';
  }
  
  if (pub.journal) {
    apa += pub.journal;
  }
  
  if (pub.volumePages) {
    apa += ', ' + pub.volumePages;
  }
  
  apa += '.';
  
  return apa;
}

// Main CV generation function
async function generateCV(config = {}) {
  const { selectedComponents = ['publications', 'books', 'chapters', 'conferences', 'patents', 'projects', 'dissertations'], additionalInfo = '' } = config;

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
    const outputPath = path.join(__dirname, "cv.pdf");
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);
    
    // Add CV header
    doc.fontSize(24).font('Helvetica-Bold').text("Curriculum Vitae", { align: "center" });
    doc.moveDown();
    
    // Add a line
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();
    
    // Add personal info section
    doc.fontSize(16).font('Helvetica-Bold').text("Personal Information");
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text("Name: Prof. Sandeep Chaudhary");
    doc.text("Email: schaudhary@iiti.ac.in");
    doc.text("Mobile: 9549654195, 9414475375");
    doc.text("Phone: +91-731-660-3256");
    doc.moveDown();
    
    // Add additional information section if provided
    if (additionalInfo && additionalInfo.trim() !== '') {
      doc.fontSize(16).font('Helvetica-Bold').text("Additional Information");
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text(additionalInfo, {
        align: 'left',
        lineGap: 2
      });
      doc.moveDown();
    }
    
    // Add publications section if selected
    if (shouldInclude('publications', selectedComponents) && publications.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text("Journal Publications");
      doc.moveDown();
      
      publications.forEach((pub, index) => {
        const apaText = formatPublicationAPA(pub);
        
        doc.fontSize(12).font('Helvetica');
        const numberText = `${index + 1}. `;
        doc.text(numberText, { continued: true });
        doc.text(apaText);
        
        if (pub.impactFactor) {
          doc.fontSize(11).font('Helvetica').text(`   Impact Factor: ${pub.impactFactor}`, { indent: 20 });
        }
        
        if (pub.publicationLink) {
          doc.fontSize(11).font('Helvetica').text(`   DOI/Link: ${pub.publicationLink}`, { indent: 20 });
        }
        
        doc.moveDown();
      });
    }
    
    // Add books section if selected
    if (shouldInclude('books', selectedComponents) && books.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text("Books");
      doc.moveDown();
      
      books.forEach((book, index) => {
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`${index + 1}. ${book.title}`);
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Author(s): ${book.author}`);
        doc.text(`Year: ${book.year}`);
        doc.text(`ISBN: ${book.isbn}`);
        
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
    
    // Add book chapters section if selected
    if (shouldInclude('chapters', selectedComponents) && chapters.length > 0) {
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
    
    // Add conference proceedings section if selected
    if (shouldInclude('conferences', selectedComponents) && conferences.length > 0) {
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
    
    // Add patents section if selected
    if (shouldInclude('patents', selectedComponents) && patents.length > 0) {
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
    
    // Add projects section if selected
    if (shouldInclude('projects', selectedComponents) && projects.length > 0) {
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
    
    // Add dissertations section if selected
    if (shouldInclude('dissertations', selectedComponents) && dissertations.length > 0) {
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
    
    // Return a promise that resolves when the PDF is written
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        console.log(`CV generated successfully at ${outputPath}`);
        resolve(outputPath);
      });
      writeStream.on('error', reject);
    });
  } catch (error) {
    console.error("Error generating CV:", error);
    throw error;
  }
}

module.exports = { generateCV };
