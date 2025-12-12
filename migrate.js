const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ResearchMember = require('./models/ResearchGroup');

// Load env vars
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const performMigration = async () => {
  try {
    const members = await ResearchMember.find({});
    console.log(`Found ${members.length} members to check.`);
    
    let updatedCount = 0;

    for (const member of members) {
      let originalType = member.type;
      let newStatus = 'Current'; // Default
      let newType = originalType;
      let needsUpdate = false;

      // Mapping logic
      if (originalType === 'Research Scholar') {
        newStatus = 'Current';
        newType = 'Research Scholar';
      } else if (originalType === 'Research Alumni') {
        newStatus = 'Alumni';
        newType = 'Research Scholar'; // Assumption based on context
        needsUpdate = true;
      } else if (originalType === 'Research Under-Graduate') {
        newStatus = 'Current';
        newType = 'Undergraduate';
        needsUpdate = true;
      } else if (originalType === 'Research Under-Graduates Alumni') {
        newStatus = 'Alumni';
        newType = 'Undergraduate';
        needsUpdate = true;
      } else if (originalType === 'Research Interns Alumni') {
        newStatus = 'Alumni';
        newType = 'Intern';
        needsUpdate = true;
      } else if (originalType === 'Research Post-Graduates Alumni') {
        newStatus = 'Alumni';
        newType = 'Postgraduate';
        needsUpdate = true;
      }

      // If status is missing (it's new schema), we should set it
      if (!member.status) {
         needsUpdate = true;
         // newStatus is already set to 'Current' or derived above
      }

      if (needsUpdate) {
        member.status = newStatus;
        member.type = newType;
        await member.save();
        console.log(`Updated: ${member.name} | ${originalType} -> ${newStatus} ${newType}`);
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} members.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

performMigration();
