const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Facility = require("./models/Facility");
const fs = require("fs");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const count = await Facility.countDocuments();
      const byCategory = await Facility.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
      
      const output = `Total: ${count}\nCategories: ${JSON.stringify(byCategory, null, 2)}`;
      fs.writeFileSync("debug_output.txt", output);
      
      console.log("Done writing to file.");
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
