// insert-conferences.js - Script to insert conference proceedings data into MongoDB

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

// Create Conference Proceedings Schema
const conferenceSchema = new mongoose.Schema({
  author: String,
  title: String,
  conference: String,
  date: String,
  place: String,
  year: Number, // Extracted from date for grouping purposes
});

const Conference = mongoose.model("Conference", conferenceSchema);

// Conference proceedings data
const conferenceData = [
  {
    author: "Gupta, S., Patra, S. K., and Chaudhary, S.",
    title: "Upcycling Waste Tyre Rubber as Innovative Slip and Fall Event Reducing (SAFER) Concrete Flooring",
    conference: "Proc., Recent Advances in Waste Minimization & Utilization-2024 (RAWMU 2024)",
    date: "April 23-24, 2024",
    place: "Jalandhar, India",
    year: 2024
  },
  {
    author: "Gupta, S., and Chaudhary, S.",
    title: "Understanding the significance of quality control on the life cycle of concrete structures under corrosion",
    conference: "Proc., 10th Asia-Pacific Young Researchers and Graduates Symposium (YRGS 2023)",
    date: "December 06-08, 2023",
    place: "Perth, Australia",
    year: 2023
  },
  {
    author: "Gupta, S., Lal, D.N., Sharma, A., and Chaudhary, S.",
    title: "A novel mathematical model for temporal effect of buildup and breakdown on cement rheology",
    conference: "Proc. International Conference on Applied Mathematics and Mechanics (ICAMM 2023)",
    date: "October 18-20, 2023",
    place: "Indore, India",
    year: 2023
  },
  {
    author: "Akash, R.S.K., Singh, S.K., and Chaudhary, S.",
    title: "AI-driven Urban Planning: Enhancing Infrastructure and Livability",
    conference: "Proc. International Conference on Applied Mathematics and Mechanics (ICAMM 2023)",
    date: "October 18-20, 2023",
    place: "Indore, India",
    year: 2023
  },
  {
    author: "Gupta, S., and Chaudhary, S.",
    title: "Recirculation strategy for end of life concrete structures as low carbon construction materials",
    conference: "Proc., International Symposium on Life Cycle Maintenance of Concrete Infrastructure",
    date: "September 25-26, 2023",
    place: "Hong Kong, China",
    year: 2023
  },
  {
    author: "Gupta, S, and Chaudhary, S.",
    title: "Resource sustainability and the bubble of carbon neutrality in cement manufacturing industry",
    conference: "Proc., International Conference on Resource Sustainability (icRS 2023)",
    date: "August 07-08, 2023",
    place: "Guildford, United Kingdom",
    year: 2023
  },
  {
    author: "Gupta, S, Sharma, A., Lazorenko, G., and Chaudhary, S.",
    title: "Advancing 3D printing of concrete using heat-cured geopolymer",
    conference: "Proc., Materials Science, Form-Building Technologies and Equipment 2023 (ICMSTE 2023)",
    date: "May 16-19, 2023",
    place: "Yalta, Russia",
    year: 2023
  },
  {
    author: "Patel, K.A., Shewarega, A., Chaudhary, S., and Nagpal, A. K.",
    title: "A step-by-step method for time-dependent analysis of composite beams",
    conference: "Proc., 12th Structural Engineering Convention (SEC 2022)",
    date: "December 19-22, 2022",
    place: "Jaipur, ASPS Conference Proceedings",
    year: 2022
  },
  {
    author: "Jain, P., Gupta, R., and Chaudhary, S.",
    title: "A literature review on the effect of using ceramic waste as supplementary cementitious material in cement composites on workability and compressive strength",
    conference: "Materials Today: Proceedings",
    date: "",
    place: "",
    year: 2022
  },
  {
    author: "Choudhary, S., Jain, A., Bhavsar, H., Chaudhary, S., and Choudhary, R.",
    title: "Analysis of steel fiber reinforced concrete wall panels under compression, flexural and impact loading",
    conference: "Materials Today: Proceedings",
    date: "",
    place: "",
    year: 2021
  },
  {
    author: "Choudhary, S., Chaudhary, S., Jain, A., Gupta, R.",
    title: "Assessment of effect of rubber tyre fiber on functionally graded concrete",
    conference: "Materials Today: Proceedings",
    date: "",
    place: "",
    year: 2020
  },
  {
    author: "Gupta, V., Pathak, D. K., Kumar, R., Chaudhary, S.",
    title: "Application of Raman Spectroscopy for Characterization of Natural Stone Sludge Waste",
    conference: "Materials Today: Proceedings",
    date: "",
    place: "",
    year: 2020
  },
  {
    author: "Jain, A., Choudhary, R., Gupta, R., Chaudhary, S.",
    title: "Abrasion resistance and sorptivity characteristics of SCC containing granite waste",
    conference: "Materials Today: Proceedings",
    date: "",
    place: "",
    year: 2020
  },
  {
    author: "Choudhary, S., Chaudhary, S., Jain, A., Gupta, R.",
    title: "Valorization of waste rubber tyre fiber in functionally graded concrete",
    conference: "Materials Today: Proceedings",
    date: "",
    place: "",
    year: 2020
  },
  {
    author: "Gupta, V., Siddique, S., Chaudhary, S.",
    title: "Characterization of different types of fly ash collected from various sources in Central India",
    conference: "Materials Today: Proceedings ICMPC 2019",
    date: "",
    place: "",
    year: 2019
  },
  {
    author: "Agrawal, H., Modhe, S., Gupta, S., and Chaudhary, S.",
    title: "Porosity based design - An improved design approach for pervious concrete",
    conference: "Proc., Ninth Asia-Pacific Young Researchers & Graduates Symposium",
    date: "December 19-20, 2019",
    place: "Shanghai, China",
    year: 2019
  },
  {
    author: "Gandhi, S., Gupta, S., and Chaudhary, S.",
    title: "Segregation studies on light weight aggregate concrete",
    conference: "Proc., Ninth Asia-Pacific Young Researchers & Graduates Symposium",
    date: "December 19-20, 2019",
    place: "Shanghai, China",
    year: 2019
  },
  {
    author: "Saxena, R., Siddique, S., Gupta, T., Sharma, R.K., and Chaudhary, S.",
    title: "Utilisation of PET plastic waste as fine aggregate in concrete",
    conference: "Proc., National Conference on Advances in Sustainable Construction Materials",
    date: "March 15-16, 2018",
    place: "Warangal, India",
    year: 2018
  },
  {
    author: "Gupta, T., Siddique, S., Sharma, R.K., and Chaudhary, S.",
    title: "Residual mechanical properties of rubber fiber concrete exposed to elevated temperature",
    conference: "Proc., National Conference on Advances in Sustainable Construction Materials",
    date: "March 15-16, 2018",
    place: "Warangal, India",
    year: 2018
  },
  {
    author: "Gupta, T., Chouhan, D. S., Jain, A., Sharma, R. K., Chaudhary, S., and Jain, S.",
    title: "Assessment of fresh and hardened properties of concrete containing polythene bag",
    conference: "Proc., Advances in Concrete, Structural and Geotechnical Engineering",
    date: "",
    place: "New Delhi, India",
    year: 2018
  },
  {
    author: "Kumar, P., Chaudhary, S. and Gupta, R.",
    title: "Behaviour of adhesive bonded and mechanically connected steel concrete composite under impact loading",
    conference: "Procedia Engineering",
    date: "",
    place: "",
    year: 2017
  },
  {
    author: "Banu, S., Choudhary, S., and Chaudhary, S.",
    title: "Strength and carbonation study on fly ash based geopolymer mortar",
    conference: "Proc., 7th International Conference of Asian Concrete Federation on Sustainable Concrete for now and the future",
    date: "Oct. 30-Nov. 02, 2016",
    place: "Hanoi, Vietnam",
    year: 2016
  },
  {
    author: "Banu, S., Dave, U., and Chaudhary, S.",
    title: "Effect of different type of curing on fly ash and slag based geopolymer concrete",
    conference: "Proc., International Conference on Recent Innovations in Engineering and Technology",
    date: "November 05-06, 2016",
    place: "Gunupur, India",
    year: 2016
  },
  {
    author: "Banu, S., and Chaudhary, S.",
    title: "Effect of elevated temperatures on rubberized geopolymer mortar",
    conference: "Proc., International Conference on Recent Innovations in Engineering and Technology",
    date: "November 05-06, 2016",
    place: "Gunupur, India",
    year: 2016
  },
  {
    author: "Tripathi, B., Boehme, L., Chandra, T., and Chaudhary, S.",
    title: "Research, education and training as part of an action plan to start up a recycling policy in Jaipur, India",
    conference: "Proc., Central Europe towards Sustainable Building 2016",
    date: "June 22-24, 2016",
    place: "Prague, Czech Republic",
    year: 2016
  },
  {
    author: "Banu, S., Dave, U., and Chaudhary, S.",
    title: "Effect of different parameters on the compressive strength of rubberized geopolymer concrete",
    conference: "Multi-disciplinary Sustainable Engineering: Current and Future Trends: Proc., 5th Nirma University International Conference on Engineering",
    date: "November 26-28, 2016",
    place: "Ahmedabad, India",
    year: 2016
  },
  {
    author: "Tripathi, B., Chandra, T., & Chaudhary, S.",
    title: "Durability and dimensional stability of concrete containing zinc slag as sand",
    conference: "ACI Special Publication",
    date: "",
    place: "",
    year: 2015
  },
  {
    author: "Haldia, A., Siddique, S., Shrivastava, S., and Chaudhary, S.",
    title: "A comparative study of fly ash bricks made with blend of clay brick waste and stone dust",
    conference: "Proc., Advances in Construction Technology and Management",
    date: "February 19-20, 2015",
    place: "Nagpur, India",
    year: 2015
  },
  {
    author: "Gupta, T., Chaudhary, S., and Sharma, R. K.",
    title: "Influence of waste rubber tyre particles in concrete pavement",
    conference: "Proc., Seventh Asia-Pacific Young Researchers & Graduates Symposium",
    date: "August 20-21, 2015",
    place: "Kuala Lumpur, Malaysia",
    year: 2015
  },
  {
    author: "Chaudhary, S., Pendharkar, U., Patel, K. A., and Nagpal, A. K.",
    title: "Rapid prediction of long term deflection in high rise composite frames using neural networks",
    conference: "Proc., Sixth Asia-Pacific Young Researchers & Graduates Symposium",
    date: "July 31-Aug 01, 2014",
    place: "Thailand",
    year: 2014
  },
  {
    author: "Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
    title: "An analytical-numerical procedure incorporating cracking in RC Frames at service load",
    conference: "Proc., Sixth Asia-Pacific Young Researchers & Graduates Symposium",
    date: "July 31-Aug 01, 2014",
    place: "Thailand",
    year: 2014
  },
  {
    author: "Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
    title: "An element incorporating cracking in reinforced concrete beams at service load",
    conference: "Proc., Fifth Asia-Pacific Young Researchers & Graduates Symposium",
    date: "October 15-16, 2013",
    place: "Jaipur",
    year: 2013
  },
  {
    author: "Tripathi, B. and Chaudhary, S.",
    title: "Suitability of ISF Slag as fine aggregate in concrete",
    conference: "Proc., Fifth Asia-Pacific Young Researchers & Graduates Symposium",
    date: "October 15-16, 2013",
    place: "Jaipur",
    year: 2013
  },
  {
    author: "Kumar, P. and Chaudhary, S.",
    title: "Experimental investigations for shear bond strength of steel and concrete bonded by epoxy",
    conference: "Proc., Fifth Asia-Pacific Young Researchers & Graduates Symposium",
    date: "October 15-16, 2013",
    place: "Jaipur",
    year: 2013
  },
  {
    author: "Gupta, T., Tripathi, B., Sharma, R. K., and Chaudhary, S.",
    title: "Flexural strength, compressive strength and workability of waste rubber concrete",
    conference: "Proc., Fifth Asia-Pacific Young Researchers & Graduates Symposium",
    date: "October 15-16, 2013",
    place: "Jaipur",
    year: 2013
  },
  {
    author: "Alankar, K. and Chaudhary, S.",
    title: "Cost optimization of composite beams using genetic algorithm and artificial neural network",
    conference: "Proc., 2012 International Conference on Computer Technology and Science",
    date: "August 18-19, 2012",
    place: "New Delhi",
    year: 2012
  },
  {
    author: "Tripathi, B. and Chaudhary, S.",
    title: "Experimental assessment of drying shrinkage of ISF slag concrete",
    conference: "Proc., Fourth Asia-Pacific Young Researchers & Graduates Symposium",
    date: "December 04-05, 2012",
    place: "Hong Kong",
    year: 2012
  },
  {
    author: "Gupta, R. K ., Patel, K. A., Chaudhary, S. and Nagpal, A. K.",
    title: "An efficient finite-element model for flexible composite structures",
    conference: "Proc., Fourth Asia-Pacific Young Researchers & Graduates Symposium",
    date: "December 04-05, 2012",
    place: "Hong Kong",
    year: 2012
  },
  {
    author: "Tripathi, B., and Chaudhary, S.",
    title: "Corrosion performance of high volume slag concrete at different W/C",
    conference: "Proc., Twelfth International Conference on Recent Advances in Concrete Technology and Sustainability Issues",
    date: "Oct. 30-Nov. 02, 2012",
    place: "Prague",
    year: 2012
  },
  {
    author: "Tripathi, B., Misra, A., and Chaudhary, S.",
    title: "Permeability of concrete containing pyrometallurgical slag as partial replacement of sand",
    conference: "D.H., Bager, and J., Silfwerbrand, ed., Concrete Structures for Sustainable Community",
    date: "fib Symposium Stockholm 2012, June 14-21, Stockholm, Sweden",
    place: "",
    year: 2012
  },
  {
    author: "Tripathi, B., Misra, A., and Chaudhary, S.",
    title: "Durability of concrete containing ISF slag as partial replacement of sand",
    conference: "H., Justnes, and S., Jacobsen, ed., Proc., International Congress on Durability of Concrete",
    date: "June 18-21, 2012",
    place: "Norway",
    year: 2012
  },
  {
    author: "Cho, S. G., Li, Y. Il, Kim, D., Chaudhary, S., and Yoo, J. S.",
    title: "A study on the nonlinear characteristics of electrical equipment cabinets under strong seismic motion",
    conference: "Transactions, SMiRT 21",
    date: "November 06-11, 2011",
    place: "New Delhi, India",
    year: 2011
  },
  {
    author: "Chaudhary, S., Ali, A., Kim, D., and Cho, S. G.",
    title: "Seismic analysis of steel-concrete composite walls of nuclear power plant structures",
    conference: "Transactions, SMiRT 21",
    date: "November 06-11, 2011",
    place: "New Delhi, India",
    year: 2011
  },
  {
    author: "Chaudhary, S., Ali, A. Patel, K. A., Kim, D., and Cho, S. G.",
    title: "Dynamic behaviour of steel-concrete composite shear wall",
    conference: "Proc., The 2011 World Congress on Advances in Structural Engineering and Mechanics",
    date: "September 18-22, 2011",
    place: "Seoul, Korea",
    year: 2011
  },
  {
    author: "Chaudhary, S., Patel, K. A., Kim, D., Cho, S. G., and Ali, A.",
    title: "Dynamic behaviour of steel-concrete composite floors",
    conference: "Proc., 27th Conference of Korea Institute of Structural Maintenance Inspection and Korea Infrastructure Safety Corporation (Spring 2011)",
    date: "May 20, 2011",
    place: "Seoul, Korea",
    year: 2011
  },
  {
    author: "Patel, K. A., Kim, D., Chaudhary, I. P., and Chaudhary, S.",
    title: "Service load behaviour of epoxy bonded steel-concrete composite bridges",
    conference: "Proc., Asia-Pacific Young Researchers & Graduates Symposium 2011",
    date: "March 25-26, 2011",
    place: "Taipei, Taiwan",
    year: 2011
  },
  {
    author: "Kim, D., Park, J., Chaudhary, S., and Miah, M. S.",
    title: "Spherical elastomeric bearing for noise and vibration reduction in railway bridges",
    conference: "Proc., Asia-Pacific Young Researchers & Graduates Symposium 2011",
    date: "March 25-26, 2011",
    place: "Taipei, Taiwan",
    year: 2011
  },
  {
    author: "Chaudhary, S., Kim, D., Cho, S. G., Joe, Y. H., and Patel, K. A.",
    title: "Seismic behaviour of steel-concrete composite floors in thermal power plants",
    conference: "Proc., Earthquake Engineering Society of Korea 2011",
    date: "March 18, 2011",
    place: "Seoul, Korea",
    year: 2011
  },
  {
    author: "Kumari, S., and Chaudhary, S.",
    title: "Strengthening of Steel-concrete composite beams",
    conference: "Proc. International conference on Innovative World of Structural Engineering (ICIWSE-2010)",
    date: "December 25-27, 2010",
    place: "Aurangabad, India",
    year: 2010
  },
  {
    author: "Kumari, S., Patel, K. A., and Chaudhary, S.",
    title: "Finite element study of a bonded steel and concrete composite beam",
    conference: "Proc., International Conference on Innovative World of Structural Engineering (ICIWSE-2010)",
    date: "December 25-27, 2010",
    place: "Aurangabad, India",
    year: 2010
  },
  {
    author: "Chaudhary, S., and Kumari, S.",
    title: "Effect of flexibility of shear connectors on service load behavior of steel-concrete composite structures",
    conference: "Proc., Int. Conf. Advances in Mechanical and Building Sciences in the 3rd Millenium",
    date: "December 14-16, 2009",
    place: "Vellore, India",
    year: 2009
  },
  {
    author: "Chaudhary, S., and Nagpal, A. K.",
    title: "Analysis and behaviour of composite structures at service load",
    conference: "Proc., Int. Conf. Advances in Concrete, Structural and Geotechnical Engineering",
    date: "October 25-27, 2009",
    place: "Pilani, India",
    year: 2009
  },
  {
    author: "Chaudhary, S., and Kumari, S.",
    title: "Neural network-based structural monitoring and damage detection",
    conference: "Proc., Civil Engg. Conference- Innovation without limits",
    date: "Sept. 18-19, 2009",
    place: "Hamirpur, India",
    year: 2009
  },
  {
    author: "Chaudhary, S., and Nagpal, A. K.",
    title: "Simplified technique for the design of steel concrete composite beams using artificial neural networks",
    conference: "Proc., the First International Conference on Soft Computing Technology in Civil, Structural and Environmental Engineering",
    date: "September 01-04, 2009",
    place: "Funchal, Madeira, Portugal",
    year: 2009
  },
  {
    author: "Patel, K. A., Kumari, S., and Chaudhary, S.",
    title: "Non-Linear behaviour of steel-concrete composite frames",
    conference: "Proc. Sustainable Concrete Infrastructure Development (SCID-2009)",
    date: "May 19-20, 2009",
    place: "Jaipur, India",
    year: 2009
  },
  {
    author: "Naqvi, S. A. A., Bajpai, S., and Chaudhary, S.",
    title: "Mortarless masonry system for accelerated construction",
    conference: "Proc. Recent Trends in Geotechnical and Structural Engineering (RTGSE-2007)",
    date: "December 22-23, 2007",
    place: "Jaipur, India",
    year: 2007
  },
  {
    author: "Pendharkar, U., Chaudhary, S., and Nagpal, A. K.",
    title: "Neural network model for short term inelastic moments at interior supports of continuous composite beams",
    conference: "Proc. National Seminar on Soft Computing Methodology-07",
    date: "March 19-20, 2007",
    place: "UEC Ujjain, India",
    year: 2007
  },
  {
    author: "Naqvi, S. A. A., and Chaudhary, S.",
    title: "Mortarless Masonry: An Overview",
    conference: "Proc. International Conference on Recent Developments in Structural Engineering (RDSE-2007)",
    date: "August 30-September 01, 2007",
    place: "Manipal, India",
    year: 2007
  },
  {
    author: "Chaudhary, S., Pendharkar, U., and Nagpal, A. K.",
    title: "Time-dependent behavior of continuous composite beams",
    conference: "Proc., Third Int. Conf. Steel and Composite Structures",
    date: "July 30-August 01, 2007",
    place: "Manchester, UK",
    year: 2007
  },
  {
    author: "Pendharkar, U., Chaudhary, S., and Nagpal, A. K.",
    title: "Sensitivity analysis for predicting parameters for ANN for bending moment in continuous composite beams considering concrete cracking",
    conference: "Proc., Recent Advances in Computational Mechanics and Simulation",
    date: "December 08-10, 2006",
    place: "IIT Guwahati, India",
    year: 2006
  },
  {
    author: "Bharti, S. D., and Chaudhary, S.",
    title: "Composite steel-concrete construction",
    conference: "Proc., National Seminar on Recent Trends in Civil Engineering",
    date: "Feb. 22-23, 2002",
    place: "MBM Engg. College, Jodhpur, India",
    year: 2002
  },
  {
    author: "Chaudhary, S., and Gupta, R. C.",
    title: "Effect of grouting and reinforcement on hollow block masonry",
    conference: "Proc., National Seminar on Recent Trends in Civil Engineering",
    date: "Feb. 22-23, 2002",
    place: "MBM Engg. College, Jodhpur, India",
    year: 2002
  }
];
// Insert data function
const insertConferences = async () => {
  try {
    // Delete existing data (optional)
    await Conference.deleteMany({});
    console.log("Deleted existing conference proceedings");

    // Insert new data
    const result = await Conference.insertMany(conferenceData);
    console.log(
      `${result.length} conference proceedings inserted successfully`
    );

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting conference proceedings:", error);
  }
};

// Run the function
insertConferences();
