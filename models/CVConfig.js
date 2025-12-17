const mongoose = require('mongoose');

const CVConfigSchema = new mongoose.Schema({
  // 1. Personal Info
  personalInfo: {
    name: { type: String, default: "Prof. Sandeep Chaudhary" },
    designation: { type: String, default: "Professor, Department of Civil Engineering" },
    address: { type: String, default: "Indian Institute of Technology Indore, Simrol, Indore-453552, India" },
    email: { type: String, default: "schaudhary@iiti.ac.in" },
    mobile: { type: String, default: "+91-9549654195" },
    phone: { type: String, default: "" }
  },
  
  // 2. Qualifications (stored as newline separated text for simplicity in editing)
  qualifications: { 
    type: String, 
    default: "Ph.D. - Indian Institute of Technology Delhi (2006) - Structural Engineering\nM.Tech. - Indian Institute of Technology Delhi (2001) - Structural Engineering\nB.E. - MBM Engineering College, Jodhpur (2000) - Civil Engineering" 
  },
  showQualifications: { type: Boolean, default: true },
  
  // 3. Work Experience
  experience: { 
    type: [String], 
    default: ["Professor, IIT Indore (Dec 2018 - Present)", "Associate Professor, MNIT Jaipur (2012 - 2018)", "Assistant Professor, MNIT Jaipur (2007 - 2012)", "Lecturer, MNIT Jaipur (2006 - 2007)"] 
  },
  showExperience: { type: Boolean, default: true },
  
  // 4. Specialization
  specialization: { type: [String], default: [] },
  showSpecialization: { type: Boolean, default: true },

  // 5. Research Credentials Show Flag
  showResearchCredentials: { type: Boolean, default: true },
  
  // 6. Courses Taught
  coursesTaught: { type: String, default: "" },
  showCoursesTaught: { type: Boolean, default: true },
  
  // 7. Awards
  awards: { type: [String], default: [] },
  showAwards: { type: Boolean, default: true },
  
  // 8, 9, 10 Main Show Flags
  showProjects: { type: Boolean, default: true },
  showPatents: { type: Boolean, default: true },
  showPublications: { type: Boolean, default: true },
  
  // 11. Translational Contributions
  translational: { type: String, default: "" },
  showTranslational: { type: Boolean, default: true },
  translationalCustom: [{ title: String, description: String }],
  
  // 12. Professional Affiliations
  affiliations: { type: [String], default: [] },
  showAffiliations: { type: Boolean, default: true },
  
  // 13. Administrative Positions
  adminPositions: { 
    type: [String], 
    default: ["Dean (Alumni & Corporate Relations), IIT Indore", "Head, Department of Civil Engineering, IIT Indore", "Dean (Student Welfare), IIT Indore (Past)"] 
  },
  showAdminPositions: { type: Boolean, default: true },
  
  // 14. Facilities Established
  facilities: { type: [String], default: [] },
  showFacilities: { type: Boolean, default: true },
  
  // 15. Workshops, conferences
  workshopsConferences: { type: String, default: "" },
  showConferencesOrganised: { type: Boolean, default: true },

  // 16. Continuing Education Programs
  continuingEducation: { type: String, default: "" },
  showWorkshopsOrganised: { type: Boolean, default: true },

  // 17. International Collaborations
  collaborations: { type: [String], default: [] },
  showCollaborations: { type: Boolean, default: true },

  // 18. Outreach
  showOutreach: { type: Boolean, default: true },

  // Research Credentials Overrides
  researchCredentials: {
      techTransfer: { type: String, default: "" },
      patents: { type: String, default: "" },
      journals: { type: String, default: "" },
      conferences: { type: String, default: "" },
      books: { type: String, default: "" },
      technicalReports: { type: String, default: "" },
      chapters: { type: String, default: "" },
      phdSupervision: { type: String, default: "" },
      mtechSupervision: { type: String, default: "" },
      sponsoredProjects: { type: String, default: "" },
      projectRoles: { type: String, default: "" }
  },

  // Selected IDs for Dynamic Sections
  // We store array of strings (ObjectIds)
  selectedProjects: [String],
  selectedPatents: [String],
  selectedBooks: [String],
  selectedJournals: [String],
  selectedChapters: [String],
  selectedConferences: [String], // Proceedings
  selectedDissertations: [String],
  selectedOutreach: [String], // Extension Activity
  selectedOrganizedConferences: [String],
  selectedWorkshops: [String], // For Continuing Education

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CVConfig', CVConfigSchema);
