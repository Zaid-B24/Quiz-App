const mongoose = require('mongoose');

const User = require('./userSchema');
const { questionSchema } = require('./optionandquestionSchema');

const quizSchema = new mongoose.Schema({
  category: {
    type: String,
    default: 'quiz'
  },
  name: {
    type: String,
    required: true
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function (questions) {
        return questions.length >= 1 && questions.length <= 5;
      },
      message: 'Questions must be between 1 and 5'
    },
    required: true
  },
  timer: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  impressions: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
