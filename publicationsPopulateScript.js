// insert-publications.js - Script to insert publication data into MongoDB

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

// Create Publication Schema
const publicationSchema = new mongoose.Schema({
  author: String,
  title: String,
  journal: String,
  year: Number,
  volumePages: String,
  publicationLink: String,
  publicationDate: String,
  impactFactor: Number,
});

const Publication = mongoose.model("Publication", publicationSchema);

// Publication data
const publicationData = [
  {
    author: "Neupane, R. P., Imjai, T., Garcia, R., Chua, Y. S., and Chaudhary, S.",
    title: "Performance of eccentrically loaded low-strength RC columns confined with posttensioned metal straps: An experimental and numerical investigation",
    journal: "Structural Concrete",
    year: 2024,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1002/suco.202301026",
    publicationDate: "2024",
    impactFactor: 2.79
  },
  {
    author: "Imjai, T., Aosai, P., Garcia, R., Raman, S.N., and Chaudhary, S.",
    title: "Deflections of high-content recycled aggregate concrete beams reinforced with GFRP bars and steel fibres",
    journal: "Engineering Structures",
    year: 2024,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1016/j.engstruct.2024.11824",
    publicationDate: "2024",
    impactFactor: 5.6
  },
  {
    author: "Kefyalew, F., Imjai, T., Garcia, R., Son, N.K., and Chaudhary, S.",
    title: "Performance of recycled aggregate concrete composite metal decks under elevated temperatures: a comprehensive review",
    journal: "Journal of Asian Architecture and Building Engineering",
    year: 2024,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1080/13467581.2024.2309347",
    publicationDate: "2024",
    impactFactor: 1.5
  },
  {
    author: "Srimuang, K., Imjai, T., Kefyalew, F., Raman, S. N., Garcia, R., and Chaudhary, S.",
    title: "Thermal and acoustic performance of masonry walls with phase change materials: A comparison of scaled-down houses in tropical climates",
    journal: "Journal of Building Engineering",
    year: 2023,
    volumePages: "108315",
    publicationLink: "https://doi.org/10.1016/j.jobe.2023.108315",
    publicationDate: "2023",
    impactFactor: 6.7
  },
  {
    author: "Singh, A., Bhadauria, S. S., Thakare, A. A., Kumar, A., Mudgal, M., and Chaudhary, S.",
    title: "Durability assessment of mechanochemically activated geopolymer concrete with a low molarity alkali solution",
    journal: "Case Studies in Construction Materials",
    year: 2023,
    volumePages: "e02715",
    publicationLink: "https://doi.org/10.1016/j.cscm.2023.e02715",
    publicationDate: "2023",
    impactFactor: 6.5
  },
  {
    author: "Singh, A., Thakare, A. A., and Chaudhary, S.",
    title: "A case study on examining the fresh-state behavior of self-compacting mortar containing waste powders from various sources",
    journal: "Case Studies in Construction Materials",
    year: 2023,
    volumePages: "e02684",
    publicationLink: "https://doi.org/10.1016/j.cscm.2023.e02684",
    publicationDate: "2023",
    impactFactor: 6.5
  },
  {
    author: "Jain, A., Gupta, R., Gupta, S., and Chaudhary, S.",
    title: "Evaluation of real time fire performance of eco-efficient fly ash blended self-consolidating concrete including granite waste",
    journal: "Journal of Building Engineering",
    year: 2023,
    volumePages: "77, 107533",
    publicationLink: "https://doi.org/10.1016/j.jobe.2023.107553",
    publicationDate: "2023",
    impactFactor: 6.7
  },
  {
    author: "Gupta, S., Agrwal, H., and Chaudhary, S.",
    title: "Thermo-mechanical treatment as an upcycling strategy for mixed recycled aggregate",
    journal: "Construction and Building Materials",
    year: 2023,
    volumePages: "398, 132471",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2023.132471",
    publicationDate: "2023",
    impactFactor: 7.4
  },
  {
    author: "Neupane, R. P., Imjai, T., Makul, N., Garcia, R., Kim, B., and Chaudhary, S.",
    title: "Use of recycled aggregate concrete in structural members: a review focused on Southeast Asia",
    journal: "Journal of Asian Architecture and Building Engineering",
    year: 2023,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1080/13467581.2023.2270029",
    publicationDate: "2023",
    impactFactor: 1.5
  },
  {
    author: "Kumar, P., Kasar, A. A., and Chaudhary, S.",
    title: "Rapid prediction of long-term deflections in steel-concrete composite bridges through a neural network model",
    journal: "International Journal of Steel Structures",
    year: 2023,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1007/s13296-023-00766-8",
    publicationDate: "2023",
    impactFactor: 1.1
  },
  {
    author: "Thakare, A. A., Singh, A., Gupta, T., and Chaudhary, S.",
    title: "Effect of size variation of fibre-shaped waste tyre rubber as fine aggregate on the ductility of self-compacting concrete",
    journal: "Environmental Science and Pollution Research",
    year: 2022,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1007/s11356-022-23488-6",
    publicationDate: "2022",
    impactFactor: 1
  },
  {
    author: "Jain, P., Gupta, R., and Chaudhary, S.",
    title: "Comprehensive assessment of ceramic ETP sludge waste as a SCM for the production of concrete",
    journal: "Journal of Building Engineering",
    year: 2022,
    volumePages: "104973",
    publicationLink: "https://doi.org/10.1016/j.jobe.2022.104973",
    publicationDate: "2022",
    impactFactor: 6.7
  },
  {
    author: "Thakare, A. A., Siddique, S., Singh, A., Gupta, T., and Chaudhary, S.",
    title: "Effect of rubber fiber size fraction on static and impact behavior of self-compacting concrete",
    journal: "Advances in Concrete Construction",
    year: 2022,
    volumePages: "13(6), 433-450",
    publicationLink: "https://doi.org/10.12989/acc.2022.13.6.433",
    publicationDate: "2022",
    impactFactor: 2.2
  },
  {
    author: "Jain, A., Chaudhary, S., Gupta, R., Chaudhary, S., and Gautam, L.",
    title: "Effect of granite industry waste addition on durability properties of fly ash blended self-compacting concrete",
    journal: "Construction and Building Materials",
    year: 2022,
    volumePages: "340, 127727",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2022.127727",
    publicationDate: "2022",
    impactFactor: 7.4
  },
  {
    author: "Gupta, S., and Chaudhary, S.",
    title: "State of the art review on supplementary cementitious materials in India – II: Characteristics of SCMs, effect on concrete and environmental impact",
    journal: "Journal of Cleaner Production",
    year: 2022,
    volumePages: "357, 131945",
    publicationLink: "https://doi.org/10.1016/j.jclepro.2022.131945",
    publicationDate: "2022",
    impactFactor: 9.7
  },
  {
    author: "Gupta, S., Singh, D., Gupta, T., and Chaudhary, S.",
    title: "Effect of limestone calcined clay cement (LC3) on the fire safety of concrete structures",
    journal: "Computers and Concrete",
    year: 2022,
    volumePages: "27(4), 263-278",
    publicationLink: "https://doi.org/10.12989/cac.2022.29.4.263",
    publicationDate: "2022",
    impactFactor: 2.9
  },
  {
    author: "Muttil, N., Chaudhary, S., Prasad, E. K., and Singh, S. K.",
    title: "Waste tyre recycling: An emerging applications with a focus on permeable pavements",
    journal: "Indian Journal of Engineering and Material Sciences",
    year: 2022,
    volumePages: "29(6), 707-713",
    publicationLink: "https://doi.org/10.56042/ijems.v29i6.70313",
    publicationDate: "2022",
    impactFactor: 1
  },
  {
    author: "Jain, A., Chaudhary, S., Choudhary, S., and Gupta, R.",
    title: "Resistance of fly ash blended self-compacting concrete incorporating granite powder against acid and sulphate environments",
    journal: "Arabian Journal of Geosciences",
    year: 2022,
    volumePages: "15, 1156",
    publicationLink: "https://doi.org/10.1007/s12517-022-10424-8",
    publicationDate: "2022",
    impactFactor: 1
  },
  {
    author: "Thakare, A. A., Gupta, T., Deevan, R., and Chaudhary, S.",
    title: "Micro and macro-structural properties of waste tyre rubber fibre-reinforced bacterial self-healing mortar",
    journal: "Construction and Building Materials",
    year: 2022,
    volumePages: "322, 126459",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2022.126459",
    publicationDate: "2022",
    impactFactor: 7.4
  },
  {
    author: "Jain, A., Chaudhary, S., and Gupta, R.",
    title: "Mechanical and microstructural characterization of fly ash blended self-compacting concrete containing granite waste",
    journal: "Construction and Building Materials",
    year: 2022,
    volumePages: "314(Part A), 125480",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2022.125480",
    publicationDate: "2022",
    impactFactor: 7.4
  },
  {
    author: "Choudhary, S., Singh, A., Jain, A., Gupta, R., and Chaudhary, S.",
    title: "Effect of Fiber Volume Fraction of Waste Originated Tire Fiber and w/c Ratio on Mechanical Properties of Functionally Graded Concrete",
    journal: "Iranian Journal of Science and Technology, Transactions of Civil Engineering",
    year: 2021,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1007/s40996-021-00778-6",
    publicationDate: "2021",
    impactFactor: 1.7
  },
  {
    author: "Bhardwaj, A., Nagpal, A. K., Chaudhary, S., and Matsagar, V.",
    title: "Effect of location of load on shear lag behavior of bonded steel-concrete flexural members",
    journal: "Steel and Composite Structures",
    year: 2021,
    volumePages: "41(1), 123-136",
    publicationLink: "https://doi.org/10.12989/scs.2021.41.1.123",
    publicationDate: "2021",
    impactFactor: 4.0
  },
  {
    author: "Siddique, S., Gupta, V., Chaudhary, S., Park, S., and Jang, J. G.",
    title: "Influence of the precursor, molarity and temperature on the rheology and structural buildup of alkali-activated materials",
    journal: "Materials",
    year: 2021,
    volumePages: "14(13), 3590",
    publicationLink: "https://doi.org/10.3390/ma14133590",
    publicationDate: "2021",
    impactFactor: 3.1
  },
  {
    author: "Jain, A., Sharma, N., Choudhary, N., Gupta, R., and Chaudhary, S.",
    title: "Utilization of non-metalized plastic bag fibers along with fly ash in concrete",
    journal: "Construction and Building Materials",
    year: 2021,
    volumePages: "291, 123329",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2021.123329",
    publicationDate: "2021",
    impactFactor: 7.4
  },
  {
    author: "Vasic, V. M., Pezo, L., Gupta, V., Chaudhary, S., and Radozevic, Z.",
    title: "An artificial neural network-based prediction model for utilization of coal ash in production of fired clay bricks: A review",
    journal: "Science of Sintering",
    year: 2021,
    volumePages: "53, 37-53",
    publicationLink: "https://doi.org/10.2298/SOS2101037V",
    publicationDate: "2021",
    impactFactor: 1.4
  },
  {
    author: "Gupta, T., Siddique, S., Sharma, R. K., and Chaudhary, S.",
    title: "Investigating mechanical properties and durability of concrete containing recycled rubber ash and fibers",
    journal: "Journal of Material Cycles and Waste Management",
    year: 2021,
    volumePages: "1-13",
    publicationLink: "https://doi.org/10.1007/s10163-021-01192-w",
    publicationDate: "2021",
    impactFactor: 2.7
  },
  {
    author: "Kumar, S., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
    title: "Rapid prediction of long-term deflections in steel-concrete composite bridges through a neural network model",
    journal: "International Journal of Steel Structures",
    year: 2021,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1007/s13296-021-00458-1",
    publicationDate: "2021",
    impactFactor: 1.1
  },
  {
    author: "Gupta, V., Pathak, D. K., Kumar, R., Miglani, A., Siddique, S., and Chaudhary, S.",
    title: "Production of colored bi-layered bricks from stone processing waste: structural and spectroscopic characterization",
    journal: "Construction and Building Materials",
    year: 2021,
    volumePages: "278, 122339",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2021.122339",
    publicationDate: "2021",
    impactFactor: 7.4
  },
  {
    author: "Singh, G.K., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
    title: "A methodology for rapid estimation of deflections in two-way reinforced concrete slabs considering cracking",
    journal: "Practical Periodical on Structural Design and Construction, ASCE",
    year: 2021,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1061/(ASCE)SC.1943-5576.0000568",
    publicationDate: "2021",
    impactFactor: 1.6
  },
  {
    author: "Choudhary, S., Gupta, R., Jain, A., and Chaudhary, S.",
    title: "Experimental Investigation of Rubberized Functionally Graded Concrete",
    journal: "Revue des Composites et des Materiaux Avances",
    year: 2021,
    volumePages: "31(1), 1-11",
    publicationLink: "https://doi.org/10.18280/rcma.310101",
    publicationDate: "2021",
    impactFactor: 1.0
  },
  {
    author: "Thakare, A. A., Singh, A., Gupta, V., Siddique, S., and Chaudhary, S.",
    title: "Sustainable development of self-compacting cementitious mixes using waste originated fibers: A review",
    journal: "Resources Conservation and Recycling",
    year: 2020,
    volumePages: "105250",
    publicationLink: "https://doi.org/10.1016/j.resconrec.2020.105250",
    publicationDate: "2020",
    impactFactor: 11.2
  },
  {
    author: "Gupta, V., Siddique, S., and Chaudhary, S.",
    title: "Optimum mixing sequence and moisture content for hydrated lime fly ash bricks",
    journal: "Journal of Cleaner Production",
    year: 2020,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1016/j.jclepro.2020.124859",
    publicationDate: "2020",
    impactFactor: 9.7
  },
  {
    author: "Bhardwaj, A., Matsagar, V., Nagpal, A. K., and Chaudhary, S.",
    title: "Bond Behavior in Flexural Members: Numerical Studies",
    journal: "International Journal of Steel Structures",
    year: 2020,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1007/s13296-020-00432-3",
    publicationDate: "2020",
    impactFactor: 1.1
  },
  {
    author: "Thakare, A. A., Siddique, S., Sarode, S. N., Deewan, R., Gupta, V., Gupta, S., and haudhry, S.",
    title: "A study on rheological properties of rubber fiber dosed self-compacting mortar",    "jornal": "Construction and Building Materials",
    year :2020,
    volumPages: "26, 120745",
    publiationLink: "htps://doi.org/10.1016/j.conbuildmat.2020.120745",
    publiationDate: "2020",
    impacFactor: 7.4  },
  {
    author: "Jain, A., Gupta, R., and Chaudhary, S.",
    title: "Sustainable development of self compacting concrete by using granite waste and fly ash",
    journal: "Construction and Building Materials",
    year: 2020,
    volumePages: "262, 120516",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2020.120516",
    publicationDate: "2020",
    impactFactor: 7.4
  },
  {
    author: "Jain, A., Gupta, R., and Chaudhary, S.",
    title: "Influence of granite waste aggregate on properties of binary blend self-compacting concrete",
    journal: "Advances in Concrete Construction",
    year: 2020,
    volumePages: "10, 127-140",
    publicationLink: "https://doi.org/10.12989/acc.2020.10.2.127",
    publicationDate: "2020",
    impactFactor: 2.2
  },
  {
    author: "Gupta, V., Pathak, D. K., Chaudhary, S., and Kumar, R.",
    title: "Raman Imaging for Measuring Homogeneity of Dry Binary Blend: Combining Microscopy with Spectroscopy for Technologists",
    journal: "Analytical Science Advances",
    year: 2020,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1002/ansa.202000029",
    publicationDate: "2020",
    impactFactor: 3.0
  },
  {
    author: "Gupta, T., Siddique, S., Sharma, R. K., and Chaudhary, S.",
    title: "Effect of aggressive environment on durability of concrete containing fibrous rubber shreds and silica fume",
    journal: "Structural Concrete",
    year: 2020,
    volumePages: "1-13",
    publicationLink: "https://doi.org/10.1002/suco.202000043",
    publicationDate: "2020",
    impactFactor: 3.0
  },
  {
    author: "Gupta, V., Chai, H. K., Lu, Y., and Chaudhary, S.",
    title: "A state of the art review to enhance the industrial scale waste utilization in sustainable unfired bricks",
    journal: "Construction and Building Materials",
    year: 2020,
    volumePages: "254, 119220",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2020.119220",
    publicationDate: "2020",
    impactFactor: 7.4
  },
  {
    author: "Gupta, S., and Chaudhary, S.",
    title: "State of the art review on Supplementary Cementitious Materials in India – I: An overview of legal perspective, governing organizations, and development patterns",
    journal: "Journal of Cleaner Production",
    year: 2020,
    volumePages: "261, 121203",
    publicationLink: "https://doi.org/10.1016/j.jclepro.2020.121203",
    publicationDate: "2020",
    impactFactor: 9.7
  },
  {
    author: "Jain, A., Siddique, S., Gupta, T., Jain, S., Sharma, R. K., and Chaudhary, S.",
    title: "Evaluation of concrete containing waste plastic shredded fibers: Ductility properties",
    journal: "Structural Concrete",
    year: 2020,
    volumePages: "1-10",
    publicationLink: "https://doi.org/10.1002/suco.201900512",
    publicationDate: "2020",
    impactFactor: 3.0
  },
  {
    author: "Gupta, V., Pathak, D., Siddique, S., Kumar, R., and Chaudhary, S.",
    title: "Study on the mineral phase characteristics of various Indian biomass and coal fly ash for its use in masonry construction products",
    journal: "Construction and Building Materials",
    year: 2020,
    volumePages: "235, 117413",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2020.117413",
    publicationDate: "2020",
    impactFactor: 7.4
  },
  {
    author: "Gupta, T., Kothari, S., Siddique, S., Sharma, R.K., and Chaudhary, S.",
    title: "Influence of stone processing dust on mechanical, durability and sustainability of concrete",
    journal: "Construction and Building Materials",
    year: 2019,
    volumePages: "223, 918-927",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2019.07.034",
    publicationDate: "2019",
    impactFactor: 7.4
  },
  {
    author: "Gupta, T., Patel, K.A., Siddique, S., Sharma, R.K., and Chaudhary, S.",
    title: "Prediction of mechanical properties of rubberised concrete exposed to elevated temperature using ANN",
    journal: "Measurement",
    year: 2019,
    volumePages: "147, 106870",
    publicationLink: "https://doi.org/10.1016/j.measurement.2019.106870",
    publicationDate: "2019",
    impactFactor: 5.2
  },
  {
    author: "Jain, A., Gupta, R., and Chaudhary, S.",
    title: "Performance of self-compacting concrete comprising granite cutting waste as fine aggregate",
    journal: "Construction and Building Materials",
    year: 2019,
    volumePages: "221, 539-552",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2019.06.021",
    publicationDate: "2019",
    impactFactor: 7.4
  },
  {
    author: "Gupta, T., Kothari, S., Siddique, S., Sharma, R.K., and Chaudhary, S.",
    title: "Behaviour of waste rubber powder and hybrid rubber concrete in aggressive environment",
    journal: "Construction and Building Materials",
    year: 2019,
    volumePages: "217, 283-291",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2019.05.021",
    publicationDate: "2019",
    impactFactor: 7.4
  },
  {
    author: "Siddique, S., Gupta, T., Thakre, A.A., Gupta, V., and Chaudhary, S.",
    title: "Acid resistance of fine bone china ceramic aggregate concrete",
    journal: "European Journal of Environmental and Civil Engineering",
    year: 2019,
    volumePages: "-",
    publicationLink: "https://doi.org/10.1080/19648189.2019.1572543",
    publicationDate: "2019",
    impactFactor: 2.2
  },
  {
    author: "Siddique, S., Chaudhary, S., Shrivastava, S., and Gupta, T.",
    title: "Sustainable utilisation of ceramic waste in concrete: Exposure to adverse conditions",
    journal: "Journal of Cleaner Production",
    year: 2019,
    volumePages: "210, 246-255",
    publicationLink: "https://doi.org/10.1016/j.jclepro.2018.11.086",
    publicationDate: "2019",
    impactFactor: 9.7
  },
  {
    author: "Luhar, S., Chaudhary, S., and Luhar, I.",
    title: "Development of rubberized geopolymer concrete: Strength and durability studies",
    journal: "Construction and Building Materials",
    year: 2019,
    volumePages: "204, 740-753",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2019.01.022",
    publicationDate: "2019",
    impactFactor: 7.4
  },
  {
    author: "Kumar, P., and Chaudhary, S.",
    title: "Effect of reinforcement detailing on performance of composite connections with headed studs",
    journal: "Engineering Structures",
    year: 2019,
    volumePages: "179, 476-492",
    publicationLink: "https://doi.org/10.1016/j.engstruct.2018.11.014",
    publicationDate: "2019",
    impactFactor: 5.6
  },
  {
    author: "Varshney, L. K., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
    title: "An efficient and novel strategy for control of cracking, creep and shrinkage effects in steel-concrete composite beams",
    journal: "Structural Engineering and Mechanics",
    year: 2019,
    volumePages: "70(6), 751-763",
    publicationLink: "https://doi.org/10.12989/sem.2019.70.6.751",
    publicationDate: "2019",
    impactFactor: 2.2
  },
  {
    author: "Siddique, S., Shrivastava, S., and Chaudhary, S.",
    title: "Evaluating resistance of fine bone china ceramic aggregate concrete to sulphate attack",
    journal: "Construction and Building Materials",
    year: 2018,
    volumePages: "186, 826-832",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2018.08.086",
    publicationDate: "2018",
    impactFactor: 7.4
  },
  {
    author: "Kumar, P., Patnaik A., and Chaudhary, S.",
    title: "Effect of bond layer thickness on behaviour of steel-concrete composite connections",
    journal: "Engineering Structures",
    year: 2018,
    volumePages: "177, 268-282",
    publicationLink: "https://doi.org/10.1016/j.engstruct.2018.06.014",
    publicationDate: "2018",
    impactFactor: 5.6
  },
  {
    author: "Gupta, T., Siddique S., Sharma R.K., and Chaudhary, S.",
    title: "Lateral force microscopic examination of calcium silicate hydrate in rubber ash concrete",
    journal: "Construction and Building Materials",
    year: 2018,
    volumePages: "179, 461-467",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2018.05.045",
    publicationDate: "2018",
    impactFactor: 7.4
  },
  {
    author: "Saxena, R., Siddique, S., Gupta, T., Sharma, R. K., and Chaudhary, S.",
    title: "Impact resistance and energy absorption capacity of concrete containing plastic waste",
    journal: "Construction and Building Materials",
    year: 2018,
    volumePages: "176, 415-421",
    publicationLink: "https://doi.org/10.1016/j.conbuildmat.2018.01.086",
    publicationDate: "2018",
    impactFactor: 7.4
  },
    {
      author: "Rajawat, D., Siddique, S., Shrivastava, S., Chaudhary, S., and Gupta, T.",
      title: "Influence of fine ceramic aggregates on the residual properties of concrete subjected to elevated temperature",
      journal: "Fire and Materials",
      year: 2018,
      volumePages: "42(7), 834-842",
      publicationLink: "",
      publicationDate: "2018",
      impactFactor: 2.0
    },
    {
      author: "Siddique, S., Shrivastava, S., and Chaudhary, S.",
      title: "Durability properties of bone china ceramic fine aggregate concrete",
      journal: "Construction and Building Materials",
      year: 2018,
      volumePages: "173, 323-331",
      publicationLink: "",
      publicationDate: "2018",
      impactFactor: 7.4
    },
    {
      author: "Siddique, S., Shrivastava, S., and Chaudhary, S.",
      title: "Influence of ceramic waste as fine aggregate in concrete: Pozzolanic, XRD, FT-IR and NMR investigations",
      journal: "Journal of Materials in Civil Engineering, ASCE",
      year: 2018,
      volumePages: "30(9), 04018227",
      publicationLink: "",
      publicationDate: "2018",
      impactFactor: 3.1
    },
    {
      author: "Saxena, R., Gupta, T., Sharma, R. K., Chaudhary, S., and Jain A.",
      title: "Assessment of mechanical and durability properties of concrete containing PET waste",
      journal: "Scientia Iranica",
      year: 2018,
      volumePages: "27(1), 1-9",
      publicationLink: "https://doi.org/10.24200/sci.2018.20334",
      publicationDate: "2018",
      impactFactor: 1.4
    },
    {
      author: "Siddique, S., Shrivastava, S., Chaudhary, S., and Gupta, T.",
      title: "Strength and impact resistance properties of concrete containing fine bone china ceramic aggregate",
      journal: "Construction and Building Materials",
      year: 2018,
      volumePages: "169, 289-298",
      publicationLink: "",
      publicationDate: "2018",
      impactFactor: 7.4
    },
    {
      author: "Luhar, S., Chaudhary, S., and Luhar, I.",
      title: "Thermal resistance of fly ash based rubberized geopolymer concrete",
      journal: "Journal of Building Engineering",
      year: 2018,
      volumePages: "19, 420-428",
      publicationLink: "",
      publicationDate: "2018",
      impactFactor: 6.7
    },
    {
      author: "Jain, A., Siddique S., Gupta, T., Sharma, R. K. and Chaudhary, S.",
      title: "Utilization of shredded waste plastic bags to improve impact and abrasion resistance of concrete",
      journal: "Environment Development and Sustainability",
      year: 2018,
      volumePages: "-",
      publicationLink: "https://doi.org/10.1007/s10668-018-0204-1",
      publicationDate: "2018",
      impactFactor: 4.7
    },
    {
      author: "Siddique, S., Shrivastava, S., and Chaudhary, S.",
      title: "Lateral force microscopic examination of interfacial transition zone in ceramic concrete",
      journal: "Construction and Building Materials",
      year: 2017,
      volumePages: "155, 688-725",
      publicationLink: "",
      publicationDate: "2017",
      impactFactor: 7.4
    },
    {
      author: "Ramnavas, M. P., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Explicit expressions for inelastic design quantities in composite frames considering effects of nearby columns and floors",
      journal: "Structural Engineering and Mechanics",
      year: 2017,
      volumePages: "64, 437-447",
      publicationLink: "",
      publicationDate: "2017",
      impactFactor: 2.2
    },
    {
      author: "Jain, A., Siddique S., Gupta, T., Jain, S., Sharma, R. K. and Chaudhary, S.",
      title: "Fresh, Strength, Durability and Microstructural Properties of Shredded Waste Plastic Concrete",
      journal: "Iranian Journal of Science and Technology, Transactions of Civil Engineering",
      year: 2018,
      volumePages: "-",
      publicationLink: "https://doi.org/10.1007/s40996-018-0178-0",
      publicationDate: "2018",
      impactFactor: 1.7
    },
    {
      author: "Kumar, P., Chaudhary, S., and Patnaik, A.",
      title: "A review on application of structural adhesives in concrete and steel–concrete composite and factors influencing the performance of composite connections",
      journal: "International Journal of Adhesion and Adhesives",
      year: 2017,
      volumePages: "77, 1-14",
      publicationLink: "",
      publicationDate: "2017",
      impactFactor: 3.2
    },
    {
      author: "Gupta, T., Tiwari, A., Siddique, S., Sharma, R. K., and Chaudhary, S.",
      title: "Response assessment under dynamic loading and microstructural investigations of rubberized concrete",
      journal: "Journal of Materials in Civil Engineering, ASCE",
      year: 2017,
      volumePages: "29(8), 04017062",
      publicationLink: "",
      publicationDate: "2017",
      impactFactor: 3.1
    },
    {
      author: "Gupta, T., Siddique, S., Sharma, R. K., and Chaudhary, S.",
      title: "Effect of elevated temperature and cooling regimes on mechanical and durability properties of rubberized concrete",
      journal: "Construction and Building Materials",
      year: 2017,
      volumePages: "137, 35-45",
      publicationLink: "",
      publicationDate: "2017",
      impactFactor: 7.4
    },
    {
      author: "Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Neural network based approach for rapid prediction of deflections in RC beams considering cracking",
      journal: "Computers and Concrete",
      year: 2017,
      volumePages: "19(3), 293-303",
      publicationLink: "",
      publicationDate: "2017",
      impactFactor: 2.9
    },
    {
      author: "Pendharkar, U., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Closed form expressions for long-term deflections in high-rise composite frames",
      journal: "International Journal of Steel Structures",
      year: 2017,
      volumePages: "17(1), 31-42",
      publicationLink: "",
      publicationDate: "2017",
      impactFactor: 1.1
    },
    {
      author: "Siddique, S., Chaudhary, S., and Shrivastava, S.",
      title: "Influence of ceramic waste on the fresh properties and compressive strength of concrete",
      journal: "European Journal of Environmental and Civil Engineering",
      year: 2017,
      volumePages: "-",
      publicationLink: "https://doi.org/10.1080/19648189.2016.127598",
      publicationDate: "2017",
      impactFactor: 2.2
    },
    {
      author: "Ramnavas, M. P., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Service load analysis of composite frames using cracked span length frame element",
      journal: "Engineering Structures",
      year: 2017,
      volumePages: "132, 733-744",
      publicationLink: "",
      publicationDate: "2017",
      impactFactor: 5.6
    },
    {
      author: "Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "An automated computationally efficient two stage procedure for service load analysis of RC flexural members considering concrete cracking",
      journal: "Engineering with Computers",
      year: 2017,
      volumePages: "33(3), 669-688",
      publicationLink: "",
      publicationDate: "2017",
      impactFactor: 8.7
    },
    {
      author: "Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "An element incorporating cracking for reinforced concrete skeletal structures at service load",
      journal: "Advances in Structural Engineering",
      year: 2016,
      volumePages: "-",
      publicationLink: "https://doi.org/10.1177/1369433216673642",
      publicationDate: "2016",
      impactFactor: 2.1
    },
    {
      author: "Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Rapid prediction of inelastic bending moments in RC beams considering cracking",
      journal: "Computers and Concrete",
      year: 2016,
      volumePages: "18(6), 1113-1134",
      publicationLink: "",
      publicationDate: "2016",
      impactFactor: 2.9
    },
    {
      author: "Pendharkar, U., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Rapid prediction of moments in high-rise composite frames considering cracking and time-effects",
      journal: "Periodica Polytechnica Civil Engineering",
      year: 2016,
      volumePages: "-",
      publicationLink: "https://doi.org/10.3311/PPci.8210",
      publicationDate: "2016",
      impactFactor: 1
    },
    {
      author: "Gupta, T., Sharma, R. K., and Chaudhary, S.",
      title: "Mechanical and durability properties of waste rubber fiber concrete with and without silica fume",
      journal: "Journal of Cleaner Production",
      year: 2016,
      volumePages: "112, 702-711",
      publicationLink: "",
      publicationDate: "2016",
      impactFactor: 9.7
    },
    {
      author: "Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "A tension stiffening model for analysis of RC flexural members under service load",
      journal: "Computers and Concrete",
      year: 2016,
      volumePages: "17(1), 29-51",
      publicationLink: "",
      publicationDate: "2016",
      impactFactor: 2.9
    },
    {
      author: "Tripathi, B., and Chaudhary, S.",
      title: "Performance based evaluation of ISF slag as a substitute of natural sand in concrete",
      journal: "Journal of Cleaner Production",
      year: 2016,
      volumePages: "112, 673-683",
      publicationLink: "",
      publicationDate: "2016",
      impactFactor: 9.7
    },
    {
      author: "Gupta, R. K., Kumar, S., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Rapid prediction of deflections in multi-span continuous composite bridges using neural networks",
      journal: "International Journal of Steel Structures",
      year: 2015,
      volumePages: "15(4), 893-909",
      publicationLink: "",
      publicationDate: "2015",
      impactFactor: 1.1
    },
    {
      author: "Gupta, T., Sharma, R. K., and Chaudhary, S.",
      title: "Influence of waste tyre fibers on strength, abrasion resistance and carbonation of concrete",
      journal: "Scientia Iranica",
      year: 2015,
      volumePages: "22(4), 1481-1489",
      publicationLink: "",
      publicationDate: "2015",
      impactFactor: 1.4
    },
    {
      author: "Ramnavas, M. P., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Cracked span length beam element for service load analysis of steel concrete composite bridges",
      journal: "Computers & Structures",
      year: 2015,
      volumePages: "157, 201-208",
      publicationLink: "",
      publicationDate: "2015",
      impactFactor: 4.4
    },
    {
      author: "Gupta, T., Sharma, R. K., and Chaudhary, S.",
      title: "Impact resistance of concrete containing waste rubber fiber and silica fume",
      journal: "International Journal of Impact Engineering",
      year: 2015,
      volumePages: "83, 76-87",
      publicationLink: "",
      publicationDate: "2015",
      impactFactor: 5.1
    },
    {
      author: "Pendharkar, U., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Rapid prediction of long-term deflections in composite frames",
      journal: "Steel and Composite Structures",
      year: 2015,
      volumePages: "18, 547-563",
      publicationLink: "",
      publicationDate: "2015",
      impactFactor: 4.0
    },
    {
      author: "Patel, K. A., Bhardwaj, A., Chaudhary, S., and Nagpal, A. K.",
      title: "Explicit expression for effective moment of inertia of RC beams",
      journal: "Latin American Journal of Solids and Structures",
      year: 2014,
      volumePages: "12, 542-560",
      publicationLink: "",
      publicationDate: "2014",
      impactFactor: 1.4
    },
    {
      author: "Gupta, T., Chaudhary, S., and Sharma, R. K.",
      title: "Assessment of mechanical and durability properties of concrete containing waste rubber tire as fine aggregate",
      journal: "Construction and Building Materials",
      year: 2014,
      volumePages: "73, 562-574",
      publicationLink: "",
      publicationDate: "2014",
      impactFactor: 7.4
    },
    {
      author: "Chaudhary, S., Pendharkar, U., Patel, K. A., and Nagpal, A. K.",
      title: "Neural networks for deflections in continuous composite beams considering concrete cracking",
      journal: "Iranian Journal of Science and Technology Transactions in Civil Engineering",
      year: 2014,
      volumePages: "38(C1+), 205-221",
      publicationLink: "",
      publicationDate: "2014",
      impactFactor: 1.7
    },
    {
      author: "Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Analytical-numerical procedure for cracking effect in RC beams",
      journal: "Engineering Computations",
      year: 2014,
      volumePages: "31(5), 986-1010",
      publicationLink: "",
      publicationDate: "2014",
      impactFactor: 1.5
    },
    {
      author: "Vu, T. D., Lee, S. Y., Chaudhary, S., and Kim, D.",
      title: "Effects of tendon on static and dynamic behavior of CFTA girder",
      journal: "Steel and Composite Structures",
      year: 2013,
      volumePages: "15(5), 567-583",
      publicationLink: "",
      publicationDate: "2013",
      impactFactor: 4.0
    },
    {
      author: "Varshney, L. K., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Control of time-dependent effects in steel-concrete composite frames",
      journal: "International Journal of Steel Structures",
      year: 2013,
      volumePages: "13(4), 589-606",
      publicationLink: "",
      publicationDate: "2013",
      impactFactor: 1.1
    },
    {
      author: "Tripathi, B., Misra, A., and Chaudhary, S.",
      title: "Strength and abrasion characteristics of ISF slag concrete at different w/c and sand replacements",
      journal: "Journal of Materials in Civil Engineering, ASCE",
      year: 2013,
      volumePages: "25(11), 1611-1688",
      publicationLink: "",
      publicationDate: "2013",
      impactFactor: 3.1
    },
    {
      author: "Cui, J., Kim, D., Koo, K. Y., and Chaudhary, S.",
      title: "Structural model updating of steel box girder bridge using modal flexibility based deflections",
      journal: "Baltic Journal of Road and Bridge Engineering",
      year: 2012,
      volumePages: "7(4), 253-260",
      publicationLink: "",
      publicationDate: "2012",
      impactFactor: 0.6
    },
    {
      author: "Tadesse, Z., Patel, K. A., Chaudhary, S., and Nagpal, A. K.",
      title: "Neural networks for prediction of deflection in composite bridges",
      journal: "Journal of Constructional Steel Research",
      year: 2012,
      volumePages: "68(1), 138-149",
      publicationLink: "",
      publicationDate: "2012",
      impactFactor: 4.0
    },
    {
      author: "Kim, D., Chaudhary, S., Nocete, C. F., Wang, F., and Lee, D. H.",
      title: "A probabilistic capacity spectrum strategy for the reliability analysis of bridge pile shafts considering soil structure interaction",
      journal: "Latin American Journal of Solids and Structures",
      year: 2011,
      volumePages: "8(3), 291-303",
      publicationLink: "",
      publicationDate: "2011",
      impactFactor: 1.4
    },
    {
      author: "Cho, S. G., Kim, D., and Chaudhary, S.",
      title: "A simplified model for nonlinear seismic response analysis of equipment cabinets in nuclear power plants",
      journal: "Nuclear Engineering and Design",
      year: 2011,
      volumePages: "241(8), 2750-2757",
      publicationLink: "",
      publicationDate: "2011",
      impactFactor: 1.90
    },
    {
      author: "Pendharkar, U., Chaudhary, S., and Nagpal, A. K.",
      title: "Prediction of moments in composite frames considering cracking and time effects using neural network models",
      journal: "Structural Engineering and Mechanics",
      year: 2011,
      volumePages: "39(2), 267-285",
      publicationLink: "",
      publicationDate: "2011",
      impactFactor: 2.2
    },
    {
      author: "Pendharkar, U., Chaudhary, S., and Nagpal, A. K.",
      title: "Neural networks for inelastic mid-span deflections in continuous composite beams",
      journal: "Structural Engineering and Mechanics",
      year: 2010,
      volumePages: "36(2), 165-179",
      publicationLink: "",
      publicationDate: "2010",
      impactFactor: 2.2
    },
    {
      author: "Chaudhary, S., Pendharkar, U., and Nagpal, A. K.",
      title: "Control of creep and shrinkage effects in steel concrete composite bridges with precast decks",
      journal: "Journal of Bridge Engineering, ASCE",
      year: 2009,
      volumePages: "14(5), 336-345",
      publicationLink: "",
      publicationDate: "2009",
      impactFactor: 3.1
    },
    {
      author: "Chaudhary, S., Pendharkar, U., and Nagpal, A. K.",
      title: "Service load behavior of low rise composite frames considering creep, shrinkage and cracking",
      journal: "Latin American Journal of Solids and Structures",
      year: 2008,
      volumePages: "5(4), 237-258",
      publicationLink: "",
      publicationDate: "2008",
      impactFactor: 1.4
    },
    {
      author: "Pendharkar, U., Chaudhary, S., and Nagpal, A. K.",
      title: "Neural network for bending moment in continuous composite beams considering cracking and time effects in concrete",
      journal: "Engineering Structures",
      year: 2007,
      volumePages: "29(9), 2069-2079",
      publicationLink: "",
      publicationDate: "2007",
      impactFactor: 5.6
    },
    {
      author: "Chaudhary, S., Pendharkar, U., and Nagpal, A. K.",
      title: "Bending moment prediction for continuous composite beams by neural networks",
      journal: "Advances in Structural Engineering",
      year: 2007,
      volumePages: "10(4), 439-454",
      publicationLink: "",
      publicationDate: "2007",
      impactFactor: 2.1
    },
    {
      author: "Chaudhary, S., Pendharkar, U., and Nagpal, A. K.",
      title: "A hybrid procedure for cracking, creep, shrinkage and thermal gradient in continuous composite bridges",
      journal: "Latin American Journal of Solids and Structures",
      year: 2007,
      volumePages: "4(3), 203-227",
      publicationLink: "",
      publicationDate: "2007",
      impactFactor: 1.4
    },
    {
      author: "Chaudhary, S., Pendharkar, U., and Nagpal, A. K.",
      title: "An analytical-numerical procedure for cracking and time-dependent effects in continuous composite beams under service load",
      journal: "Steel and Composite Structures",
      year: 2007,
      volumePages: "7(3), 219-240",
      publicationLink: "",
      publicationDate: "2007",
      impactFactor: 4.0
    },
    {
      author: "Chaudhary, S., Pendharkar, U., and Nagpal, A. K.",
      title: "Hybrid procedure for cracking and time-dependent effects in composite frames at service load",
      journal: "Journal of Structural Engineering, ASCE",
      year: 2007,
      volumePages: "133(2), 166-175",
      publicationLink: "",
      publicationDate: "2007",
      impactFactor: 3.7
    },
];

// Insert data function
const insertPublications = async () => {
  try {
    // Delete existing data (optional)
    await Publication.deleteMany({});
    console.log("Deleted existing publications");

    // Insert new data
    const result = await Publication.insertMany(publicationData);
    console.log(`${result.length} publications inserted successfully`);

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting publications:", error);
  }
};

// Run the function
insertPublications();
