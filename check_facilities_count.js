const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Facility = require("./models/Facility");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const count = await Facility.countDocuments();
      console.log(`Total facilities in MongoDB: ${count}`);
      
      const byCategory = await Facility.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
      console.log("By Category:", byCategory);
      
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
