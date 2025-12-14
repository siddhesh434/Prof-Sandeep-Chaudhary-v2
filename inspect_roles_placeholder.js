const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const projectSchema = new mongoose.Schema({
    title: String,
    role: String,
    projectType: String
}, { strict: false });

const Project = mongoose.model('Project', projectSchema);

async function inspectProjects() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB.");
        
        const projects = await Project.find({}, 'title role projectType');
        console.log("--- PROJECT LIST ---");
        projects.forEach(p => {
            console.log(`Title: "${p.title.substring(0, 20)}..." | Role: "${p.role}" | Type: "${p.projectType}"`);
        });
        console.log("--------------------");

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

inspectProjects();
