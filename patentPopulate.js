const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Patent schema
const PatentSchema = new mongoose.Schema({

  title: String,
  authors: String,
  year: Number,
  applicationNumber: String,
  grantNumber: String,
  grantDate: String,
  description: String,
});

const Patent = mongoose.model("Patent", PatentSchema);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Patent data from your input
const patentData = [
  {
    title:"Composition for preparation of Paver Block utilizing rubber waste",
    authors: "Authors: Gupta, T., Sharma, R. K., Chaudhary, S., and Siddique, S",
    year: 2020,
    applicationNumber: " 202011018399 A",
    grantNumber: " 385236 ",
    grantDate: "Dec. 27, 2021",
    description: "The present invention relates to a method of preparation of paver block utilizing rubber waste. The object of the proposed invention is to utilize waste tyre material and replacing the fine aggregate by waste tyre rubber ash (in powder form) and rubber fibers (in shredded form). The composition for preparation of sustainable rubcrete paver blocks comprises of cement (15.83%, 365 kg), fine aggregate (26.50%, 611 kg), coarse aggregate (48.79%, 1125 kg), waste rubber ash (1.69%, 39 kg), waste rubber fibers (1.34%, 31 kg), water (5.55%, 128 kg) and super plasticizer (0.30%, 7 kg) for production of one cubic meter concrete. Proposed paver blocks have unique feature of high energy absorption capacity, better abrasion resistance, and less water absorption. Following invention is described in detail with the help of Figure 1 of sheet 1 showing schematic presentation with dimensions of the proposed sustainable paver block."
  },
  {
    title: "Cow dung-based lightweight construction materials and method",
    authors:"Gupta, S., and Chaudhary, S.",
    year: 2024 ,
    applicationNumber: "202421010279",
    grantNumber: "-",
    grantDate: "-",
    description: "The present invention provides a composition and process where cow dung is used as a natural foaming agent for manufacturing of lightweight concrete, bricks and blocks."
  },

  {
    title:"Method of Preparation of Conplas Paver Block Utilizing waste Polythene",
    authors: "Gupta, T., Chaudhary, S., Sharma, R. K., and Jain, S.",
    year: 2020,
    applicationNumber: "202011002264",
    grantNumber: "396218",
    grantDate: "May 5, 2022",
    description: "The present invention relates to a method of preparation of paver block utilizing waste polythene bags. The object of the proposed invention is to utilize sustainable waste material and analogously minimizing the consumption of fine aggregate by replacing it with waste polythene bags in shredded form. The composition for preparation of sustainable conplas paver blocks comprises of cement (17.15%, 416.67 kg), fine aggregate (26.79%, 650.95kg), coarse aggregate (48.15%, 1170kg), waste polythene bags (1.71%, 41.55kg) and water (6.19%, 150.5kg) for production of one cubic meter concrete. Conplas paver blocks have unique feature of high impact resistance and energy absorption capacity. Following invention is described in detail with the help of Figure 1 of sheet 1 showing schematic presentation with dimensions of the sustainable conplas paver block."
  },
];

// Insert data function
const insertPatents = async () => {
  try {
    // Delete existing data (optional)
    await Patent.deleteMany({});
    console.log("Deleted existing patents");

    // Insert new data
    const result = await Patent.insertMany(patentData);
    console.log(`${result.length} patents inserted successfully`);

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting patents:", error);
  }
};

// Run the function
insertPatents();