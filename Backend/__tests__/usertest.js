const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../Models/userSchema.js'); 
dotenv.config({path:'../dotenv.config'});
// Load environment variables from .env file
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB ✅');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit the process if connection fails
  }
};

// Save a new user
const saveUser = async () => {
  try {
    const newUser = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser);
  } catch (error) {
    console.error('Error saving user:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Run the script
(async () => {
  await connectDB();
  await saveUser();
})();
