// testScript.js
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Quiz = require('../Models/QnAModel.js'); 
const Poll = require('../Models/pollModel.js.js'); 
dotenv.config({path:'../dotenv.config'});
async function runTest() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Create a sample quiz
    const quiz = new Quiz({
      name: 'Sample Quiz',
      questions: [
        {
          question: 'What is the capital of France?',
          optionsType: 'text',
          options: [
            { text: 'Paris' },
            { text: 'London' },
            { text: 'Rome' },
            { text: 'Berlin' }
          ]
        }
      ],
      createdBy: new mongoose.Types.ObjectId()
    });

    // Save the quiz to the database
    await quiz.save();
    console.log('Quiz created:', quiz);

    // Create a sample poll
    const poll = new Poll({
      name: 'Favorite Fruit',
      questions: [
        {
          question: 'Which fruit do you prefer?',
          optionsType: 'text',
          options: [
            { text: 'Apple', votes: 0 },
            { text: 'Banana', votes: 0 },
            { text: 'Mango', votes: 0 },
            { text: 'Orange', votes: 0 }
          ]
        }
      ],
      createdBy: new mongoose.Types.ObjectId()
    });

    // Save the poll to the database
    await poll.save();
    console.log('Poll created:', poll);

    // Fetch and display quizzes and polls
    const quizzes = await Quiz.find();
    const polls = await Poll.find();

    console.log('All quizzes:', quizzes);
    console.log('All polls:', polls);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

runTest();
