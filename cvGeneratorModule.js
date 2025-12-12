// cv-generator-module.js - CV generation as a module
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Define schemas (using existing definitions)
const ExtensionActivity = require("./models/ExtensionActivity"); 
const Book = mongoose.models.Book || mongoose.model("Book", new mongoose.Schema({ author: String, title: String, year: Number, isbn: String, photo: String }));
const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", new mongoose.Schema({ author: String, chapterName: String, bookName: String, year: Number, ISBN: String, Page: String }));
const Conference = mongoose.models.Conference || mongoose.model("Conference", new mongoose.Schema({ author: String, title: String, conference: String, date: String, place: String, year: Number }));
const Dissertation = mongoose.models.Dissertation || mongoose.model("Dissertation", new mongoose.Schema({ name: String, title: String, year: String, coSupervisors: String, degree: String }));
const Patent = mongoose.models.Patent || mongoose.model("Patent", new mongoose.Schema({ title: String, authors: String, year: Number, applicationNumber: String, grantNumber: String, grantDate: String, description: String }));
const Project = mongoose.models.Project || mongoose.model("Project", new mongoose.Schema({ title: String, year: String, funded: String, collaborator: String, projectType: String, role: String }));
const Publication = mongoose.models.Publication || mongoose.model("Publication", new mongoose.Schema({ author: String, title: String, journal: String, year: Number, volumePages: String, publicationLink: String, publicationDate: String, impactFactor: Number }));

// Helper: Filter Items by ID
const filterItems = (items, selectedIds) => {
    if (!selectedIds || !Array.isArray(selectedIds)) return items; // Fallback
    // If array is present (even empty), filter strictly
    return items.filter(item => selectedIds.includes(item._id.toString()));
};

// Helper: Add Section Header
function addSectionHeader(doc, number, title) {
  doc.moveDown(0.6);
  doc.font('Times-Bold').fontSize(14).text(`${number}. ${title}`);
  doc.moveDown(0.3);
}

// Helper: Add Body Text (handles multiline input)
function addBodyText(doc, text) {
  if (!text) return;
  const lines = text.split('\n');
  lines.forEach(line => {
      if(line.trim()) {
          doc.font('Times-Roman').fontSize(12).text(line.trim(), { align: 'justify' });
      }
  });
  doc.moveDown(0.3);
}

// Main CV generation function
async function generateCV(config = {}) {
  try {
    // 1. Fetch ALL Data first (we need to filter in memory or query with $in)
    // For simplicity with existing code structure, we fetch all and filter JS side (datasets are likely small < 1000)
    const books = await Book.find().sort({ year: -1 });
    const chapters = await Chapter.find().sort({ year: -1 });
    const conferences = await Conference.find().sort({ year: -1 });
    const dissertations = await Dissertation.find().sort({ year: -1 });
    const patents = await Patent.find().sort({ year: -1 });
    const projects = await Project.find().sort({ year: -1 });
    const publications = await Publication.find().sort({ year: -1 });
    const extensionActivities = await ExtensionActivity.find().sort({ startDate: -1 });

    // 2. Filter Data based on Config
    const filteredProjects = filterItems(projects, config.selectedProjects);
    const filteredPatents = filterItems(patents, config.selectedPatents);
    const filteredBooks = filterItems(books, config.selectedBooks);
    const filteredJournals = filterItems(publications, config.selectedJournals);
    const filteredChapters = filterItems(chapters, config.selectedChapters);
    const filteredConferences = filterItems(conferences, config.selectedConferences);
    const filteredDissertations = filterItems(dissertations, config.selectedDissertations);
    
    // Filter Extension Activities manually since they are grouped
    const organizedConferences = filterItems(extensionActivities.filter(a => a.role === 'Conference organised'), config.selectedOrganizedConferences);
    const workshops = filterItems(extensionActivities.filter(a => a.role === 'Workshop organised'), config.selectedWorkshops);
    const outreach = filterItems(extensionActivities.filter(a => ['Government Advisory Roles', 'International Contributions', 'National Contributions'].includes(a.role)), config.selectedOutreach);

    // 3. Create PDF
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      size: "A4",
      bufferPages: true
    });
    
    const outputPath = path.join(__dirname, "cv.pdf");
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // --- Header ---
    doc.font('Times-Bold').fontSize(22).text("Curriculum Vitae", { align: "center" });
    doc.moveDown(0.5);
    doc.lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.8);

    // 1. Personal Information
    addSectionHeader(doc, "1", "Personal Information");
    const pi = config.personalInfo || {};
    doc.font('Times-Bold').fontSize(12).text(pi.name || "Prof. Sandeep Chaudhary");
    
    doc.font('Times-Roman').fontSize(12);
    if(pi.designation) doc.text(pi.designation);
    if(pi.address) doc.text(pi.address);
    
    let contact = [];
    if(pi.email) contact.push(`Email: ${pi.email}`);
    if(pi.mobile) contact.push(`Mobile: ${pi.mobile}`);
    if(contact.length > 0) doc.text(contact.join(" | "));
    doc.moveDown();

    // 2. Academic and Research Qualifications
    addSectionHeader(doc, "2", "Academic and Research Qualifications");
    addBodyText(doc, config.qualifications);

    // 3. Work Experience
    addSectionHeader(doc, "3", "Work Experience");
    addBodyText(doc, config.experience);

    // 4. Specialization
    addSectionHeader(doc, "4", "Specialization");
    addBodyText(doc, config.specialization);

    // 5. Research Credentials (Derived from FILTERED counts)
    addSectionHeader(doc, "5", "Research Credentials");
    const credentials = [
      `Sponsored Research Projects: ${filteredProjects.length}`,
      `Patents: ${filteredPatents.length}`,
      `Journal Publications: ${filteredJournals.length}`,
      `Books: ${filteredBooks.length}`,
      `Book Chapters: ${filteredChapters.length}`,
      `Conference Proceedings: ${filteredConferences.length}`,
      `Ph.D. Dissertations Supervised: ${filteredDissertations.filter(d => d.degree && d.degree.includes('Ph.D')).length}`,
      `M.Tech. Dissertations Supervised: ${filteredDissertations.filter(d => d.degree && d.degree.includes('M.Tech')).length}`
    ];
    
    let yPos = doc.y;
    doc.font('Times-Roman').fontSize(12);
    credentials.forEach((cred, i) => {
      if (i % 2 === 0) {
        doc.text(`• ${cred}`, 50, yPos);
      } else {
        doc.text(`• ${cred}`, 300, yPos);
        yPos += 18;
      }
    });
    doc.y = yPos + 10;
    doc.x = 50; // Reset to left margin

    // 6. Courses Taught
    addSectionHeader(doc, "6", "Courses Taught");
    addBodyText(doc, config.coursesTaught);

    // 7. Awards
    addSectionHeader(doc, "7", "Awards / Achievements / Recognitions / Fellowships");
    addBodyText(doc, config.awards);

    // 8. Sponsored Research Projects
    addSectionHeader(doc, "8", "Sponsored Research Projects");
    filteredProjects.forEach((p, i) => {
        doc.font('Times-Roman').fontSize(12).text(`${i+1}. "${p.title}"`, { continued: true });
        doc.font('Times-Italic').text(` (${p.year})`);
        doc.font('Times-Roman').text(`   Funded by: ${p.funded} | Role: ${p.role}`);
        doc.moveDown(0.2);
    });

    // 9. Patents
    addSectionHeader(doc, "9", "Patents");
    filteredPatents.forEach((p, i) => {
        doc.font('Times-Roman').fontSize(12).text(`${i+1}. ${p.title}`);
        doc.text(`   ${p.authors} (${p.year}). App No: ${p.applicationNumber}, Status: ${p.grantNumber ? `Granted (${p.grantNumber})` : 'Published/Filed'}`);
        doc.moveDown(0.2);
    });

    // 10. List of Publications
    addSectionHeader(doc, "10", "List of Publications");
    
    if(filteredBooks.length > 0) {
        doc.font('Times-Bold').fontSize(13).text("Books");
        filteredBooks.forEach((b, i) => {
            doc.font('Times-Roman').fontSize(12).text(`${i+1}. ${b.author} (${b.year}). `).font('Times-Italic').text(`${b.title}. `).font('Times-Roman').text(`ISBN: ${b.isbn}`);
            doc.moveDown(0.2);
        });
        doc.moveDown(0.5);
    }

    if(filteredJournals.length > 0) {
        doc.font('Times-Bold').fontSize(13).text("Journal Articles");
        filteredJournals.forEach((p, i) => {
            doc.font('Times-Roman').fontSize(12).text(`${i+1}. ${p.author} (${p.year}). "${p.title}". `).font('Times-Italic').text(`${p.journal}`).font('Times-Roman').text(`, ${p.volumePages}.`);
            if (p.impactFactor) doc.text(`   [Impact Factor: ${p.impactFactor}]`);
            doc.moveDown(0.2);
        });
        doc.moveDown(0.5);
    }

    if(filteredChapters.length > 0) {
        doc.font('Times-Bold').fontSize(13).text("Book Chapters");
        filteredChapters.forEach((c, i) => {
            doc.font('Times-Roman').fontSize(12).text(`${i+1}. ${c.author} (${c.year}). "${c.chapterName}". In `).font('Times-Italic').text(`${c.bookName}`).font('Times-Roman').text(`, pp. ${c.Page}. ISBN: ${c.ISBN}`);
            doc.moveDown(0.2);
        });
        doc.moveDown(0.5);
    }

    if(filteredConferences.length > 0) {
        doc.font('Times-Bold').fontSize(13).text("Conference Proceedings");
        filteredConferences.forEach((c, i) => {
             doc.font('Times-Roman').fontSize(12).text(`${i+1}. ${c.author} (${c.year}). "${c.title}". `).font('Times-Italic').text(`${c.conference}`).font('Times-Roman').text(`, ${c.place}.`);
             doc.moveDown(0.2);
        });
        doc.moveDown(0.5);
    }

    // 11. Translational Contributions
    addSectionHeader(doc, "11", "Translational Contributions");
    addBodyText(doc, config.translational);

    // 12. Professional Affiliations
    addSectionHeader(doc, "12", "Professional Affiliations");
    addBodyText(doc, config.affiliations);

    // 13. Administrative Positions
    addSectionHeader(doc, "13", "Administrative Positions Held");
    addBodyText(doc, config.adminPositions);

    // 14. Facilities Established
    addSectionHeader(doc, "14", "Facilities and Centres Established");
    addBodyText(doc, config.facilities);

    // 15. Conferences Organised
    addSectionHeader(doc, "15", "Conferences Organised");
    if(organizedConferences.length > 0) {
        organizedConferences.forEach((c, i) => {
             doc.font('Times-Roman').fontSize(12).text(`${i+1}. ${c.title}, ${c.location} (${c.startDate ? new Date(c.startDate).getFullYear() : 'N/A'}) - ${c.description}`);
             doc.moveDown(0.2);
        });
    } else {
        doc.font('Times-Roman').text("N/A");
    }
    doc.moveDown();

    // 16. Workshops
    addSectionHeader(doc, "16", "Continuing Education Programs");
    if(workshops.length > 0) {
        workshops.forEach((w, i) => {
             doc.font('Times-Roman').fontSize(12).text(`${i+1}. ${w.title}, ${w.location} - ${w.description}`);
             doc.moveDown(0.2);
        });
    } else {
         doc.font('Times-Roman').text("N/A");
    }
    doc.moveDown();

    // 17. International Collaborations
    addSectionHeader(doc, "17", "International Collaborations");
    addBodyText(doc, config.collaborations);

    // 18. Major Outreach
    addSectionHeader(doc, "18", "Major Outreach");
    if(outreach.length > 0) {
        outreach.forEach((o, i) => {
             // User requested "activity along with role". Assuming title is activity.
             doc.font('Times-Roman').fontSize(12).text(`${i+1}. ${o.title} `, { continued: true })
                .font('Times-Italic').text(`(${o.role})`, { continued: true })
                .font('Times-Roman').text(` - ${o.description}`);
             doc.moveDown(0.2);
        });
    } else {
         doc.font('Times-Roman').text("N/A");
    }

    doc.end();
    
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
