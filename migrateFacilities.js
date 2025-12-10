// Migration script to populate MongoDB with existing facilities
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Facility = require("./models/Facility");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Existing facilities data
const facilities = [
  {
    name: "Brick Manufacturing Unit",
    description: "",
    category: "bricks",
    image: "/images/facility/Brick machine.jpeg",
    order: 1,
    isVisible: true
  },
  {
    name: "Concrete mixing and casting facilities",
    description: "",
    category: "materials",
    image: "/images/facility/Concrete mixer.jpeg",
    order: 1,
    isVisible: true
  },
  {
    name: "Compression Testing Machine",
    description: "Servo-controlled 5000 kN capacity. Smaller test capacities of 3000 kN, 1000 kN, 500 kN and 20 kN are also available.",
    category: "general",
    image: "/images/facility/CTM Machine.jpeg",
    order: 1,
    isVisible: true
  },
  {
    name: "Fatigue testing machine",
    description: "Dynamic loading facility for fatigue testing in normal and high temperature environments.",
    category: "general",
    image: "/images/facility/Fatigue.jpeg",
    order: 2,
    isVisible: true
  },
  {
    name: "Mortar preparation and testing facilities",
    description: "Mortar mixer of different capacities, flow tests, shrinkage, and other testing facilities.",
    category: "materials",
    image: "/images/facility/Flow table machine.jpeg",
    order: 2,
    isVisible: true
  },
  {
    name: "Freeze thaw chamber",
    description: "",
    category: "general",
    image: "/images/facility/Freeze thaw chamber.jpeg",
    order: 3,
    isVisible: true
  },
  {
    name: "Bio-construction preparation and testing facilities",
    description: "Laminar flow hood, Autoclave, Incubator, Optical Microscope, etc.",
    category: "general",
    image: "/images/facility/Laminar flow hood.jpeg",
    order: 4,
    isVisible: true
  },
  {
    name: "Muffle furnace",
    description: "Up to 1600°C capacity to support clinker manufacturing and elevated temperature.",
    category: "materials",
    image: "/images/facility/Muffle furnace.jpeg",
    order: 3,
    isVisible: true
  },
  {
    name: "Permeability test apparatus",
    description: "Different permeability test apparatuses for testing the water-based durability.",
    category: "general",
    image: "/images/facility/Permeablity.jpeg",
    order: 5,
    isVisible: true
  },
  {
    name: "Modular Compact Rheometer",
    description: "Ball and cup, parallel plate arrangement for testing different rheological properties to support flowable and 3D printing applications.",
    category: "materials",
    image: "/images/facility/Rheometer.jpeg",
    order: 4,
    isVisible: true
  },
  {
    name: "Thermal conductivity",
    description: "",
    category: "general",
    image: "/images/facility/Thermal conductivity.jpeg",
    order: 6,
    isVisible: true
  },
  {
    name: "Universal Testing Machine",
    description: "",
    category: "general",
    image: "/images/facility/UTM Machine.jpeg",
    order: 7,
    isVisible: true
  }
];

async function migrateFacilities() {
  try {
    // Clear existing facilities (optional - comment out if you want to keep existing data)
    await Facility.deleteMany({});
    console.log("Cleared existing facilities");

    // Insert facilities
    const result = await Facility.insertMany(facilities);
    console.log(`Successfully migrated ${result.length} facilities`);

    // Display summary
    const counts = await Facility.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    
    console.log("\nFacilities by category:");
    counts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error migrating facilities:", error);
    process.exit(1);
  }
}

migrateFacilities();
