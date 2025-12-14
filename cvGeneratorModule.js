// cv-generator-module.js - CV generation as a module
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Define schemas (using existing definitions)
const ExtensionActivity = require("./models/ExtensionActivity"); 
const TechnologyTransfer = require("./models/TechnologyTransfer");
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
// Helper: Add Section Header
function addSectionHeader(doc, title) {
  doc.x = 50; // Reset X to left margin
  doc.moveDown(0.2);
  doc.font('Times-Bold').fontSize(11).text(title);
  doc.moveDown(0.3);
}

// Helper: Add Body Text (handles multiline input)
function addBodyText(doc, text) {
  if (!text) return;
  const lines = text.split('\n');
  lines.forEach(line => {
      if(line.trim()) {
          checkPageBreak(doc);
          doc.x = 50; // Reset X for every line/paragraph
          
          // Check for numbered list pattern (e.g. "1. ", "01. ", "1) ") - REQUIRE SPACE to avoid dates like "2009."
          const match = line.trim().match(/^(\d+[\.\)]\s+)(.*)/);
          
          if (match) {
              // Hanging Indent
              const num = match[1];
              const content = match[2];
              const startY = doc.y;
              doc.font('Times-Roman').fontSize(11).text(num, 50, startY);
              const yNum = doc.y;
              
              doc.text(content, 75, startY, { width: 470, align: 'justify', lineGap: 2 });
              const yContent = doc.y;
              
              doc.y = Math.max(yNum, yContent);
          } else {
              // Standard Paragraph
              doc.font('Times-Roman').fontSize(11).text(line.trim(), { align: 'justify', lineGap: 2 });
          }
          doc.moveDown(0.3);
      }
  });
  doc.moveDown(0.4);
}

// Helper: Check Page Break to keep items together
function checkPageBreak(doc, neededHeight = 60) {
    if (doc.y + neededHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
    }
}

// Helper: Bold specific substring "Chaudhary, S." while maintaining continued flow
function printWithBoldAuthor(doc, textStr, x, y, width) {
    const target = "Chaudhary, S.";
    // Split by target. Note: if textStr doesn't contain it, parts=[textStr]
    // If textStr starts with it, parts=["", remainder]
    const parts = textStr.split(target);
    const opts = { width: width, align: 'justify', continued: true };
    
    // We need to ensuring we start writing at x,y
    let isFirst = true;

    parts.forEach((part, i) => {
        if (isFirst) {
            doc.text(part, x, y, opts);
            isFirst = false;
        } else {
            doc.text(part, opts);
        }

        // If not the last part, we encountered a split, so print the target in bold
        if (i < parts.length - 1) {
            doc.font('Times-Bold').text(target, opts).font('Times-Roman');
        }
    });
}

// Main CV generation function
async function generateCV(config = {}) {
  try {
    // 1. Fetch ALL Data first (we need to filter in memory or query with $in)
    const books = await Book.find().sort({ year: -1 });
    const chapters = await Chapter.find().sort({ year: -1 });
    const conferences = await Conference.find().sort({ year: -1 });
    const dissertations = await Dissertation.find().sort({ year: -1 });
    const patents = await Patent.find().sort({ year: -1 });
    const projects = await Project.find().sort({ year: -1 });
    const publications = await Publication.find().sort({ year: -1 });
    const extensionActivities = await ExtensionActivity.find().sort({ startDate: -1 });
    const technologyTransfers = await TechnologyTransfer.find().sort({ year: -1 }); // Assuming sort logic or default

    // 2. Filter Data based on Config
    const filteredProjects = filterItems(projects, config.selectedProjects);
    const filteredPatents = filterItems(patents, config.selectedPatents);
    const filteredBooks = filterItems(books, config.selectedBooks);
    const filteredJournals = filterItems(publications, config.selectedJournals);
    const filteredChapters = filterItems(chapters, config.selectedChapters);
    const filteredConferences = filterItems(conferences, config.selectedConferences);
    const filteredDissertations = filterItems(dissertations, config.selectedDissertations);
    const filteredTechTransfers = filterItems(technologyTransfers, config.selectedTechTransfers);
    
    // Filter Extension Activities manually 
    // Section 15: Conference organised
    // Filter Extension Activities manually 
    // Section 15: Conference organised (Trust user selection from frontend)
    const organizedConferences = filterItems(extensionActivities, config.selectedOrganizedConferences);
    // Section 16: Workshop organised (Trust user selection from frontend)
    const organizedWorkshops = filterItems(extensionActivities, config.selectedWorkshops);

    // Filter Outreach for Section 18 (Trust user selection)
    const outreach = filterItems(extensionActivities, config.selectedOutreach);

    // Filter Definitions for Role Groups (Used for counts and display)
    const roleGroups = [
        { label: "As Principal Investigator", short: "PI", matches: ["Principal Investigator", "PI", "As Principal Investigator"] },
        { label: "As Scientific Director", short: "Scientific Director", matches: ["Scientific Director", "As Scientific Director"] },
        { label: "As Scientist Mentor", short: "Mentor", matches: ["Scientist Mentor", "Mentor", "As Scientist Mentor"] },
        { label: "As Co-Principal Investigator", short: "Co-PI", matches: ["Co-Principal Investigator", "Co-PI", "Co-PI/Co-Guide", "As Co-Principal Investigator"] },
        { label: "As a Guide", short: "Guide", matches: ["Guide", "As a Guide"] }
    ];
    const normalizeRole = r => r ? r.trim() : "";
    const isOngoing = (y) => y && (y.toLowerCase().includes('cont') || y.toLowerCase().includes('ongoing') || y.toLowerCase().includes('present'));

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
    doc.font('Times-Bold').fontSize(12).text("BRIEF CURRICULUM VITAE", { align: "center" });
    doc.moveDown(0.5);
    
    // 1. Personal Information
    // Simplified Header as per image: Name, Title, Address
    const pi = config.personalInfo || {};
    doc.font('Times-Bold').fontSize(11).text(pi.name || "Prof. SANDEEP CHAUDHARY");
    doc.moveDown(0.3);
    
    doc.font('Times-Roman').fontSize(11);
    if(pi.designation) {
        doc.text(pi.designation);
        doc.moveDown(0.3);
    }
    if(pi.address) {
        doc.text(pi.address);
        doc.moveDown(0.3);
    }
    
    if(pi.email) {
        doc.text(`Email: ${pi.email}`);
        doc.moveDown(0.3);
    }
    if(pi.mobile || pi.phone) doc.text(`Contact No.: ${pi.phone || ''} (O); ${pi.mobile || ''} (M)`);
    // doc.moveDown();

    // 2. Academic and Research Qualifications

    // Re-checking image description: "Academic and Research Qualifications" (Bold, no number?)
    // User code was numbered. I'll stick to bold headers without numbers if I want to match image PRECISELY.
    // Image scan: "Academic and Research Qualifications" - NO NUMBER.
    // I will remove numbers.
    // 2. Academic (No Number)
    doc.moveDown(0.8); // Specific spacing request
    addSectionHeader(doc, "Academic and Research Qualifications");
    addBodyText(doc, config.qualifications);

    // 3. Work Experience
    // 3. Work Experience
    addSectionHeader(doc, "Work Experience");
    addBodyText(doc, config.experience);

    // 4. Specialization
    // 4. Specialization
    addSectionHeader(doc, "Specialization");
    addBodyText(doc, config.specialization);

    // 5. Research Credentials
    // 5. Research Credentials
    addSectionHeader(doc, "Research Credentials");
    
    // Use Edited Credentials if available, otherwise fallback to calculation (or 0)
    const rc = config.researchCredentials || {};

    // Recalculate defaults just in case (or for fallback)
    const techTransferCount = filteredTechTransfers.length.toString().padStart(2, '0');
    const patentsGranted = filteredPatents.filter(p => p.grantNumber).length;
    const patentsOther = filteredPatents.length - patentsGranted;
    const patentStr = `${patentsGranted.toString().padStart(2, '0')}/${patentsOther.toString().padStart(2, '0')}/01/01`;

    const phds = filteredDissertations.filter(d => d.degree && d.degree.includes('Ph.D'));
    const phdOngoing = phds.filter(d => isOngoing(d.year)).length;
    const phdCompleted = phds.length - phdOngoing;
    
    const mtechs = filteredDissertations.filter(d => d.degree && (d.degree.includes('M.Tech') || d.degree.includes('M.Sc')));
    const mtechOngoing = mtechs.filter(d => isOngoing(d.year)).length;
    const mtechCompleted = mtechs.length - mtechOngoing;

    const projectCounts = roleGroups.map(group => {
         return filteredProjects.filter(p => {
             const r = normalizeRole(p.role);
             return group.matches.some(m => r.toLowerCase() === m.toLowerCase()); 
         }).length;
     });
    const projectCountStr = projectCounts.map(c => c.toString().padStart(2, '0')).join('/');

    const credentials = [
      { label: "Technology Transfer/ Translational Research:", value: rc.techTransfer || `${techTransferCount}/02` },
      { label: "Patents (granted/ published/filed/in process):", value: rc.patents || patentStr }, 
      { label: "Sponsored Research Projects:", value: rc.sponsoredProjects || filteredProjects.length.toString() },
      { label: "(PI/Scientific Director/Mentor/Co-PI/Guide)", value: rc.projectRoles || `(${projectCountStr})` },
      { label: "Publications in SCIE/Scopus Indexed Journals:", value: rc.journals || filteredJournals.length.toString() },
      { label: "Publications in Conference Proceedings:", value: rc.conferences || filteredConferences.length.toString() },
      { label: "Books authored/edited:", value: rc.books || filteredBooks.length.toString().padStart(2, '0') },
      { label: "Technical reports:", value: rc.technicalReports || "01" },
      { label: "Chapters in Books/Videos:", value: rc.chapters || filteredChapters.length.toString().padStart(2, '0') },
      { label: "Ph.D. Supervision (completed/ongoing):", value: rc.phdSupervision || `${phdCompleted}/${phdOngoing.toString().padStart(2, '0')}` },
      { label: "MTech and MSc thesis Awarded/Ongoing:", value: rc.mtechSupervision || `${mtechCompleted}/${mtechOngoing.toString().padStart(2, '0')}` }
    ];
    
    credentials.forEach(cred => {
         checkPageBreak(doc);
         const currentY = doc.y;
         doc.font('Times-Roman').fontSize(11).text(cred.label, 50, currentY);
         doc.text(cred.value, 450, currentY);
         doc.moveDown(0.4);
    });
    doc.x = 50; 
    // doc.moveDown();

    // 6. Courses Taught
    // 6. Courses Taught
    doc.moveDown(0.6); // Specific spacing request
    addSectionHeader(doc, "Courses Taught");
    addBodyText(doc, config.coursesTaught);

    // 7. Awards
    // 7. Awards
    addSectionHeader(doc, "Awards / Achievements / Recognitions / Fellowships");
    addBodyText(doc, config.awards);

    // 8. Sponsored Research Projects
    // 8. Sponsored Research Projects
    addSectionHeader(doc, "List of sponsored research projects");





    // Track which projects we've displayed to handle any "Others" if needed? 
    // For now, assuming data fits these categories or we just add an "Other" category at end.
    let displayedProjectIds = new Set();
    
    let globalProjCounter = 0; // If numbering should be continuous? Image shows "01, 02.." for EACH subsection probably? 
    // Actually image "As Principal Investigator (13)" -> "01. ...". 
    // It seems numbering resets or is per section. Let's assume resets per subsection based on the image "01. ...".
    
    roleGroups.forEach(group => {
        const groupProjects = filteredProjects.filter(p => {
             const r = normalizeRole(p.role);
             return group.matches.some(m => r.toLowerCase() === m.toLowerCase()) && !displayedProjectIds.has(p._id.toString());
        });

        if (groupProjects.length > 0) {
            groupProjects.forEach(p => displayedProjectIds.add(p._id.toString()));
            
            doc.moveDown(0.6);
            doc.font('Times-BoldItalic').fontSize(11).text(`${group.label} (${groupProjects.length})`);
            doc.moveDown(0.2);

            groupProjects.forEach((p, i) => {
                checkPageBreak(doc);
                const num = (i + 1).toString().padStart(2, '0');
                
                // Format: "01. "Title" funded by [Agency]. (Dates). Sanctioned Amount: [Amount]"
                // We rely on existing fields. `p.funded` usually contains agency.
                // Convert p.title to double quotes if not present
                const title = p.title.replace(/^"/, '').replace(/"$/, '');
                
                const startY = doc.y;
                doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
                
                let projText = `"${title}" funded by ${p.funded}. (${p.year})`;//Removed role
                if (p.collaborator && p.collaborator !== 'N/A' && p.collaborator.trim() !== '' && p.collaborator.trim() !== '-') {
                     projText += `. Collaborator: ${p.collaborator}`;
                }
                projText += ".";

                doc.text(projText, 75, startY, { width: 470, align: 'justify' });
                doc.moveDown(0.3);
            });
            doc.moveDown(0.3);
        }
    });

    // Handle any Remaining Projects (Others)
    const remainingProjects = filteredProjects.filter(p => !displayedProjectIds.has(p._id.toString()));
    if (remainingProjects.length > 0) {
        doc.font('Times-Italic').fontSize(11).text(`Other Projects (${remainingProjects.length})`);
        remainingProjects.forEach((p, i) => {
             checkPageBreak(doc);
             const num = (i + 1).toString().padStart(2, '0');
             const startY = doc.y;
             doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
             doc.text(`"${p.title}" (${p.year}). Funded by: ${p.funded}. Role: ${p.role}`, 75, startY, { width: 470, align: 'justify' });
             doc.moveDown(0.3);
        });
    }


    // 9. Patents
    // 9. Patents
    addSectionHeader(doc, "Patents");
    filteredPatents.forEach((p, i) => {
        checkPageBreak(doc);
        // Format: 01. Authors (Status, Year). "Title", Patent No. X, Grant Date: Y.
        const num = (i + 1).toString().padStart(2, '0');
        const status = p.grantNumber ? "Granted" : "Published";
        const yearStr = p.year ? `, ${p.year}` : "";
        const patentNoStr = p.grantNumber ? `, Patent No. ${p.grantNumber}` : "";
        const appNoStr = p.applicationNumber ? `, Application No. ${p.applicationNumber}` : "";
        const dateStr = p.grantDate ? `, Grant Date: ${p.grantDate}` : (p.grantNumber ? "" : `, Filed: ${p.year}`); // Fallback
        
        const startY = doc.y;
        doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
        doc.text(`${p.authors} (`, 75, startY, { width: 470, allowedToBreak: true, continued: true })
           .font('Times-Italic').text(`${status}${yearStr}`, { continued: true })
           .font('Times-Roman').text(`). "${p.title}"${patentNoStr}${appNoStr}${dateStr}.`);
        
        doc.moveDown(0.4);
    });
    // 10. List of publications
    // 10. List of publications
    addSectionHeader(doc, "List of publications");
    
    // Books
    if(filteredBooks.length > 0) {
        doc.font('Times-Italic').fontSize(11).text("Books Published");
        filteredBooks.forEach((b, i) => {
            checkPageBreak(doc);
            const num = (i + 1).toString().padStart(2, '0');
            
            const startY = doc.y;
            doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
            
            
            // Bold "Chaudhary, S." 
            const authorText = b.author || "";
            printWithBoldAuthor(doc, authorText, 75, startY, 470); // Starts content block

            // Format: (Year). Title. Publisher. (ISBN: ...)
            // Note: Title is kept Roman to match user image.
            doc.font('Times-Roman').text(` (${b.year}). ${b.title}. ${b.publisher ? b.publisher + '. ' : ''}(ISBN: ${b.isbn})`);
            doc.moveDown(0.4);
        });
    }
    
    // Journals
    if(filteredJournals.length > 0) {
        doc.font('Times-Italic').fontSize(11).text(`SCI/ SCI-E Journal Publications (${filteredJournals.length})`);
        doc.moveDown(0.2);

            filteredJournals.forEach((p, i) => {
            checkPageBreak(doc);
            const num = (i + 1).toString().padStart(2, '0');
            const startY = doc.y;
            doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
            
            
            // Format: 01. Author (Year). "Title". Journal, Vol, Pages.
            printWithBoldAuthor(doc, `${p.author} (${p.year}). "${p.title}". `, 75, startY, 470);
            doc.font('Times-Italic').text(`${p.journal}`, { continued: true })
               .font('Times-Roman').text(`, ${p.volumePages}.`);
            doc.moveDown(0.4);
        });
    }

    // Conferences
    // Conferences
    if(filteredConferences.length > 0) {
        doc.font('Times-Italic').fontSize(11).text(`Conference publications (${filteredConferences.length})`);
        filteredConferences.forEach((c, i) => {
            checkPageBreak(doc);
            const num = (i + 1).toString().padStart(2, '0');
            const startY = doc.y;
            doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
            // Bold Author support
            printWithBoldAuthor(doc, `${c.author} (${c.year}). "${c.title}". `, 75, startY, 470);
            
            doc.font('Times-Italic').text(`${c.conference}`, { continued: true })
               .font('Times-Roman').text(`, ${c.place}, ${c.date}.`);
            doc.moveDown(0.4);
        });
    }

    // Chapters
    // Chapters
    if(filteredChapters.length > 0) {
         doc.font('Times-Italic').fontSize(11).text(`Chapters/Video Chapters Published (${filteredChapters.length})`);
         filteredChapters.forEach((c, i) => {
             checkPageBreak(doc);
             const num = (i + 1).toString().padStart(2, '0');
             const startY = doc.y;
             doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
             printWithBoldAuthor(doc, `${c.author} (${c.year}). "${c.chapterName}". In `, 75, startY, 470);
             doc.font('Times-Italic').text(`${c.bookName}`, { continued: true })
                .font('Times-Roman').text(`, ${c.Page}. (ISBN: ${c.ISBN})`);
             doc.moveDown(0.4);
          });
    }

    // 11. Translational Contributions
    const customTrans = config.translationalCustom || [];
    const hasTransData = (filteredTechTransfers.length > 0) || (customTrans.length > 0) || config.translational;

    if (hasTransData) {
        // Header matches image
        addSectionHeader(doc, "Translational Contributions");
        
        // List from DB (TechnologyTransfer) - DISABLED as per user request (only Custom items shown)
        // if(filteredTechTransfers.length > 0) { ... }
        
        // List from Custom Items (config.translationalCustom)
        if(customTrans.length > 0) {
              customTrans.forEach(item => {
                   checkPageBreak(doc);
                   if(item.title) {
                       doc.x = 50;
                       doc.font('Times-Italic').fontSize(11).text(item.title);
                   }
                   if(item.description) {
                       doc.font('Times-Roman').fontSize(11).text(item.description, 65, doc.y, { width: 480, align: 'justify', lineGap: 2 });
                       doc.moveDown(0.3);
                   }
              });
        }

        // Additional text from config (Legacy string field)
        if (config.translational) {
             addBodyText(doc, config.translational);
        }
        // doc.moveDown();
    }

    // 12. Professional Affiliations
    // 12. Professional Affiliations
    addSectionHeader(doc, "Professional Affiliations");
    addBodyText(doc, config.affiliations);

    // 13. Administrative Positions
    // 13. Administrative Positions
    addSectionHeader(doc, "Administrative Positions Held");
    addBodyText(doc, config.adminPositions);

    // 14. Facilities Established
    // 14. Facilities Established
    addSectionHeader(doc, "Facilities and Centres established");
    addBodyText(doc, config.facilities);

    // 15. Workshops, conferences
    // 15. Workshops, conferences
    addSectionHeader(doc, "Conferences Organised");

    if (organizedConferences.length > 0) {
        organizedConferences.forEach((item, i) => {
            checkPageBreak(doc);
            const num = (i + 1).toString().padStart(2, '0');
            const startY = doc.y;

            // Format Dates: "Month DD-DD, YYYY" or just "Month DD, YYYY"
            const formatDate = (d) => {
                if(!d) return "";
                return new Date(d).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
            };

            let dateStr = "";
            if (item.startDate) {
                const start = new Date(item.startDate);
                const end = item.endDate ? new Date(item.endDate) : null;
                const month = start.toLocaleString('default', { month: 'long' });
                const year = start.getFullYear();
                
                if (end && start.getTime() !== end.getTime()) {
                     // Try to be smart about ranges like "March 21-22, 2025"
                     if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
                         dateStr = `(${month} ${start.getDate()}-${end.getDate()}, ${year})`;
                     } else {
                         dateStr = `(${formatDate(start)} - ${formatDate(end)})`;
                     }
                } else {
                    dateStr = `(${formatDate(start)})`;
                }
            }

            // Construct Content String
            // Pattern: [Description] "[Title]", [Location] [Date]. 
            // We strip quoting from DB if present to avoid double quoting
            const cleanTitle = item.title ? item.title.replace(/^"/, '').replace(/"$/, '') : "";
            
            // Build the text segments
            let text = "";
            if (cleanTitle) text += `${cleanTitle}`;
            if (item.description) text += ` of ${item.description}`;
            if (item.location) text += `, ${item.location}`;
            if (dateStr) text += ` ${dateStr}`;
            text += "."; // Period at end

            doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
            doc.text(text, 75, startY, { width: 470, align: 'justify' });
            doc.moveDown(0.4);
        });
        doc.moveDown(0.3);
    }

    // Append any manual additional text
    addBodyText(doc, config.workshopsConferences);
    // doc.moveDown();

    // 16. Workshops Organised
    addSectionHeader(doc, "Workshops Organised");

    if (organizedWorkshops.length > 0) {
         organizedWorkshops.forEach((item, i) => {
            checkPageBreak(doc);
            const num = (i + 1).toString().padStart(2, '0');
            const startY = doc.y;

            // Date Logic (Reused)
            const formatDate = (d) => {
                if(!d) return "";
                return new Date(d).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
            };

            let dateStr = "";
            if (item.startDate) {
                const start = new Date(item.startDate);
                const end = item.endDate ? new Date(item.endDate) : null;
                const month = start.toLocaleString('default', { month: 'long' });
                const year = start.getFullYear();
                
                if (end && start.getTime() !== end.getTime()) {
                     if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
                         dateStr = `(${month} ${start.getDate()}-${end.getDate()}, ${year})`;
                     } else {
                         dateStr = `(${formatDate(start)} - ${formatDate(end)})`;
                     }
                } else {
                    dateStr = `(${formatDate(start)})`;
                }
            }

            const cleanTitle = item.title ? item.title.replace(/^"/, '').replace(/"$/, '') : "";
            
            let text = "";
            if (cleanTitle) text += `${cleanTitle}`;
            if (item.description) text += ` of ${item.description}`;
            if (item.location) text += `, ${item.location}`;
            if (dateStr) text += ` ${dateStr}`;
            text += ".";

            doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
            doc.text(text, 75, startY, { width: 470, align: 'justify' });
            doc.moveDown(0.4);
        });
        doc.moveDown(0.3);
    }
    
    addBodyText(doc, config.continuingEducation);

    // 17. International Collaborations
    // 17. International Collaborations
    addSectionHeader(doc, "International Collaborations");
    addBodyText(doc, config.collaborations);

    // 18. Major Outreach
    // 18. Major Outreach
    // 18. Major Outreach
    addSectionHeader(doc, "Major Outreach (Intl/Natl Contributions)");
    
    const outreachGroups = [];
    // Group by Role dynamically with Merge Logic
    if(outreach.length > 0) {
        // Collect matches
        const groups = {};
        outreach.forEach(item => {
             let r = item.role || "Other Contributions";
             // Map Government to National
             if(r.toLowerCase().includes('government')) r = "National Contributions";
             // Map National to National (normalize)
             else if(r.toLowerCase().includes('national') && !r.toLowerCase().includes('international')) r = "National Contributions";
             // Map International to International (normalize) or Generic Contributions
             else if(r.toLowerCase().includes('international') || r.toLowerCase().includes('contributions')) r = "International Contributions";

             if(!groups[r]) groups[r] = [];
             groups[r].push(item);
        });
        
        // Sort keys to maybe keep Gov -> Intl -> Natl? 
        // Or just alphabetical? Or user defined?
        // Let's rely on alphanumeric sort for stability
        Object.keys(groups).sort().forEach(role => {
            outreachGroups.push({ title: role, items: groups[role] });
        });
    }

    outreachGroups.forEach(group => {
         if(group.items.length > 0) {
             doc.font('Times-Italic').fontSize(11).text(group.title);
             doc.moveDown(0.2);
              group.items.forEach((o, i) => {
                  checkPageBreak(doc);
                  const num = (i + 1).toString().padStart(2, '0');
                 let text = `${o.title}`;
                 if(o.description) text += ` - ${o.description}`;
                 
                 const startY = doc.y;
                 doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
                 doc.text(text, 75, startY, { width: 470, align: 'justify' }); // Hanging indent
                 doc.moveDown(0.4);
             });
             doc.moveDown();
         }
    });

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
