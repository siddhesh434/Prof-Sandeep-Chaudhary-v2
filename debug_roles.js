const mongoose = require('mongoose');
const Project = require('./models/Project');

async function checkRoles() {
    try {
        // Connect to MongoDB (assuming local default or env, but I need the URI. 
        // I'll check app.js or similar for connection string if this fails, but usually localhost:27017/test or similar.
        // Wait, I don't know the DB URI. I should check env or app.js first.
        // But assuming standard setup or I can reuse the connection logic from an existing file.
        // Let's look for a file that connects to DB.
        require('dotenv').config(); 
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sandeep-sir-cv'); 
        
        const projects = await Project.find({});
        console.log(`Found ${projects.length} projects.`);
        const roles = {};
        projects.forEach(p => {
             const r = p.role || '(undefined)';
             roles[r] = (roles[r] || 0) + 1;
        });
        console.log("Roles distribution:");
        console.log(roles);
        
        mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}
checkRoles();
