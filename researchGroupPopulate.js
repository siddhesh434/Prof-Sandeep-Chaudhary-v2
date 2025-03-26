// insert-research-group.js - Script to insert research group data into MongoDB

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Create Research Scholar Schema
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

// Types of research positions
const researchTypes = [
  "Research Scholar",
  "Research Alumni",
  "Research Under-Graduates",
  "Research Under-Graduates Alumni",
  "Research Interns Alumni",
  "Research Post-Graduates Alumni",
];

// Research Group data
const researchGroupData = [

  // Research Scholars
  {
    name: "Gaurav Sharma",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic: "Sustainable bacterial cement composites using food waste",
    year: "2024 - 2027",
    type: "Research Scholar",
    photoUrl: "/images/researchScolar/Gaurav.jpg",
  },
  {
    name: "Jitendra W. Mathankar",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic: "Biowaste utilization for sustainable concrete",
    year: "2024 - 2027",
    type: "Research Scholar",
    photoUrl: "",
  },
  {
    name: "Kameshwar Singh Nim",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic: "Service life estimation of concrete under corrosion",
    year: "2023 - 2026",
    type: "Research Scholar",
    photoUrl: "/images/researchScolar/Kameshwar.jpg",
  },
  {
    name: "Habtamu Melesse",
    position: "Research Scholar (International joint PhD)",
    scholarLink: "",
    scholarTopic:
      "Investigating Structural performance of Innovative Engineered Bamboo-Timber Composite TRAIL BRIDGES for Prosperity to Rural Ethiopia",
    year: "2023 - 2026",
    type: "Research Scholar",
    photoUrl: "/images/researchScolar/habtamu.jpg",
  },
  {
    name: "Akash Paradkar",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic: "Compressed naturally colored composites",
    year: "2024 - 2026",
    type: "Research Scholar",
    photoUrl: "/images/researchScolar/Akash.jpg",
  },
  {
    name: "Harish Panghal",
    position: "Postdoctoral Research Fellow",
    scholarLink: "",
    scholarTopic: "Sustainable Construction Materials",
    year: "2024 - 2025",
    type: "Research Scholar",
    photoUrl: "/images/researchScolar/Harish.jpg",
  },
  {
    name: "Dr. Sanchit Gupta",
    position: "Translational Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Optimization of Sustainable Construction Materials for Industrial Applications",
    year: "2023 - 2024",
    type: "Research Scholar",
    photoUrl: "/images/researchScolar/Sanchit.jpg",
  },
  {
    name: "Astha Sharma",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Scholar",
    photoUrl: "/images/researchScolar/Astha.jpg",
  },
  {
    name: "Dr. Ashita Singh",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Scholar",
    photoUrl: "/images/researchScolar/Ashita.jpg",
  },
  {
    name: "Himanshu Khati",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Scholar",
    photoUrl: "/images/researchScolar/himanshu.jpg",
  },
  {
    name: "Benjamin Basumatary",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Scholar",
    photoUrl: "/images/researchScolar/benjamin.jpg",
  },

  // Research Alumni

  {
    name: "Dr. Thanongsak Imjai",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/Thanongsak-Imjai.jpg",
  },
  {
    name: "Dr. Pooja Jain",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/pooja.jpg",
  },
  {
    name: "Dr. Akshay Anil Thakre",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/akshay.jpg",
  },
  {
    name: "Dr. Choudhary Sumit Mukund",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/sumit.jpg",
  },
  {
    name: "Dr. Vivek Gutpa",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/Vivek.jpg",
  },
  {
    name: "Dr. Abhishek Jain",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/abhishek.jpg",
  },
  {
    name: "Dr. Ankit Bhardwaj",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/ankit.jpg",
  },
  {
    name: "Dr. Salman Siddique",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/salman.jpg",
  },
  {
    name: "Dr. Pankaj Kumar",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/pk.jpg",
  },
  {
    name: "Dr. M. P. Ramnavas",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/RAMNAVAS_M_P_2.jpg",
  },
  {
    name: "Dr. Trilok Gupta",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/Trilok.JPG",
  },
  {
    name: "Dr. Kashyap A. Patel",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/K_A_Patel1.jpg",
  },
  {
    name: "Dr. Bhavna Tripathi",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Alumni",
    photoUrl: "/images/researchAlumni/BT.JPG",
  },

  // Research Undergraduates

  {
    name: "Tarun Soni",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Under-Graduates",
    photoUrl: "/images/ResearchUnderGraduates/tarun.jpg",
  },

  {
    name: "Shrijita Maitra",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Under-Graduates",
    photoUrl: "/images/ResearchUnderGraduates/shrijita.jpg",
  },
  {
    name: "Anshu Ratan",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Under-Graduates",
    photoUrl: "/images/ResearchUnderGraduates/anshu.jpg",
  },
  {
    name: "Rishi Raj",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Under-Graduates",
    photoUrl: "/images/ResearchUnderGraduates/rishi.jpg",
  },
   // Research Undergraduate Alumni

  {
    name: "Parth Dwivedi",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Under-Graduates Alumni",
    photoUrl: "/images/ResearchUnderGraduatesAlumni/Parth.jpg",
  },
  {
    name: "Ayush",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Under-Graduates Alumni",
    photoUrl: "/images/ResearchUnderGraduatesAlumni/Ayush.jpg",
  },

    // Research Intern Alumni

  {
    name: "Himanshu Gupta",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Interns Alumni",
    photoUrl: "/images/ResearchInternsAlumni/himanshu1.jpg",
  },
  {
    name: "Dhruv Narayan Lal",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Interns Alumni",
    photoUrl: "/images/ResearchInternsAlumni/Dhruv.jpg",
  },
  {
    name: "Appeesu Mahendar",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Interns Alumni",
    photoUrl: "/images/ResearchInternsAlumni/Appeesu.jpg",
  },
  {
    name: "Abhishek Ojha",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Interns Alumni",
    photoUrl: "/images/ResearchInternsAlumni/Abhishekojha.jpg",
  },

  // Research Postgraduate Alumni
   
  {
    name: "Novikov Yuri Vladimirovich",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Post-Graduates Alumni",
    photoUrl: "/images/researchPostGraduatesAlumni/Vadim.JPG",
  },

  {
    name: "Tkachenko Vadim Dmitrievich",
    position: "Junior Research Fellow",
    scholarLink: "",
    scholarTopic:
      "Development of a comprehensive rheology based thixotropic fluid flow model for cement based composites",
    year: "2021 - 2024",
    type: "Research Post-Graduates Alumni",
    photoUrl: "/images/researchPostGraduatesAlumni/Yuri.JPG",
  },
  
  
];

// Function to assign random types to each research entry
const assignRandomTypes = (data) => {
  return data.map((entry) => {
    // Keep the type if already assigned, or assign a random one
    if (!entry.type) {
      const randomIndex = Math.floor(Math.random() * researchTypes.length);
      entry.type = researchTypes[randomIndex];
    }
    return entry;
  });
};

// Insert data function
const insertResearchGroup = async () => {
  try {
    // Delete existing data (optional)
    await ResearchGroup.deleteMany({});
    console.log("Deleted existing research group data");

    // Randomize types if needed
    // Uncomment the line below if you want completely random types instead of the predefined ones
    // const dataWithRandomTypes = assignRandomTypes(researchGroupData);

    // Insert new data
    const result = await ResearchGroup.insertMany(researchGroupData);
    console.log(
      `${result.length} research group entries inserted successfully`
    );

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting research group data:", error);
  }
};

// Run the function
insertResearchGroup();
