const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
dotenv.config({ path: './dotenv.config' });
app.listen(3000);

 function connectToDB() {
  try {
     mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to DB');
  } catch (err) {
    console.error('Error connecting to DB :', err.message);
    process.exit(1);
  }
}



// Execute the functions
(async function () {
  await connectToDB();
  await startServer();
})();
