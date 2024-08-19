const mongoose = require('mongoose');
const { optionSchema: baseOptionSchema, questionSchema: baseQuestionSchema } = require('./optionandquestionSchema');

const pollOptionSchema = baseOptionSchema.clone();
pollOptionSchema.add({
  votes: {
    type: Number,
    default: 0
  }
});

const pollQuestionSchema = baseQuestionSchema.clone();
pollQuestionSchema.add({
  options: {
    type: [pollOptionSchema] 
  }
});


const pollSchema = new mongoose.Schema({
  category: {
    type: String,
    default: 'poll'
  },
  name: {
    type: String,
    required: true
  },
  questions: {
    type: [pollQuestionSchema], 
    validate: {
      validator: function (questions) {
        return questions.length >= 1 && questions.length <= 5;
      },
      message: 'Questions must be between 1 and 5'
    },
    required: true
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
    ref: 'User',
    required: true
  }
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;