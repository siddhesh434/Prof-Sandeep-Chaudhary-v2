const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Facility = require("./models/Facility");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      console.log("Starting fix migration...");

      // specialized_research -> research
      const r1 = await Facility.updateMany(
        { category: "specialized_research" },
        { $set: { category: "research" } }
      );
      console.log(`Fixed specialized_research -> research: ${r1.modifiedCount}`);

      // advanced_material -> characteristics
      const r2 = await Facility.updateMany(
        { category: "advanced_material" },
        { $set: { category: "characteristics" } }
      );
      console.log(`Fixed advanced_material -> characteristics: ${r2.modifiedCount}`);

      // casting_testing -> casting
      const r3 = await Facility.updateMany(
        { category: "casting_testing" },
        { $set: { category: "casting" } }
      );
      console.log(`Fixed casting_testing -> casting: ${r3.modifiedCount}`);
      
      // Check final state
      const finalCounts = await Facility.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
      console.log("Final counts:", finalCounts);

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
