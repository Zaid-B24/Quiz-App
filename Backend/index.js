const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './dotenv.config' });

process.on('uncaughtException', err => {
  console.error('Uncaught Exception Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});


async function connectToDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to DB');
  } catch (err) {
    console.error('Error connecting to DB:', err.message);
    process.exit(1);
  }
}


async function startServer() {
  const port = process.env.PORT || 8080;

  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection  Shutting down...');
    console.error(err.name, err.message);

    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated');
    });
  });
}

(async function () {
  await connectToDB();
  await startServer();
})();
