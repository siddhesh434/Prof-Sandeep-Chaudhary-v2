// cv-generator-module.js - CV generation as a module
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType, Footer, PageNumber } = require("docx");

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
// Helper: Add Body Text (handles multiline input or array)
function addBodyText(doc, content) {
    if (!content) return;

    if (Array.isArray(content)) {
        content.forEach(item => {
            if (!item || !item.trim()) return;
            checkPageBreak(doc);
            const startY = doc.y;
            // Bullet at x=60, Text at x=75
            doc.font('Times-Roman').fontSize(14).text("•", 60, startY - 1);
            doc.font('Times-Roman').fontSize(11).text(item.trim(), 75, startY, { width: 470, align: 'justify', lineGap: 2 });
            doc.moveDown(0.3);
        });
        doc.moveDown(0.4);
    } else if (typeof content === 'string') {
        const lines = content.split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                checkPageBreak(doc);
                doc.x = 50;

                // Check for numbered list pattern
                const match = line.trim().match(/^(\d+[\.\)]\s+)(.*)/);

                if (match) {
                    // Hanging Indent
                    const num = match[1];
                    const textContent = match[2];
                    const startY = doc.y;
                    doc.font('Times-Roman').fontSize(11).text(num, 50, startY);
                    doc.text(textContent, 75, startY, { width: 470, align: 'justify', lineGap: 2 });

                    // Ensure Y is correct after text block
                    // doc.text automatically advances Y, but we need to ensure we don't overlap if number was somehow taller (unlikely)
                } else {
                    // Standard Paragraph
                    doc.font('Times-Roman').fontSize(11).text(line.trim(), { align: 'justify', lineGap: 2 });
                }
                doc.moveDown(0.3);
            }
        });
        doc.moveDown(0.4);
    }
}

// Helper: Check Page Break to keep items together
function checkPageBreak(doc, neededHeight = 60) {
    if (doc.y + neededHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
    }
}

// Helper: Bold specific substring "Chaudhary, S." while maintaining continued flow
// Helper: Bold specific substring "Chaudhary, S." while maintaining continued flow
function printWithBoldAuthor(doc, textStr, x, y, width, keepOpen = true) {
    const target = "Chaudhary, S.";
    const parts = textStr.split(target);
    const baseOpts = { width: width, align: 'justify', continued: true };

    let isFirst = true;

    parts.forEach((part, i) => {
        // Determine continued state for THIS part
        // Only the very last part of the loop should respect 'keepOpen'.
        // All intermediate parts (and the bold separators) must be continued=true.
        const isLastPart = (i === parts.length - 1);
        const currentOpts = { ...baseOpts };

        if (isLastPart) {
            currentOpts.continued = keepOpen;
        }

        if (isFirst) {
            doc.text(part, x, y, currentOpts);
            isFirst = false;
        } else {
            doc.text(part, currentOpts);
        }

        // Print bold target between parts
        if (i < parts.length - 1) {
            doc.font('Times-Bold').text(target, { ...baseOpts, continued: true }).font('Times-Roman');
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
        // Filter Definitions for Role Groups (Used for counts and display)
        const roleGroups = [
            { label: "As Principal Investigator", short: "PI", matches: ["Principal Investigator", "PI", "As Principal Investigator", "as pi", "P.I.", "Principal Inv."] },
            { label: "As Scientific Director", short: "Scientific Director", matches: ["Scientific Director", "As Scientific Director", "Director"] },
            { label: "As Scientist Mentor", short: "Mentor", matches: ["Scientist Mentor", "Mentor", "As Scientist Mentor", "Mentor As Scientist", "Scientist", "As Scientist"] },
            { label: "As Co-Principal Investigator", short: "Co-PI", matches: ["Co-Principal Investigator", "Co-PI", "Co-PI/Co-Guide", "As Co-Principal Investigator", "Co-Investigator", "as co-pi"] },
            { label: "As a Guide", short: "Guide", matches: ["Guide", "As a Guide", "As Guide", "as guide"] }
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
        doc.font('Times-Bold').fontSize(12).text("CURRICULUM VITAE", { align: "center" });
        doc.moveDown(0.5);

        // 1. Personal Information
        // Simplified Header as per image: Name, Title, Address
        const pi = config.personalInfo || {};
        doc.font('Times-Bold').fontSize(11).text(pi.name || "Prof. SANDEEP CHAUDHARY");
        doc.moveDown(0.3);

        doc.font('Times-Roman').fontSize(11);
        if (pi.designation) {
            doc.text(pi.designation);
            doc.moveDown(0.3);
        }
        if (pi.address) {
            doc.text(pi.address);
            doc.moveDown(0.3);
        }

        if (pi.email) {
            doc.text(`Email: ${pi.email}`);
            doc.moveDown(0.3);
        }
        if (pi.mobile || pi.phone) doc.text(`Contact No.: ${pi.phone || ''} (O); ${pi.mobile || ''} (M)`);
        // doc.moveDown();

        // 2. Academic and Research Qualifications

        // Re-checking image description: "Academic and Research Qualifications" (Bold, no number?)
        // User code was numbered. I'll stick to bold headers without numbers if I want to match image PRECISELY.
        // Image scan: "Academic and Research Qualifications" - NO NUMBER.
        // I will remove numbers.
        // 2. Academic (No Number)
        if (config.showQualifications !== false) {
            doc.moveDown(0.8);
            addSectionHeader(doc, "Academic and Research Qualifications");
            addBodyText(doc, config.qualifications);
        }

        // 3. Work Experience
        // 3. Work Experience
        if (config.showExperience !== false) {
            addSectionHeader(doc, "Work Experience");
            addBodyText(doc, config.experience);
        }

        // 4. Specialization
        // 4. Specialization
        if (config.showSpecialization !== false) {
            addSectionHeader(doc, "Specialization");
            addBodyText(doc, config.specialization);
        }

        // 5. Research Credentials
        // Define sponsoredProjectsList at top scope for re-use
        // (It was defined below in original code, moving logic up if needed, but here we just ensure calculation runs)

        // Project Logic (Needed for Credentials & Projects section)
        const sponsoredProjectsList = filteredProjects.filter(p => !p.projectType || !p.projectType.toLowerCase().includes('consultancy'));
        const projectCounts = roleGroups.map(group => {
            return sponsoredProjectsList.filter(p => {
                const r = normalizeRole(p.role);
                return group.matches.some(m => r.toLowerCase() === m.toLowerCase());
            }).length;
        });
        const projectCountStr = projectCounts.map(c => c.toString().padStart(2, '0')).join('/');

        if (config.showResearchCredentials !== false) {
            addSectionHeader(doc, "Research Credentials");

            const rc = config.researchCredentials || {};

            // Recalculate defaults just in case (or for fallback)
            const techTransferCount = filteredTechTransfers.length.toString().padStart(2, '0');

            // Patent Logic
            const isGranted = (p) => {
                const no = p.grantNumber ? p.grantNumber.trim() : "";
                const date = p.grantDate ? p.grantDate.trim() : "";
                return no && date && no !== '-' && date !== '-' && no.toLowerCase() !== 'na' && date.toLowerCase() !== 'na';
            };
            const patentsGranted = filteredPatents.filter(p => isGranted(p)).length;
            const patentsOther = filteredPatents.length - patentsGranted;
            const patentStr = `${patentsGranted.toString().padStart(2, '0')}/${patentsOther.toString().padStart(2, '0')}/01/01`;

            // Ph.D. Logic
            const phdOngoing = filteredDissertations.filter(d => d.degree === 'PhD Thesis in progress').length;
            const phdCompleted = filteredDissertations.filter(d => d.degree === 'PhD Thesis Awarded').length;

            // M.Tech Logic - now separated into Awarded and Ongoing
            const mtechsAwarded = filteredDissertations.filter(d => d.degree === 'MTech and MSc Awarded');
            const mtechsOngoing = filteredDissertations.filter(d => d.degree === 'MTech and MSc Ongoing');
            const mtechCompleted = mtechsAwarded.length;
            const mtechOngoing = mtechsOngoing.length;

            const credentials = [
                { label: "Technology Transfer/ Translational Research:", value: rc.techTransfer || `${techTransferCount}/02` },
                { label: "Patents (granted/ published/filed/in process):", value: rc.patents || patentStr },
                { label: "Sponsored Research Projects:", value: rc.sponsoredProjects || sponsoredProjectsList.length.toString() },
                { label: "(PI/Scientific Director/Mentor/Co-PI/Guide)", value: rc.projectRoles || `(${projectCountStr})` },
                { label: "Publications in SCIE/Scopus Indexed Journals:", value: rc.journals || filteredJournals.length.toString() },
                { label: "Publications in Conference Proceedings:", value: rc.conferences || filteredConferences.length.toString() },
                { label: "Books authored/edited:", value: rc.books || filteredBooks.length.toString().padStart(2, '0') },
                { label: "Technical reports:", value: rc.technicalReports || "01" },
                { label: "Book/ video chapters:", value: rc.chapters || filteredChapters.length.toString().padStart(2, '0') },
                { label: "Ph.D. Supervision (completed/ongoing):", value: rc.phdSupervision || `${phdCompleted}/${phdOngoing.toString().padStart(2, '0')}` },
                { label: "MTech and MSc thesis Awarded/Ongoing:", value: rc.mtechSupervision || `${mtechCompleted}/${mtechOngoing.toString().padStart(2, '0')}` }
            ];

            credentials.forEach(cred => {
                checkPageBreak(doc);
                const currentY = doc.y;
                doc.font('Times-Roman').fontSize(11).text(cred.label, 50, currentY);
                doc.text(cred.value, 460, currentY); // 460 to right align roughly
                doc.moveDown(0.4);
            });
            doc.x = 50;
        }

        // 6. Courses Taught
        if (config.showCoursesTaught !== false) {
            addSectionHeader(doc, "Courses Taught");
            addBodyText(doc, config.coursesTaught);
        }

        // 7. Awards
        if (config.showAwards !== false) {
            addSectionHeader(doc, "Awards / Achievements / Recognitions / Fellowships");
            addBodyText(doc, config.awards);
        }

        // 8. Sponsored Research Projects
        if (config.showProjects !== false) {
            addSectionHeader(doc, "List of sponsored research projects");

            let displayedProjectIds = new Set();

            // Use the filtered list (excluding Consultancy) for the display section
            roleGroups.forEach(group => {
                const groupProjects = sponsoredProjectsList.filter(p => {
                    const r = normalizeRole(p.role);
                    return group.matches.some(m => r.toLowerCase() === m.toLowerCase()) && !displayedProjectIds.has(p._id.toString());
                });

                if (groupProjects.length > 0) {
                    groupProjects.forEach(p => displayedProjectIds.add(p._id.toString()));

                    doc.moveDown(0.3);
                    doc.font('Times-BoldItalic').fontSize(11).text(`${group.label} (${groupProjects.length})`);
                    doc.moveDown(0.2);

                    groupProjects.forEach((p, i) => {
                        checkPageBreak(doc);
                        const num = (i + 1).toString().padStart(2, '0');
                        const title = p.title.replace(/^"/, '').replace(/"$/, '');

                        const startY = doc.y;
                        doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);

                        let projText = `"${title}" funded by ${p.funded}. (${p.year})`;
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
            const remainingProjects = sponsoredProjectsList.filter(p => !displayedProjectIds.has(p._id.toString()));
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
        }


        // 9. Patents
        if (config.showPatents !== false) {
            addSectionHeader(doc, "Patents");

            // Re-use isGranted helper logic locally or just implement strict checks
            const isValid = (val) => val && val.trim() !== '' && val.trim() !== '-' && val.toLowerCase() !== 'na';

            filteredPatents.forEach((p, i) => {
                checkPageBreak(doc);
                const num = (i + 1).toString().padStart(2, '0');

                const hasGrantNo = isValid(p.grantNumber);
                const hasGrantDate = isValid(p.grantDate);
                const isGrantedLocal = hasGrantNo && hasGrantDate;

                const status = isGrantedLocal ? "Granted" : "Published";
                const yearStr = p.year ? `, ${p.year}` : "";

                const patentNoStr = hasGrantNo ? `, Patent No. ${p.grantNumber}` : "";
                const appNoStr = isValid(p.applicationNumber) ? `, Application No. ${p.applicationNumber}` : "";

                let dateStr = "";
                if (isGrantedLocal && hasGrantDate) {
                    dateStr = `, Grant Date: ${p.grantDate}`;
                } else if (!isGrantedLocal) {
                    dateStr = `, Filed: ${p.year}`;
                }

                const startY = doc.y;
                doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
                doc.text(`${p.authors} (`, 75, startY, { width: 470, allowedToBreak: true, continued: true })
                    .font('Times-Italic').text(`${status}${yearStr}`, { continued: true })
                    .font('Times-Roman').text(`). "${p.title}"${patentNoStr}${appNoStr}${dateStr}.`);

                doc.moveDown(0.4);
            });
        }
        // 10. List of publications
        // 10. List of publications
        // 10. List of publications
        if (config.showPublications !== false) {
            addSectionHeader(doc, "List of publications");

            // Books
            if (filteredBooks.length > 0) {
                doc.font('Times-BoldItalic').fontSize(11).text("Books Published");
                filteredBooks.forEach((b, i) => {
                    checkPageBreak(doc);
                    const num = (i + 1).toString().padStart(2, '0');

                    const startY = doc.y;
                    doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);

                    const authorText = b.author || "";
                    const yearStr = b.year ? ` (${b.year}). ` : "";
                    const titleStr = b.title ? `${b.title}. ` : "";
                    const pubStr = b.publisher ? `${b.publisher}. ` : "";
                    const isbnStr = b.isbn ? `(ISBN: ${b.isbn})` : "";

                    const fullText = `${authorText}${yearStr}${titleStr}${pubStr}${isbnStr}`;

                    printWithBoldAuthor(doc, fullText, 75, startY, 470, false);
                    doc.moveDown(0.4);
                });
            }

            // Journals
            if (filteredJournals.length > 0) {
                doc.font('Times-BoldItalic').fontSize(11).text(`SCI/ SCI-E Journal Publications (${filteredJournals.length})`);
                doc.moveDown(0.2);

                filteredJournals.forEach((p, i) => {
                    checkPageBreak(doc);
                    const num = (i + 1).toString().padStart(2, '0');
                    const startY = doc.y;
                    doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);

                    printWithBoldAuthor(doc, `${p.author} (${p.year}). "${p.title}". `, 75, startY, 470);
                    doc.font('Times-Italic').text(`${p.journal}`, { continued: true })
                        .font('Times-Roman').text(`, ${p.volumePages}.`);
                    doc.moveDown(0.4);
                });
            }

            // Conferences
            if (filteredConferences.length > 0) {
                doc.font('Times-BoldItalic').fontSize(11).text(`Conference publications (${filteredConferences.length})`);
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
            if (filteredChapters.length > 0) {
                doc.font('Times-BoldItalic').fontSize(11).text(`Chapters/Video Chapters Published (${filteredChapters.length})`);
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
        }

        // 11. Translational Contributions
        if (config.showTranslational !== false) {
            const customTrans = config.translationalCustom || [];
            const hasTransData = (filteredTechTransfers.length > 0) || (customTrans.length > 0) || config.translational;

            if (hasTransData) {
                addSectionHeader(doc, "Translational Contributions");

                // List from Custom Items (config.translationalCustom)
                if (customTrans.length > 0) {
                    customTrans.forEach(item => {
                        checkPageBreak(doc);
                        if (item.title) {
                            doc.x = 50;
                            doc.font('Times-Italic').fontSize(11).text(item.title);
                        }
                        if (item.description) {
                            doc.font('Times-Roman').fontSize(11).text(item.description, 65, doc.y, { width: 480, align: 'justify', lineGap: 2 });
                            doc.moveDown(0.3);
                        }
                    });
                }

                // Additional text from config
                if (config.translational) {
                    addBodyText(doc, config.translational);
                }
            }
        }

        // 12. Professional Affiliations
        if (config.showAffiliations !== false) {
            addSectionHeader(doc, "Professional Affiliations");
            addBodyText(doc, config.affiliations);
        }

        // 13. Administrative Positions
        if (config.showAdminPositions !== false) {
            addSectionHeader(doc, "Administrative Positions Held");
            addBodyText(doc, config.adminPositions);
        }

        // 14. Facilities Established
        if (config.showFacilities !== false) {
            addSectionHeader(doc, "Facilities and Centres established");
            addBodyText(doc, config.facilities);
        }

        // 15. Workshops, conferences
        if (config.showConferencesOrganised !== false) {
            addSectionHeader(doc, "Conferences Organised");

            if (organizedConferences.length > 0) {
                organizedConferences.forEach((item, i) => {
                    checkPageBreak(doc);
                    const num = (i + 1).toString().padStart(2, '0');
                    const startY = doc.y;

                    const formatDate = (d) => {
                        if (!d) return "";
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
        }

        // Append any manual additional text
        addBodyText(doc, config.workshopsConferences);
        // doc.moveDown();

        // 16. Workshops Organised
        if (config.showWorkshopsOrganised !== false) {
            addSectionHeader(doc, "Workshops Organised");

            if (organizedWorkshops.length > 0) {
                organizedWorkshops.forEach((item, i) => {
                    checkPageBreak(doc);
                    const num = (i + 1).toString().padStart(2, '0');
                    const startY = doc.y;

                    const formatDate = (d) => {
                        if (!d) return "";
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
        }

        // 17. International Collaborations
        if (config.showCollaborations !== false) {
            addSectionHeader(doc, "International Collaborations");
            addBodyText(doc, config.collaborations);
        }

        // 18. Major Outreach
        // 18. Major Outreach
        // 18. Major Outreach
        if (config.showOutreach !== false) {
            addSectionHeader(doc, "Major Outreach");

            const outreachGroups = [];
            if (outreach.length > 0) {
                const groups = {};
                outreach.forEach(item => {
                    let r = item.role || "Other Contributions";
                    if (r.toLowerCase().includes('government')) r = "Government Advisory Roles";
                    else if (r.toLowerCase().includes('national') && !r.toLowerCase().includes('international')) r = "Government Advisory Roles";
                    else if (r.toLowerCase().includes('international') || r.toLowerCase().includes('contributions')) r = "Contributions";

                    if (!groups[r]) groups[r] = [];
                    groups[r].push(item);
                });

                Object.keys(groups).sort().forEach(role => {
                    outreachGroups.push({ title: role, items: groups[role] });
                });
            }

            outreachGroups.forEach(group => {
                if (group.items.length > 0) {
                    doc.font('Times-Italic').fontSize(11).text(group.title);
                    doc.moveDown(0.2);
                    group.items.forEach((o, i) => {
                        checkPageBreak(doc);
                        const num = (i + 1).toString().padStart(2, '0');
                        let text = `${o.title}`;
                        if (o.description) text += ` - ${o.description}`;

                        const startY = doc.y;
                        doc.font('Times-Roman').fontSize(11).text(`${num}.`, 50, startY);
                        doc.text(text, 75, startY, { width: 470, align: 'justify' });
                        doc.moveDown(0.4);
                    });
                    doc.moveDown();
                }
            });
        }

        // Add Page Numbers
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);

            // Allow writing in the bottom margin
            const originalBottomMargin = doc.page.margins.bottom;
            doc.page.margins.bottom = 0;

            doc.font('Times-Roman').fontSize(9).text(
                `Page ${i + 1} of ${range.count}`,
                50,
                doc.page.height - 40,
                { align: 'center', width: doc.page.width - 100 }
            );

            // Restore margin
            doc.page.margins.bottom = originalBottomMargin;
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


// Helper for Word: Bold specific substring "Chaudhary, S."
function createWordTextRuns(textStr) {
    const target = "Chaudhary, S.";
    const parts = textStr.split(target);
    const runs = [];

    parts.forEach((part, i) => {
        if (part) {
            runs.push(new TextRun({ text: part, font: "Times New Roman", size: 22 })); // 22 half-pts = 11pt
        }
        if (i < parts.length - 1) {
            runs.push(new TextRun({ text: target, bold: true, font: "Times New Roman", size: 22 }));
        }
    });
    return runs;
}

// Helper for Word: Section Header
function createWordHeader(title) {
    return new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_3, // Using Heading 3 for section titles
        spacing: { before: 200, after: 100 },
        run: { font: "Times New Roman", bold: true, size: 22 } // Manually styling if Heading 3 isn't desired
    });
}

// Helper for Word: Body Text (multiline handle)
function createWordBodyText(content) {
    const paragraphs = [];
    if (!content) return paragraphs;

    if (Array.isArray(content)) {
        content.forEach(item => {
            if (!item || !item.trim()) return;
            paragraphs.push(new Paragraph({
                children: [
                    new TextRun({ text: item.trim(), font: "Times New Roman", size: 22 })
                ],
                bullet: { level: 0 }, // List item
                spacing: { after: 100 },
                alignment: AlignmentType.JUSTIFIED
            }));
        });
    } else if (typeof content === 'string') {
        const lines = content.split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                // Check if numbered
                const match = line.trim().match(/^(\d+[\.\)]\s+)(.*)/);
                if (match) {
                    paragraphs.push(new Paragraph({
                        children: [
                            new TextRun({ text: match[2], font: "Times New Roman", size: 22 })
                        ],
                        numbering: {
                            reference: "default-numbering", // We might need to rely on manual numbering if "numbering" is complex to set up momentarily, but let's try manual indent
                            level: 0
                        },
                        spacing: { after: 100 },
                        alignment: AlignmentType.JUSTIFIED
                    }));
                } else {
                    paragraphs.push(new Paragraph({
                        children: [new TextRun({ text: line.trim(), font: "Times New Roman", size: 22 })],
                        spacing: { after: 100 },
                        alignment: AlignmentType.JUSTIFIED
                    }));
                }
            }
        });
    }
    return paragraphs;
}


async function generateWordCV(config = {}) {
    try {
        // 1. Fetch ALL Data (Reusing logic from generateCV - ideally refactor to shared data fetcher)
        const books = await Book.find().sort({ year: -1 });
        const chapters = await Chapter.find().sort({ year: -1 });
        const conferences = await Conference.find().sort({ year: -1 });
        const dissertations = await Dissertation.find().sort({ year: -1 });
        const patents = await Patent.find().sort({ year: -1 });
        const projects = await Project.find().sort({ year: -1 });
        const publications = await Publication.find().sort({ year: -1 });
        const extensionActivities = await ExtensionActivity.find().sort({ startDate: -1 });
        const technologyTransfers = await TechnologyTransfer.find().sort({ year: -1 });

        // 2. Filter Data
        const filteredProjects = filterItems(projects, config.selectedProjects);
        const filteredPatents = filterItems(patents, config.selectedPatents);
        const filteredBooks = filterItems(books, config.selectedBooks);
        const filteredJournals = filterItems(publications, config.selectedJournals);
        const filteredChapters = filterItems(chapters, config.selectedChapters);
        const filteredConferences = filterItems(conferences, config.selectedConferences);
        const filteredDissertations = filterItems(dissertations, config.selectedDissertations);
        const filteredTechTransfers = filterItems(technologyTransfers, config.selectedTechTransfers);

        const organizedConferences = filterItems(extensionActivities, config.selectedOrganizedConferences);
        const organizedWorkshops = filterItems(extensionActivities, config.selectedWorkshops);
        const outreach = filterItems(extensionActivities, config.selectedOutreach);

        // Filter Definitions
        const roleGroups = [
            { label: "As Principal Investigator", short: "PI", matches: ["Principal Investigator", "PI", "As Principal Investigator", "as pi", "P.I.", "Principal Inv."] },
            { label: "As Scientific Director", short: "Scientific Director", matches: ["Scientific Director", "As Scientific Director", "Director"] },
            { label: "As Scientist Mentor", short: "Mentor", matches: ["Scientist Mentor", "Mentor", "As Scientist Mentor", "Mentor As Scientist", "Scientist", "As Scientist"] },
            { label: "As Co-Principal Investigator", short: "Co-PI", matches: ["Co-Principal Investigator", "Co-PI", "Co-PI/Co-Guide", "As Co-Principal Investigator", "Co-Investigator", "as co-pi"] },
            { label: "As a Guide", short: "Guide", matches: ["Guide", "As a Guide", "As Guide", "as guide"] }
        ];
        const normalizeRole = r => r ? r.trim() : "";
        const isOngoing = (y) => y && (y.toLowerCase().includes('cont') || y.toLowerCase().includes('ongoing') || y.toLowerCase().includes('present'));

        // --- Build Word Document ---
        const children = [];

        // Title
        children.push(new Paragraph({
            text: "CURRICULUM VITAE",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            run: { font: "Times New Roman", bold: true, size: 24 }
        }));

        // 1. Personal Info
        const pi = config.personalInfo || {};
        children.push(new Paragraph({
            children: [new TextRun({ text: pi.name || "Prof. SANDEEP CHAUDHARY", bold: true, font: "Times New Roman", size: 22 })],
            spacing: { after: 50 }
        }));

        if (pi.designation) {
            children.push(new Paragraph({
                children: [new TextRun({ text: pi.designation, font: "Times New Roman", size: 22 })],
                spacing: { after: 50 }
            }));
        }
        if (pi.address) {
            children.push(new Paragraph({
                children: [new TextRun({ text: pi.address, font: "Times New Roman", size: 22 })],
                spacing: { after: 50 }
            }));
        }
        if (pi.email) {
            children.push(new Paragraph({
                children: [new TextRun({ text: `Email: ${pi.email}`, font: "Times New Roman", size: 22 })],
                spacing: { after: 50 }
            }));
        }
        if (pi.mobile || pi.phone) {
            children.push(new Paragraph({
                children: [new TextRun({ text: `Contact No.: ${pi.phone || ''} (O); ${pi.mobile || ''} (M)`, font: "Times New Roman", size: 22 })],
                spacing: { after: 200 }
            }));
        }

        // 2. Academic
        if (config.showQualifications !== false) {
            children.push(createWordHeader("Academic and Research Qualifications"));
            children.push(...createWordBodyText(config.qualifications));
        }

        // 3. Work Experience
        if (config.showExperience !== false) {
            children.push(createWordHeader("Work Experience"));
            children.push(...createWordBodyText(config.experience));
        }

        // 4. Specialization
        if (config.showSpecialization !== false) {
            children.push(createWordHeader("Specialization"));
            children.push(...createWordBodyText(config.specialization));
        }

        // 5. Research Credentials
        const sponsoredProjectsList = filteredProjects.filter(p => !p.projectType || !p.projectType.toLowerCase().includes('consultancy'));
        const projectCounts = roleGroups.map(group => {
            return sponsoredProjectsList.filter(p => {
                const r = normalizeRole(p.role);
                return group.matches.some(m => r.toLowerCase() === m.toLowerCase());
            }).length;
        });
        const projectCountStr = projectCounts.map(c => c.toString().padStart(2, '0')).join('/');

        if (config.showResearchCredentials !== false) {
            children.push(createWordHeader("Research Credentials"));
            const rc = config.researchCredentials || {};
            const techTransferCount = filteredTechTransfers.length.toString().padStart(2, '0');

            const isGranted = (p) => {
                const no = p.grantNumber ? p.grantNumber.trim() : "";
                const date = p.grantDate ? p.grantDate.trim() : "";
                return no && date && no !== '-' && date !== '-' && no.toLowerCase() !== 'na' && date.toLowerCase() !== 'na';
            };
            const patentsGranted = filteredPatents.filter(p => isGranted(p)).length;
            const patentsOther = filteredPatents.length - patentsGranted;
            const patentStr = `${patentsGranted.toString().padStart(2, '0')}/${patentsOther.toString().padStart(2, '0')}/01/01`;

            const phdOngoing = filteredDissertations.filter(d => d.degree === 'PhD Thesis in progress').length;
            const phdCompleted = filteredDissertations.filter(d => d.degree === 'PhD Thesis Awarded').length;
            const mtechsAwarded = filteredDissertations.filter(d => d.degree === 'MTech and MSc Awarded');
            const mtechsOngoing = filteredDissertations.filter(d => d.degree === 'MTech and MSc Ongoing');
            const mtechCompleted = mtechsAwarded.length;
            const mtechOngoing = mtechsOngoing.length;

            const credentials = [
                { label: "Technology Transfer/ Translational Research:", value: rc.techTransfer || `${techTransferCount}/02` },
                { label: "Patents (granted/ published/filed/in process):", value: rc.patents || patentStr },
                { label: "Sponsored Research Projects:", value: rc.sponsoredProjects || sponsoredProjectsList.length.toString() },
                { label: "(PI/Scientific Director/Mentor/Co-PI/Guide)", value: rc.projectRoles || `(${projectCountStr})` },
                { label: "Publications in SCIE/Scopus Indexed Journals:", value: rc.journals || filteredJournals.length.toString() },
                { label: "Publications in Conference Proceedings:", value: rc.conferences || filteredConferences.length.toString() },
                { label: "Books authored/edited:", value: rc.books || filteredBooks.length.toString().padStart(2, '0') },
                { label: "Technical reports:", value: rc.technicalReports || "01" },
                { label: "Book/ video chapters:", value: rc.chapters || filteredChapters.length.toString().padStart(2, '0') },
                { label: "Ph.D. Supervision (completed/ongoing):", value: rc.phdSupervision || `${phdCompleted}/${phdOngoing.toString().padStart(2, '0')}` },
                { label: "MTech and MSc thesis Awarded/Ongoing:", value: rc.mtechSupervision || `${mtechCompleted}/${mtechOngoing.toString().padStart(2, '0')}` }
            ];

            credentials.forEach(cred => {
                // Using Tab stops for alignment
                children.push(new Paragraph({
                    children: [
                        new TextRun({ text: cred.label, font: "Times New Roman", size: 22 }),
                        new TextRun({ text: "\t" + cred.value, font: "Times New Roman", size: 22 })
                    ],
                    tabStops: [
                        { position: 9000, type: TabStopType.RIGHT }
                    ],
                    spacing: { after: 50 }
                }));
            });
        }

        // 6. Courses Taught
        if (config.showCoursesTaught !== false) {
            children.push(createWordHeader("Courses Taught"));
            children.push(...createWordBodyText(config.coursesTaught));
        }

        // 7. Awards
        if (config.showAwards !== false) {
            children.push(createWordHeader("Awards / Achievements / Recognitions / Fellowships"));
            children.push(...createWordBodyText(config.awards));
        }

        // 8. Projects
        if (config.showProjects !== false) {
            children.push(createWordHeader("List of sponsored research projects"));
            let displayedProjectIds = new Set();

            roleGroups.forEach(group => {
                const groupProjects = sponsoredProjectsList.filter(p => {
                    const r = normalizeRole(p.role);
                    return group.matches.some(m => r.toLowerCase() === m.toLowerCase()) && !displayedProjectIds.has(p._id.toString());
                });

                if (groupProjects.length > 0) {
                    groupProjects.forEach(p => displayedProjectIds.add(p._id.toString()));

                    children.push(new Paragraph({
                        text: `${group.label} (${groupProjects.length})`,
                        run: { font: "Times New Roman", size: 22, italics: true, bold: true },
                        spacing: { before: 100, after: 50 }
                    }));

                    groupProjects.forEach((p, i) => {
                        const title = p.title.replace(/^"/, '').replace(/"$/, '');
                        let projText = `"${title}" funded by ${p.funded}. (${p.year})`;
                        if (p.collaborator && p.collaborator !== 'N/A' && p.collaborator.trim() !== '' && p.collaborator.trim() !== '-') {
                            projText += `. Collaborator: ${p.collaborator}`;
                        }
                        projText += ".";

                        children.push(new Paragraph({
                            children: [
                                new TextRun({ text: `${i + 1}. `, font: "Times New Roman", size: 22 }),
                                new TextRun({ text: projText, font: "Times New Roman", size: 22 })
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 50 }
                        }));
                    });
                }
            });

            // Other Projects
            const remainingProjects = sponsoredProjectsList.filter(p => !displayedProjectIds.has(p._id.toString()));
            if (remainingProjects.length > 0) {
                children.push(new Paragraph({
                    text: `Other Projects (${remainingProjects.length})`,
                    run: { font: "Times New Roman", size: 22, italics: true },
                    spacing: { before: 100, after: 50 }
                }));
                remainingProjects.forEach((p, i) => {
                    children.push(new Paragraph({
                        children: [
                            new TextRun({ text: `${i + 1}. `, font: "Times New Roman", size: 22 }),
                            new TextRun({ text: `"${p.title}" (${p.year}). Funded by: ${p.funded}. Role: ${p.role}`, font: "Times New Roman", size: 22 })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 50 }
                    }));
                });
            }
        }

        // 9. Patents
        if (config.showPatents !== false) {
            children.push(createWordHeader("Patents"));
            const isValid = (val) => val && val.trim() !== '' && val.trim() !== '-' && val.toLowerCase() !== 'na';

            filteredPatents.forEach((p, i) => {
                const hasGrantNo = isValid(p.grantNumber);
                const hasGrantDate = isValid(p.grantDate);
                const isGrantedLocal = hasGrantNo && hasGrantDate;
                const status = isGrantedLocal ? "Granted" : "Published";
                const yearStr = p.year ? `, ${p.year}` : "";
                const patentNoStr = hasGrantNo ? `, Patent No. ${p.grantNumber}` : "";
                const appNoStr = isValid(p.applicationNumber) ? `, Application No. ${p.applicationNumber}` : "";
                let dateStr = "";
                if (isGrantedLocal && hasGrantDate) {
                    dateStr = `, Grant Date: ${p.grantDate}`;
                } else if (!isGrantedLocal) {
                    dateStr = `, Filed: ${p.year}`;
                }

                const runParts = [
                    new TextRun({ text: `${i + 1}. `, font: "Times New Roman", size: 22 }),
                    new TextRun({ text: `${p.authors} (`, font: "Times New Roman", size: 22 }),
                    new TextRun({ text: `${status}${yearStr}`, font: "Times New Roman", size: 22, italics: true }),
                    new TextRun({ text: `). "${p.title}"${patentNoStr}${appNoStr}${dateStr}.`, font: "Times New Roman", size: 22 })
                ];

                children.push(new Paragraph({
                    children: runParts,
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 50 }
                }));
            });
        }

        // 10. Publications
        if (config.showPublications !== false) {
            children.push(createWordHeader("List of publications"));

            if (filteredBooks.length > 0) {
                children.push(new Paragraph({
                    text: "Books Published",
                    run: { font: "Times New Roman", size: 22, italics: true, bold: true },
                    spacing: { before: 100, after: 50 }
                }));
                filteredBooks.forEach((b, i) => {
                    const authorText = b.author || "";
                    const yearStr = b.year ? ` (${b.year}). ` : "";
                    const titleStr = b.title ? `${b.title}. ` : "";
                    const pubStr = b.publisher ? `${b.publisher}. ` : "";
                    const isbnStr = b.isbn ? `(ISBN: ${b.isbn})` : "";

                    const fullText = `${authorText}${yearStr}${titleStr}${pubStr}${isbnStr}`;
                    const runs = createWordTextRuns(fullText);
                    runs.unshift(new TextRun({ text: `${i + 1}. `, font: "Times New Roman", size: 22 }));

                    children.push(new Paragraph({
                        children: runs,
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 50 }
                    }));
                });
            }

            if (filteredJournals.length > 0) {
                children.push(new Paragraph({
                    text: `SCI/ SCI-E Journal Publications (${filteredJournals.length})`,
                    run: { font: "Times New Roman", size: 22, italics: true, bold: true },
                    spacing: { before: 100, after: 50 }
                }));
                filteredJournals.forEach((p, i) => {
                    const prefixRuns = createWordTextRuns(`${p.author} (${p.year}). "${p.title}". `);
                    prefixRuns.unshift(new TextRun({ text: `${i + 1}. `, font: "Times New Roman", size: 22 }));

                    prefixRuns.push(new TextRun({ text: `${p.journal}`, font: "Times New Roman", size: 22, italics: true }));
                    prefixRuns.push(new TextRun({ text: `, ${p.volumePages}.`, font: "Times New Roman", size: 22 }));

                    children.push(new Paragraph({
                        children: prefixRuns,
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 50 }
                    }));
                });
            }

            if (filteredConferences.length > 0) {
                children.push(new Paragraph({
                    text: `Conference publications (${filteredConferences.length})`,
                    run: { font: "Times New Roman", size: 22, italics: true, bold: true },
                    spacing: { before: 100, after: 50 }
                }));
                filteredConferences.forEach((c, i) => {
                    const prefixRuns = createWordTextRuns(`${c.author} (${c.year}). "${c.title}". `);
                    prefixRuns.unshift(new TextRun({ text: `${i + 1}. `, font: "Times New Roman", size: 22 }));

                    prefixRuns.push(new TextRun({ text: `${c.conference}`, font: "Times New Roman", size: 22, italics: true }));
                    prefixRuns.push(new TextRun({ text: `, ${c.place}, ${c.date}.`, font: "Times New Roman", size: 22 }));

                    children.push(new Paragraph({
                        children: prefixRuns,
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 50 }
                    }));
                });
            }

            if (filteredChapters.length > 0) {
                children.push(new Paragraph({
                    text: `Chapters/Video Chapters Published (${filteredChapters.length})`,
                    run: { font: "Times New Roman", size: 22, italics: true, bold: true },
                    spacing: { before: 100, after: 50 }
                }));
                filteredChapters.forEach((c, i) => {
                    const prefixRuns = createWordTextRuns(`${c.author} (${c.year}). "${c.chapterName}". In `);
                    prefixRuns.unshift(new TextRun({ text: `${i + 1}. `, font: "Times New Roman", size: 22 }));

                    prefixRuns.push(new TextRun({ text: `${c.bookName}`, font: "Times New Roman", size: 22, italics: true }));
                    prefixRuns.push(new TextRun({ text: `, ${c.Page}. (ISBN: ${c.ISBN})`, font: "Times New Roman", size: 22 }));

                    children.push(new Paragraph({
                        children: prefixRuns,
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 50 }
                    }));
                });
            }
        }

        // 11. Translational
        if (config.showTranslational !== false) {
            const customTrans = config.translationalCustom || [];
            const hasTransData = (filteredTechTransfers.length > 0) || (customTrans.length > 0) || config.translational;

            if (hasTransData) {
                children.push(createWordHeader("Translational Contributions"));
                if (customTrans.length > 0) {
                    customTrans.forEach(item => {
                        if (item.title) {
                            children.push(new Paragraph({
                                text: item.title,
                                run: { font: "Times New Roman", size: 22, italics: true },
                                spacing: { after: 50 }
                            }));
                        }
                        if (item.description) {
                            children.push(new Paragraph({
                                text: item.description,
                                run: { font: "Times New Roman", size: 22 },
                                alignment: AlignmentType.JUSTIFIED,
                                spacing: { after: 50 },
                                indent: { left: 720 } // 0.5 inch
                            }));
                        }
                    });
                }
                if (config.translational) {
                    children.push(...createWordBodyText(config.translational));
                }
            }
        }

        // 12. Affiliations
        if (config.showAffiliations !== false) {
            children.push(createWordHeader("Professional Affiliations"));
            children.push(...createWordBodyText(config.affiliations));
        }

        // 13. Admin Positions
        if (config.showAdminPositions !== false) {
            children.push(createWordHeader("Administrative Positions Held"));
            children.push(...createWordBodyText(config.adminPositions));
        }

        // 14. Facilities
        if (config.showFacilities !== false) {
            children.push(createWordHeader("Facilities and Centres established"));
            children.push(...createWordBodyText(config.facilities));
        }

        // 15. Conf Organised
        if (config.showConferencesOrganised !== false) {
            children.push(createWordHeader("Conferences Organised"));
            if (organizedConferences.length > 0) {
                organizedConferences.forEach((item, i) => {
                    const cleanTitle = item.title ? item.title.replace(/^"/, '').replace(/"$/, '') : "";
                    let text = `${cleanTitle}`;
                    if (item.description) text += ` of ${item.description}`;
                    if (item.location) text += `, ${item.location}`;
                    const formatDate = (d) => {
                        if (!d) return "";
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
                    text += ` ${dateStr}.`;

                    children.push(new Paragraph({
                        children: [
                            new TextRun({ text: `${i + 1}. `, font: "Times New Roman", size: 22 }),
                            new TextRun({ text: text, font: "Times New Roman", size: 22 })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 50 }
                    }));
                });
            }
            children.push(...createWordBodyText(config.workshopsConferences));
        }

        // 16. Workshops Org
        if (config.showWorkshopsOrganised !== false) {
            children.push(createWordHeader("Workshops Organised"));
            if (organizedWorkshops.length > 0) {
                organizedWorkshops.forEach((item, i) => {
                    const cleanTitle = item.title ? item.title.replace(/^"/, '').replace(/"$/, '') : "";
                    let text = `${cleanTitle}`;
                    if (item.description) text += ` of ${item.description}`;
                    if (item.location) text += `, ${item.location}`;
                    const formatDate = (d) => {
                        if (!d) return "";
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
                    text += ` ${dateStr}.`;

                    children.push(new Paragraph({
                        children: [
                            new TextRun({ text: `${i + 1}. `, font: "Times New Roman", size: 22 }),
                            new TextRun({ text: text, font: "Times New Roman", size: 22 })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 50 }
                    }));
                });
            }
            children.push(...createWordBodyText(config.continuingEducation));
        }

        // 17. Collaborations
        if (config.showCollaborations !== false) {
            children.push(createWordHeader("International Collaborations"));
            children.push(...createWordBodyText(config.collaborations));
        }

        // 18. Outreach
        if (config.showOutreach !== false) {
            children.push(createWordHeader("Major Outreach"));

            const outreachGroups = [];
            if (outreach.length > 0) {
                const groups = {};
                outreach.forEach(item => {
                    let r = item.role || "Other Contributions";
                    if (r.toLowerCase().includes('government')) r = "Government Advisory Roles";
                    else if (r.toLowerCase().includes('national') && !r.toLowerCase().includes('international')) r = "Government Advisory Roles";
                    else if (r.toLowerCase().includes('international') || r.toLowerCase().includes('contributions')) r = "Contributions";

                    if (!groups[r]) groups[r] = [];
                    groups[r].push(item);
                });
                Object.keys(groups).sort().forEach(role => {
                    outreachGroups.push({ title: role, items: groups[role] });
                });
            }

            outreachGroups.forEach(group => {
                if (group.items.length > 0) {
                    children.push(new Paragraph({
                        text: group.title,
                        run: { font: "Times New Roman", size: 22, italics: true },
                        spacing: { before: 100, after: 50 }
                    }));
                    group.items.forEach((o, i) => {
                        let text = `${o.title}`;
                        if (o.description) text += ` - ${o.description}`;
                        children.push(new Paragraph({
                            children: [
                                new TextRun({ text: `${i + 1}. `, font: "Times New Roman", size: 22 }),
                                new TextRun({ text: text, font: "Times New Roman", size: 22 })
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 50 }
                        }));
                    });
                }
            });
        }

        // Create Document
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1440, // 1 inch = 1440 twips
                            right: 1440,
                            bottom: 1440,
                            left: 1440
                        }
                    }
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES],
                                        font: "Times New Roman",
                                        size: 20 // 10pt
                                    })
                                ]
                            })
                        ]
                    })
                },
                children: children
            }]
        });

        const outputPath = path.join(__dirname, "cv.docx");
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(outputPath, buffer);
        console.log(`Word CV generated successfully at ${outputPath}`);
        return outputPath;

    } catch (error) {
        console.error("Error generating Word CV:", error);
        throw error;
    }
}

module.exports = { generateCV, generateWordCV };
