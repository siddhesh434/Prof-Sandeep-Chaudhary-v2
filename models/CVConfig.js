const mongoose = require('mongoose');

const CVConfigSchema = new mongoose.Schema({
  // 1. Personal Info
  personalInfo: {
    name: { type: String, default: "Prof. Sandeep Chaudhary" },
    designation: { type: String, default: "Professor, Department of Civil Engineering" },
    address: { type: String, default: "Indian Institute of Technology Indore, Simrol, Indore-453552, India" },
    email: { type: String, default: "schaudhary@iiti.ac.in" },
    mobile: { type: String, default: "+91-9549654195" }
  },
  
  // 2. Qualifications (stored as newline separated text for simplicity in editing)
  qualifications: { 
    type: String, 
    default: "Ph.D. - Indian Institute of Technology Delhi (2006) - Structural Engineering\nM.Tech. - Indian Institute of Technology Delhi (2001) - Structural Engineering\nB.E. - MBM Engineering College, Jodhpur (2000) - Civil Engineering" 
  },
  
  // 3. Work Experience
  experience: { 
    type: String, 
    default: "Professor, IIT Indore (Dec 2018 - Present)\nAssociate Professor, MNIT Jaipur (2012 - 2018)\nAssistant Professor, MNIT Jaipur (2007 - 2012)\nLecturer, MNIT Jaipur (2006 - 2007)" 
  },
  
  // 4. Specialization
  specialization: { type: String, default: "" },
  
  // 6. Courses Taught
  coursesTaught: { type: String, default: "" },
  
  // 7. Awards
  awards: { type: String, default: "" },
  
  // 11. Translational Contributions
  translational: { type: String, default: "" },
  
  // 12. Professional Affiliations
  affiliations: { type: String, default: "" },
  
  // 13. Administrative Positions
  adminPositions: { 
    type: String, 
    default: "Dean (Alumni & Corporate Relations), IIT Indore\nHead, Department of Civil Engineering, IIT Indore\nDean (Student Welfare), IIT Indore (Past)" 
  },
  
  // 14. Facilities Established
  facilities: { type: String, default: "" },
  
  // 17. International Collaborations
  collaborations: { type: String, default: "" },

  // Selected IDs for Dynamic Sections
  // We store array of strings (ObjectIds)
  selectedProjects: [String],
  selectedPatents: [String],
  selectedBooks: [String],
  selectedJournals: [String],
  selectedChapters: [String],
  selectedConferences: [String], // Proceedings
  selectedDissertations: [String],
  selectedOrganizedConferences: [String], // Extension Activity
  selectedWorkshops: [String], // Extension Activity
  selectedOutreach: [String], // Extension Activity

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CVConfig', CVConfigSchema);
