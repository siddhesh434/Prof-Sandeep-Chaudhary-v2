
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ChapterSchema = new mongoose.Schema({
  author: String,
  chapterName: String,
  bookName: String,
  year: Number,
  ISBN: String,
  Page: String,
});

const Chapter = mongoose.model("Chapter", ChapterSchema);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Book data from your input
const ChapterData = [
    {
      author: "Gupta, S., and Chaudhary, S.",
      chapterName: "Conventional and Emerging Materials Used in FRP-Concrete Composites for Earthquake Resistance",
      bookName: "RC Structures Strengthened with FRP for Earthquake Resistance",
      year: 2024,
      ISBN: "978-981-97-0101-8",
      Page: "193-205"
    },
    {
      author: "Chaudhary, S.",
      chapterName: "Sustainable Construction",
      bookName: "Technology of Home Knowledge Series – MASTERCLASS, created by Association of Infrastructure Industry (India) and JK Cement Limited",
      year: 2022,
      ISBN: "",
      Page: ""
    },
    {
      author: "Gupta, S., and Chaudhary, S.",
      chapterName: "Large Scale Waste Utilisation in Sustainable Composite Materials for Structural Applications",
      bookName: "Emerging Trends of Advanced Composite Materials in Structural Applications",
      year: 2021,
      ISBN: "9789811616884, 9811616884",
      Page: "169–177"
    },
    {
      author: "Gupta, S., and Chaudhary, S.",
      chapterName: "Use of Fly Ash for the Development of Sustainable Construction Materials",
      bookName: "New Materials in Civil Engineering",
      year: 2020,
      ISBN: "	9780128190753, 0128190752",
      Page: "677–689"
    },
    {
      author: "Mandolia, R., Siddique, S., and Chaudhary, S.",
      chapterName: "Effect of Different Hydrophobic Treatments on Properties of Recycled Aggregate Concrete",
      bookName: "Lecture Notes in Civil Engineering",
      year: 2020,
      ISBN: "9789811533631",
      Page: "121–130"
    }
  ];

// Insert data function
const insertChapters = async () => {
  try {
    // Delete existing data (optional)
    await Chapter.deleteMany({});
    console.log("Deleted existing chapters");

    // Insert new data
    const result = await Chapter.insertMany(ChapterData);
    console.log(`${result.length} chapters inserted successfully`);

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting chapters:", error);
  }
};

// Run the function
insertChapters();
