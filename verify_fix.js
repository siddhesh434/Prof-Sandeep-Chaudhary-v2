const { generateCV, generateWordCV } = require('./cvGeneratorModule');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dummyConfig = {
    personalInfo: {
        name: "Test User",
        designation: "Professor",
        email: "test@example.com",
        phone: "1234567890",
        address: "Test Address"
    },
    showQualifications: true,
    qualifications: "PhD - Test Univ (2020)",
    showExperience: true,
    experience: ["Prof - Test Univ"],
    showProjects: true,
    selectedProjects: [], // Empty array = all items
    showPublications: true,
    selectedBooks: [],
    selectedJournals: []
};

async function testGeneration() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        console.log("Testing PDF Generation...");
        const pdfPath = await generateCV(dummyConfig);
        console.log(`PDF Generated at: ${pdfPath}`);

        console.log("Testing Word Generation...");
        const wordPath = await generateWordCV(dummyConfig);
        console.log(`Word Generated at: ${wordPath}`);

    } catch (error) {
        console.error("Verification Error:", error);
    } finally {
        await mongoose.connection.close();
    }
}

testGeneration();
