// insert-projects.js - Script to insert research project data into MongoDB

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ProjectSchema = new mongoose.Schema({
  title: String,
  year: String,
  funded: String,
  collaborator: String,
  projectType: String,
  role: String
});

const Project = mongoose.model("Project", ProjectSchema);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Project data extracted from document
const ProjectData = [
  // SPONSORED RESEARCH PROJECTS AS PRINCIPAL INVESTIGATOR
  {
    title: "Inspiring the researchers of tomorrow in sustainable concrete construction",
    year: "2024-2025",
    funded: "SPARC and UKIERI",
    collaborator: "University of Plymouth, UK and NIT Warangal, India",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  {
    title: "Technology Dissemination of Compressed Colored Composite for a wide range of products to support sustainable rural infrastructure",
    year: "2023-2025",
    funded: "DST, GoI",
    collaborator: "TIET Patiala, India",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  {
    title: "Carbon-neutral technologies for recycling large-tonnage waste from fuel energy with the production of functional geopolymer materials",
    year: "2022-2024",
    funded: "Government of the Russian Federation",
    collaborator: "Platov South-Russian State Polytechnic University (NPI), Russia",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  {
    title: "A comprehensive rheology based thixotropic fluid flow model for improved control on 3D printing of concrete",
    year: "2021-2024",
    funded: "SERB, DST, GOI",
    collaborator: "",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  {
    title: "Safeguarding heritage structures using seismic metamaterials",
    year: "2019-2021",
    funded: "SPARC, MHRD",
    collaborator: "UNIVERSITÉ AIX-MARSEILLE, France and IMPERIAL COLLEGE LONDON, UK",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  {
    title: "Natural-coloured functionally graded rubberised geopolymer system: A cement-less solution for optimised concrete paver manufacturing",
    year: "2018-2020",
    funded: "DST, GOI",
    collaborator: "University of Edinburgh, UK",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  {
    title: "Sustainable and economical functionally graded rubberized concrete pavements",
    year: "2017-2021",
    funded: "DST, GOI",
    collaborator: "University of Carthage, Tunisia",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  {
    title: "Waste utilisation in concrete as aggregate: Asian perspective",
    year: "2016-2019",
    funded: "Asian Concrete Federation",
    collaborator: "Researchers from China, Hong Kong and Thailand",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  {
    title: "Utilization of plastic waste in concrete: Feasibility studies",
    year: "2016-2019",
    funded: "DST, GOI",
    collaborator: "MNIT Jaipur",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  {
    title: "Experimental and analytical studies for the short term and long term behavior of epoxy bonded steel-concrete composite bridges",
    year: "2012-2015",
    funded: "DST, GOI",
    collaborator: "",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  {
    title: "Development of a highly efficient procedure and GUI equipped software for the service load analysis of composite structures",
    year: "2008-2011",
    funded: "DST, GOI",
    collaborator: "",
    projectType: "Sponsored Research Project",
    role: "As Principal Investigator"
  },
  
  // SPONSORED RESEARCH PROJECTS AS CO-PRINCIPAL INVESTIGATOR
  {
    title: "Waste characterization and possible gainful utilization of induction melting furnace dust",
    year: "2021-2022",
    funded: "Jaideep Ispat & Alloys Pvt. Ltd., Moira Sariya, India",
    collaborator: "",
    projectType: "Sponsored Research Project",
    role: "As Co-Principal Investigator"
  },
  {
    title: "Utilization of Bamboo Strip as reinforcement in concrete",
    year: "2019-2020",
    funded: "TEQIP, MHRD",
    collaborator: "",
    projectType: "Sponsored Research Project",
    role: "As Co-Principal Investigator"
  },
  
  // SPONSORED RESEARCH PROJECTS AS SCIENTIST MENTOR
  {
    title: "GOBAiR - a novel cow dung based foaming agent for developing sustainable light weight construction materials",
    year: "2023-2024",
    funded: "IIT Indore",
    collaborator: "TRF: Dr. Sanchit Gupta",
    projectType: "Sponsored Research Project",
    role: "As Scientist Mentor"
  },
  {
    title: "Innovative and sustainable fibre-reinforced recycled aggregate concretes for structural applications",
    year: "2023-2024",
    funded: "INSA, DST, GOI",
    collaborator: "ISRF: Dr. Thanongsak Imjai",
    projectType: "Sponsored Research Project",
    role: "As Scientist Mentor"
  },
  {
    title: "Sustainable solution for limestone shortage in cement manufacturing through Ca-rich bio ash",
    year: "2022-2024",
    funded: "DST, GOI",
    collaborator: "NPDF: Dr. Ashita Singh",
    projectType: "Sponsored Research Project",
    role: "As Scientist Mentor"
  },
  {
    title: "Durability of concrete containing zinc slag as partial replacement of sand",
    year: "2010-2013",
    funded: "DST, GOI",
    collaborator: "",
    projectType: "Sponsored Research Project",
    role: "As Scientist Mentor"
  },
  {
    title: "Durability studies on geopolymer concrete containing waste rubber fibre as partial replacement of sand",
    year: "2015-2017",
    funded: "DST, GOI",
    collaborator: "",
    projectType: "Sponsored Research Project",
    role: "As Scientist Mentor"
  },
  
  // SPONSORED RESEARCH PROJECTS AS GUIDE
  {
    title: "PARVAT (Prevention of accidents in hilly routes by virtue of automated technology)",
    year: "2023-2024",
    funded: "DRISHTI-CPS, IIT Indore",
    collaborator: "Student PI: Himanshu Khati, Benjamin Basumatary",
    projectType: "Sponsored Research Project",
    role: "As a Guide"
  },
  {
    title: "PA cyber physical system for low energy HVAC solutions based on natural thermal cycles and adaptive thermal comfort for smart cities",
    year: "2022-2023",
    funded: "DRISHTI-CPS, IIT Indore",
    collaborator: "Student PI: Sumer Thakur",
    projectType: "Sponsored Research Project",
    role: "As a Guide"
  },
  {
    title: "Real time quality control tool for fresh state concrete using a hydrostatic digital twin model",
    year: "2022-2023",
    funded: "DRISHTI-CPS, IIT Indore",
    collaborator: "Student PI: Parth Dwivedi",
    projectType: "Sponsored Research Project",
    role: "As a Guide"
  },
  {
    title: "A digital twin based real time traffic regulation system for risk management and failure prevention in bridges",
    year: "2022-2023",
    funded: "DRISHTI-CPS, IIT Indore",
    collaborator: "Student PI: Ayush",
    projectType: "Sponsored Research Project",
    role: "As a Guide"
  },
  {
    title: "Experimental investigations of bond characteristics of steel-concrete composite interface connected by adhesive bonding",
    year: "2015-2016",
    funded: "Institution of Engineers (India)",
    collaborator: "Student PI: Pankaj Kumar",
    projectType: "Sponsored Research Project",
    role: "As a Guide"
  },
  {
    title: "Performance evaluation of interlocking brick/block masonry",
    year: "2007-2008",
    funded: "Institution of Engineers (India)",
    collaborator: "Student PI: Ahmed Naqvi",
    projectType: "Sponsored Research Project",
    role: "As a Guide"
  },
  
  // INSTITUTE LEVEL PROJECT
  {
    title: "Knowledge incubation for technical education under Technical Education Quality Improvement Program of MHRD",
    year: "",
    funded: "MHRD",
    collaborator: "",
    projectType: "Institute Level Project",
    role: ""
  },
  
  // CONSULTANCY PROJECTS - Major ones only
  {
    title: "Investigation of cracks in concrete PSC Girder on Bridge no 10 in RAU to TIHI new Broad Gauge line section",
    year: "2019",
    funded: "Western Railway",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  },
  {
    title: "Investigations for structural safety of Mughal Museum being made by Precast Technique and subsequent technical suggestions",
    year: "2018-2019",
    funded: "U.P Rajkiya Nirman Nigam Ltd.",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  },
  {
    title: "Third Party Quality Assurance for Infrastructure of New Campus of IIM Udaipur",
    year: "2018",
    funded: "CPWD",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  },
  {
    title: "Vetting of Design and Drawing of 90 meter Arch, 252 meter suspension bridge & 90 meter truss bridge at Rajim, Raipur (C.G.)",
    year: "2017",
    funded: "AQUATIC Pump Industries, Indore (India)",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  },
  {
    title: "Proof checking of structural design and drawing of bridge at Gambhiri river and ROB at Hindaun Bypass",
    year: "2014-2016",
    funded: "RSRDC Ltd., Jaipur",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  },
  {
    title: "Proof Checking of Structural Design/Drawings for C/o 500 Bedded Boys Hostel and 210 Bedded Girls Hostel with provision for future vertical extension on III floor",
    year: "2014-2015",
    funded: "CPWD, Jaipur",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  },
  {
    title: "Proof Checking of Structural Design of Multistoried residential apartment located at Sun-City, Jaipur-Bikaner Highway, Jaipur",
    year: "2014",
    funded: "Apeksha Infrastructures Pvt. Ltd., Jaipur",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  },
  {
    title: "Proof checking of structural design and drawing of three ROB's at Makrana, Kishangarh and Ajmer in Rajasthan",
    year: "2012-2013",
    funded: "Multimedia Consultants Pvt. Ltd., Ahmadabad, India",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  },
  {
    title: "Technical evaluation/quality assessment of PQC mix for cement content",
    year: "2012-2013",
    funded: "Airport Authority of India, Jaipur",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  },
  {
    title: "Proof checking design of substructure of seventeen major railway bridges in the Swarupganj-Abu Road section of Ajmer division of north western railway",
    year: "2011-2012",
    funded: "Rail Vikas Nigam Limited",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  },
  {
    title: "Proof Checking of Various designs and drawings of Rajasthan Rural Water Supply and Mitigation Project",
    year: "",
    funded: "Larsen & Toubro Limited. Ltd., Chennai",
    collaborator: "",
    projectType: "Consultancy Project",
    role: "As Principal Investigator"
  }
];

// Insert data function
const insertProjects = async () => {
  try {
    // Delete existing data (optional)
    await Project.deleteMany({});
    console.log("Deleted existing projects");

    // Insert new data
    const result = await Project.insertMany(ProjectData);
    console.log(`${result.length} projects inserted successfully`);

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting projects:", error);
  }
};

// Run the function
insertProjects();