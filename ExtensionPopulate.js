const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Extension Activity schema with serial number
const ExtensionActivitySchema = new mongoose.Schema({
  serialNumber: Number,  // Add serialNumber field
  role: String,
  title: String,
  description: String,
  location: String,
});

const ExtensionActivity = mongoose.model("ExtensionActivity", ExtensionActivitySchema);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

const extensionActivityData = [
  // Government Advisory Roles
  {
    role: "Government Advisory Roles",
    title: "Convener",
    description: "Panel for Preparing Roadmap, SSD 06/P1, Bureau of Indian Standards, New Delhi",
    location: "Bureau of Indian Standards, New Delhi"
  },
  {
    role: "Government Advisory Roles",
    title: "Member",
    description: "Construction and Related Engineering Services Sectional Committee of Bureau of Indian Standards, New Delhi",
    location: "Bureau of Indian Standards, New Delhi"
  },
  {
    role: "Government Advisory Roles",
    title: "Member",
    description: "Working Group (WG02) for revision of IS 1542: 1992 Sand for Plaster – Specification",
    location: "Bureau of Indian Standards, New Delhi"
  },
  {
    role: "Government Advisory Roles",
    title: "Member",
    description: "Pre Construction Services Sub Committee SSD 06: 01",
    location: "Bureau of Indian Standards, New Delhi"
  },
  {
    role: "Government Advisory Roles",
    title: "AICTE Representative",
    description: "All India Council for Technical Education",
    location: "India"
  },
  {
    role: "Government Advisory Roles",
    title: "Member",
    description: "Expert Committee of All India Council for Technical Education",
    location: "All India Council for Technical Education"
  },
  {
    role: "Government Advisory Roles",
    title: "Expert",
    description: "Selection Boards of Public Service Commission of different states of India",
    location: "India"
  },

  // International Contributions
  {
    role: "International Contributions",
    title: "Secretary",
    description: "Technical Committee on \"Life Cycle Maintenance of Concrete Infrastructures (TC-LCM)\" of Asian Concrete Federation",
    location: ""
  },
  {
    role: "International Contributions",
    title: "Associate Editor",
    description: "\"Cleaner Materials\", Elsevier",
    location: ""
  },
  {
    role: "International Contributions",
    title: "International Steering Committee Member",
    description: "The 10th Asia-Pacific Young Researcher Graduate Symposium 2019",
    location: "Curtin University, Perth, Australia (December 06-08, 2023)"
  },
  {
    role: "International Contributions",
    title: "Chairman",
    description: "Expert Advice Group of Scientific School \"Green Future\" for young scientists",
    location: "Laboratory on Recycling Fuel Waste Energy, NPI, Russia (May 28-June 06, 2023)"
  },
  {
    role: "International Contributions",
    title: "International Steering Committee Member",
    description: "The 9th Asia-Pacific Young Researcher Graduate Symposium 2019",
    location: "Tongji University, Shanghai, China (December 19-20, 2019)"
  },
  {
    role: "International Contributions",
    title: "Scientific Committee Member",
    description: "3rd ACF Symposium on Assessment and Intervention of Existing Structures",
    location: "Hokkaido University, Sapporo, Japan (September 10-11, 2019)"
  },
  {
    role: "International Contributions",
    title: "International Steering Committee Member",
    description: "The 8th Asia-Pacific Young Researcher Graduate Symposium 2017",
    location: "University of Tokyo, Japan (September 07-08, 2017)"
  },
  {
    role: "International Contributions",
    title: "Chair",
    description: "Technical Committee 1: Design of the Asian Concrete Federation",
    location: "Since October 2016"
  },
  {
    role: "International Contributions",
    title: "Session Chair",
    description: "7th International Conference of Asian Concrete Federation on Sustainable Concrete",
    location: "Hanoi, Vietnam (October 30-November 02, 2016)"
  },
  {
    role: "International Contributions",
    title: "Session Chair",
    description: "The 7th Asia-Pacific Young Researcher Graduate Symposium 2015",
    location: "University of Malaya, Malaysia (August 20-21, 2015)"
  },
  {
    role: "International Contributions",
    title: "International Steering Committee Member",
    description: "The 7th Asia-Pacific Young Researcher Graduate Symposium 2015",
    location: "University of Malaya, Malaysia (August 20-21, 2015)"
  },
  {
    role: "International Contributions",
    title: "Session Chair",
    description: "The 6th Asia-Pacific Young Researcher Graduate Symposium 2014",
    location: "SIIT, Thammasat University Thailand (July 31-August 01, 2014)"
  },
  {
    role: "International Contributions",
    title: "International Steering Committee Member",
    description: "The 6th Asia-Pacific Young Researcher Graduate Symposium 2014",
    location: "SIIT, Thammasat University Thailand (July 31-August 01, 2014)"
  },
  {
    role: "International Contributions",
    title: "International Scientific Committee Member",
    description: "10th International Symposium on Innovation & Utilization of High-Performance Concrete",
    location: "Beijing, China (September 16-18, 2014)"
  },
  {
    role: "International Contributions",
    title: "Chair",
    description: "The 5th Asia-Pacific Young Researcher Graduate Symposium 2013",
    location: "Malaviya National Institute of Technology Jaipur (October 15-16, 2013)"
  },
  {
    role: "International Contributions",
    title: "Co-Chairman",
    description: "Mini Symposium on Durability and Life Cycle Maintenance of Structure",
    location: "First International Conference on Performance-based and Life-Cycle Structural Engineering (PLSE 2012), Hong Kong, China (December 05-07, 2012)"
  },
  {
    role: "International Contributions",
    title: "International Steering Committee Member",
    description: "The 4th Asia-Pacific Young Researcher Graduate Symposium 2012",
    location: "The Hong Kong Polytechnic University (December 4-5, 2012)"
  },
  {
    role: "International Contributions",
    title: "Invited Lecturer",
    description: "International Symposium on \"Structural Assessment and Remediation of Infrastructure\"",
    location: "Namseoul University, Cheonan, Choongnam-do, Korea (November 03, 2010)"
  },

  // National Contributions
  {
    role: "National Contributions",
    title: "Member",
    description: "Construction and Related Engineering Services Sectional Committee of Bureau of Indian Standards, New Delhi",
    location: "Bureau of Indian Standards, New Delhi"
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Working Group (WG02) for revision of IS 1542: 1992 Sand for Plaster – Specification",
    location: "Bureau of Indian Standards, New Delhi"
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Pre Construction Services Sub Committee SSD 06: 01",
    location: "Bureau of Indian Standards, New Delhi"
  },
  {
    role: "National Contributions",
    title: "AICTE Representative",
    description: "All India Council for Technical Education",
    location: "India"
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Expert Committee of All India Council for Technical Education",
    location: "All India Council for Technical Education"
  },
  {
    role: "National Contributions",
    title: "Expert",
    description: "Selection Boards of Public Service Commission of different states of India",
    location: "India"
  },
  {
    role: "National Contributions",
    title: "Associate Editor",
    description: "Journal of The Institution of Engineers (India): Series A, Springer",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Convener",
    description: "Panel for Preparing Roadmap, SSD 06/P1, Bureau of Indian Standards, New Delhi",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Construction and Related Engineering Services Sectional Committee of Bureau of Indian Standards, New Delhi",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Expert",
    description: "Selection Boards of Public Service Commission of different states of India",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Working Group (WG02) for revision of IS 1542: 1992 Sand for Plaster– Specification",
    location: "Bureau of Indian Standards, New Delhi"
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Pre Construction Services Sub Committee SSD 06: 01",
    location: "Bureau of Indian Standards, New Delhi"
  },
  {
    role: "National Contributions",
    title: "Coordinator",
    description: "Centralised Counselling of M.Tech. for National Institutes of Technology of India (2014)",
    location: "30 Institutes and 36,000 students participated"
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Technical Committee, Centralised Counselling of M.Tech. for National Institutes of Technology",
    location: "2015, 2016"
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Board of Directors of Executive Excellence Program of Association of Infrastructure Industry (India)",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Executive Body of \"Indian Concrete Institute- Rajasthan State Centre\"",
    location: "Two-year term 2011-2013"
  },
  {
    role: "National Contributions",
    title: "Convener",
    description: "Conference on Sustainable Habitat, Energy, Climate Change and Environment",
    location: "Under Madhya Pradesh Vigyan Sammelan & Expo (MPVS-2021) jointly organized by IIT Indore, MPCST and Vigyan Bharati (December 22-25, 2021)"
  },
  {
    role: "National Contributions",
    title: "Independent Expert Committee Member",
    description: "National Educational Alliance for Technology (NEAT) scheme of MHRD, Govt of India (2020)",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Expert Committee of UGC for assessment of fulfillment of criteria by Benett University, Greater Noida",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Preliminary Committee Member",
    description: "Evaluating proposals submitted to Shashtri Indo Canadian Institute",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Jury Member",
    description: "Evaluating consultants for the construction of AICTE Campus in Jaipur",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Academic Advisory Committee of Applied Mechanics Department, SVNIT Surat",
    location: "Surat, India (2012-2013)"
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "Committee of Courses, Civil Engineering Department, College of Technology & Engineering, MPUAT, Udaipur",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Subject Expert",
    description: "Board of Studies of the Department of Civil Engineering",
    location: "G.H. Raisoni Institute of Engineering and Management, Jalgaon"
  },
  {
    role: "National Contributions",
    title: "Expert",
    description: "Academic Audit of affiliated institutes of Gujarat Technological University",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Expert",
    description: "Faculty Selections in Thapar Institute of Engineering & Technology, Patiala",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Expert",
    description: "Curriculum Revision Workshop of M. Tech. (Structural Engineering) program of SVNIT Surat",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Member",
    description: "DRISHTI CPS Foundation, Technology Innovation Hub, Indian Institute of Technology Indore",
    location: "Core Committee member/Hub Governing Body Member/Strategic Task Force Member"
  },
  {
    role: "National Contributions",
    title: "Expert",
    description: "Curriculum Development Workshop of Civil Engineering Department of NIT Sikkim",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Expert",
    description: "Recruitment of faculty of Civil Engineering Department of NIT Sikkim",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Mentor",
    description: "Faculty and students of Dr. Babasaheb Ambedkar College of Engineering & Research, Nagpur",
    location: ""
  },
  {
    role: "National Contributions",
    title: "Technical Committee Member",
    description: "International Conference on Advances in Civil Engineering",
    location: "K L University, Andhra Pradesh, India"
  },
  {
    role: "National Contributions",
    title: "Technical Committee Member",
    description: "International Conference on Advances in Concrete, Structural and Geotechnical Engineering",
    location: "BITS Pilani, Pilani, India"
  },
  {
    role: "National Contributions",
    title: "Special Invitee",
    description: "Workshop on \"Curriculum Development for Implementing Academic Autonomy\"",
    location: "Ujjain Engineering College, Ujjain, India"
  }
];

// Insert data function
// Insert data function
const insertExtensionActivities = async () => {
  try {
    // Delete existing data (optional)
    await ExtensionActivity.deleteMany({});
    console.log("Deleted existing extension activities");

    // Add serial numbers to the data
    const extensionActivityDataWithSerialNumbers = extensionActivityData.map((activity, index) => {
      return {
        ...activity,
        serialNumber: index + 1  // Add serialNumber starting from 1
      };
    });

    // Insert new data
    const result = await ExtensionActivity.insertMany(extensionActivityDataWithSerialNumbers);
    console.log(`${result.length} extension activities inserted successfully`);

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting extension activities:", error);
  }
};

// Run the function
insertExtensionActivities();