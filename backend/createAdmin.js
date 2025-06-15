const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/admin'); // Adjust path if needed
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const admin3 = new Admin({
        username: 'admin3',
        email: 'admin3@example.com',
        password: hashedPassword
      });

      await admin3.save(); // ✅ Use the correct variable name
      console.log('Admin created successfully');
    } catch (err) {
      if (err.code === 11000) {
        console.error('❗ Duplicate admin entry detected:', err.keyValue);
      } else {
        console.error('❗ Error creating admin:', err);
      }
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((err) => {
    console.error('❗ Failed to connect to MongoDB:', err);
  });
