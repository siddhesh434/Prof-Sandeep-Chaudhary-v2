// insert-Dissertations.js - Script to insert research Dissertation data into MongoDB

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const DissertationSchema = new mongoose.Schema({
  name: String,
  title: String,
  year: String,
  coSupervisors: String,
  degree: String,
});

const Dissertation = mongoose.model("Dissertation", DissertationSchema);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Dissertation data extracted from document
const DissertationData =[
    {
     name: "Sanchit Gupta",
     title: "Optimization of Sustainable Construction Materials for Industrial Applications",
     year: 2024,
     coSupervisors: "-",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Pooja Jain",
     title: "Utilization of fine micron size waste of vitrified porcelain stoneware tiles for sustainable and durable concrete",
     year: 2023,
     coSupervisors: "Dr. Rajesh Gupta",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Akshay Thakare",
     title: "Performance assessment of rubberised self-compacting concrete",
     year: 2022,
     coSupervisors: "-",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Sumit Choudhary",
     title: "Strength, durability, ductility and microstructure investigation of functionally graded concrete containing rubber fiber as replacement of fine aggregate",
     year: 2022,
     coSupervisors: "Dr. Rajesh Gupta",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Vivek Gutpa",
     title: "Industrial scale waste utilisation in unfired bricks",
     year: 2021,
     coSupervisors: "-",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Abhishek Jain",
     title: "Sustainable production of self-compacting concrete utilizing fly ash and granite waste",
     year: 2021,
     coSupervisors: "Dr. Rajesh Gupta",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Ankit Bhardwaj",
     title: "Investigations into behaviour of adhesive bonded steel-concrete composite flexural members",
     year: 2020,
     coSupervisors: "Prof. V. Matasagar; Prof. A. K. Nagpal",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Salman Siddique",
     title: "Utilisation of bone china ceramic waste as fine aggregate in sustainable concrete",
     year: 2018,
     coSupervisors: "Dr. S. Shrivastava",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Pankaj Kumar",
     title: "Performance evaluation of mechanically connected and adhesive bonded steel-concrete composite connections",
     year: 2018,
     coSupervisors: "Dr. Amar Kumar Patnaik",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Salmabanu Luhar",
     title: "Performance evaluation of rubberised geopolymer concrete and flyash based geopolymer mortar",
     year: 2017,
     coSupervisors: "-",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "M. P. Ramnavas",
     title: "Development of computational techniques for service load analysis of steel-concrete composite structures",
     year: 2016,
     coSupervisors: "Prof. A. K. Nagpal",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Trilok Gupta",
     title: "Strength, durability, ductility and fire performance of concrete containing waste rubber tyre ash and rubber fibers as partial replacement of fine aggregates",
     year: 2016,
     coSupervisors: "Prof. R. K. Sharma",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Kashyap A. Patel",
     title: "Development of computationally efficient techniques for instantaneous and time-dependent analysis of reinforced concrete beams and frames at service load",
     year: 2016,
     coSupervisors: "Prof. A. K. Nagpal",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "S.A.A. Naqvi",
     title: "Experimental and numerical studies for the behaviour of interlocking block masonry",
     year: 2013,
     coSupervisors: "-",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Bhavna Tripathi",
     title: "Durability of concrete containing ISF slag as partial replacement of sand",
     year: 2012,
     coSupervisors: "-",
     degree: "PhD Thesis Awarded"
    },
    {
     name: "Akash Paradkar",
     title: "Naturally colored composites and their application as building products",
     year: "-",
     coSupervisors: "-",
     degree: "PhD Thesis in progress"
    },
    {
     name: "Habtamu Melesse",
     title: "Investigating Structural performance of Innovative Engineered Bamboo-Timber Composite TRAIL BRIDGES for Prosperity to Rural Ethiopia",
     year: "-",
     coSupervisors: "Prof. Krishnaraj Ramaswamy",
     degree: "PhD Thesis in progress"
    },
    {
     name: "Gaurav Sharma",
     title: "Development of sustainable construction materials through recycling of solar wastes",
     year: "-",
     coSupervisors: "-",
     degree: "PhD Thesis in progress"
    },
    {
     name: "Kameshwar Nim",
     title: "Service life estimation of concrete under corrosion",
     year: "-",
     coSupervisors: "-",
     degree: "PhD Thesis in progress"
    },
    {
     name: "Astha Sharma",
     title: "Comprehensive rheology based thixotropic fluid flow model for cement-based composites",
     year: "-",
     coSupervisors: "-",
     degree: "PhD Thesis in progress"
    },
    {
     name: "Noman",
     title: "To be declared",
     year: "Ongoing",
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Krishna",
     title: "To be declared",
     year: "Ongoing",
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Manish",
     title: "To be declared",
     year: "Ongoing",
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Chetan Shakti Pandey",
     title: "Raman Spectroscopic Study of Building Construction Materials",
     year: 2022,
     coSupervisors: "Dr. Rajesh Kumar",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Eli Pradeep",
     title: "Finite element simulations of Nanoindentation on FCC single crystals",
     year: 2022,
     coSupervisors: "Dr. Indrasen Singh",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Bagle Sushil Sukalal",
     title: "Structural health monitoring of Railway Bridge",
     year: 2022,
     coSupervisors: "Dr. Pavan Kumar Kankar",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Anurag Singh Chauhan",
     title: "Assessment of Corrosion Behaviour of Stainless Steel Reinforced Bar in Concrete",
     year: 2021,
     coSupervisors: "Dr. Vinod Kumar",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Rijuta Gupta",
     title: "Feasibility of use of silt from storm water drain as partial replacement of fine aggregate in concrete",
     year: 2017,
     coSupervisors: "Prof. A. B. Gupta",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Inderjeet Singh Choudhary",
     title: "Feasibility of use of sludge from settling tank of bisalpur water treatment plant as partial replacement of fine aggregate in concrete",
     year: 2017,
     coSupervisors: "Prof. A. B. Gupta",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Ram Swaroop Mandolia",
     title: "Effect of different hydrophobic treatments on properties of recycled aggregate concrete",
     year: 2017,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Ashutosh Gupta",
     title: "Numerical analysis of steel-concrete composite girder under cyclic loading",
     year: 2017,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Suman Choudhary",
     title: "Strength and durability studies of alkali-activated fly ash based geopolymer mortar",
     year: 2016,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Rahul Karwasra",
     title: "Effect of position of singly reinforcement layer in steel-concrete composite section",
     year: 2016,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Jayesh Kr. Teli",
     title: "Effect of position of double reinforcement layer on composite sections",
     year: 2016,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Sunil Kr. Pradhan",
     title: "Flood risk assessment using MATLAB fuzzy logic model",
     year: 2015,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Pradeep Kumar",
     title: "Effect of concrete strength on behaviour of mechanical connection in steel concrete composite",
     year: 2015,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Nawal Kr. Dwivedi",
     title: "Effect of reinforcement detailing on shear connection in steel-concrete composite structures",
     year: 2015,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Minhaj Majeed",
     title: "Cost optimisation of flexibly connected composite beams",
     year: 2014,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Ashish Garg",
     title: "Study on behaviour of recycled coarse concrete aggregates in addition with cast iron\/mild steel powder in concrete",
     year: 2013,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Pankaj Kumar",
     title: "Experimental investigations for shear bond strength of steel and concrete bonded by epoxy",
     year: 2013,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Rupesh Ramesh Gawas",
     title: "Optimisation of simply supported composite beams using genetic algorithm technique",
     year: 2013,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Bhawnesh Kuldeep",
     title: "Effect of skewness on three span reinforced concrete t girder bridges",
     year: 2013,
     coSupervisors: "Prof. R. Nagar",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Vimal Kumar",
     title: "Finite element analysis of traditional and interlocking masonry",
     year: 2012,
     coSupervisors: "Prof. R. Nagar",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Durgesh Nandini Bairwa",
     title: "Comparative study of space structural forms under gravity and lateral loads",
     year: 2012,
     coSupervisors: "Prof. R. Nagar",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Gaurav Saraswat",
     title: "Prediction of ultimate shear strength of reinforced concrete beams using artificial neural networks",
     year: 2010,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Indra P. Choudhary",
     title: "3-d finite element study of bonded and mechanically connected steel-concrete composite beams by 3-dimensional finite element modelling",
     year: 2010,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Suchindra Silayach",
     title: "Behaviour of graphite\/epoxy laminates subjected to low velocity transverse impact",
     year: 2009,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Kashyap Patel",
     title: "Nonlinear behaviour of steel-concrete composite frames",
     year: 2009,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Addisu Shewarega",
     title: "Development of hybrid analytical numerical procedure for service load analysis of composite frames and beams using step-by-step method for modeling of time dependent effects of creep and shrinkage phenomena",
     year: 2009,
     coSupervisors: "Prof. A. K. Nagpal",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Ashish Yadav",
     title: "Development of neural networks for prediction of deflection of composite frame considering non-linearities-flexibility of shear connection, cracking of concrete and yielding of steel",
     year: 2009,
     coSupervisors: "Prof. A. K. Nagpal",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Kasi Viswanath",
     title: "Development of neural networks for prediction of deflection of composite bridges considering non-linearities-flexibility of shear connection, cracking of concrete and yielding of steel",
     year: 2009,
     coSupervisors: "Prof. A. K. Nagpal",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Sunil Kumar",
     title: "Behaviour of tall composite building frames considering cracking of concrete, creep and shrinkage subjected to service load",
     year: 2009,
     coSupervisors: "Prof. A. K. Nagpal",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Lalit Kr. Varshney",
     title: "Control of cracking, creep and shrinkage effects in steel concrete composite frames",
     year: 2009,
     coSupervisors: "Prof. A. K. Nagpal",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Amit Kr. Garg",
     title: "Behaviour of steel concrete composite frames",
     year: 2008,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Deepak Gaur",
     title: "Computer aided design of footings",
     year: 2005,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Neeraj Gupta",
     title: "Castellated beam- analysis and design",
     year: 2005,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Pawan Singhania",
     title: "Reinforced block masonry",
     year: 2005,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Kapil Sarawagi",
     title: "Cost comparison of multistoreyed buildings in earthquake zones",
     year: 2005,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Pramiti Tiwari",
     title: "Computer aided design of composite tee beam bridge",
     year: 2001,
     coSupervisors: "Dr. M. K. Shrimali",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Rajesh Poonia",
     title: "Study of various methods of concrete mix design",
     year: 2001,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Sudhir Verma",
     title: "Study of soil classification systems",
     year: 2001,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    },
    {
     name: "Ajay Saxena",
     title: "Risk and safety margins in structural design",
     year: 2000,
     coSupervisors: "-",
     degree: "MTech and MSc Awarded\/Ongoing"
    }
   ];

// Insert data function
const insertDissertations = async () => {
  try {
    // Delete existing data (optional)
    await Dissertation.deleteMany({});
    console.log("Deleted existing Dissertations");

    // Insert new data
    const result = await Dissertation.insertMany(DissertationData);
    console.log(`${result.length} Dissertations inserted successfully`);

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting Dissertations:", error);
  }
}

// Run the function
insertDissertations();