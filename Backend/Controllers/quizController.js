const Quiz = require('../Models/QnAModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Add a new quiz
exports.addQuiz = catchAsync(async (req, res, next) => {
  const { name, questions, timer } = req.body;

  const quiz = await Quiz.create({
    name,
    questions,
    timer,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { quiz }
  });
});

// Get a quiz by ID
exports.getQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    return next(new AppError('Quiz does not exist', 404));
  }

  quiz.impressions += 1;
  await quiz.save();

  res.status(200).json({
    status: 'success',
    data: { quiz }
  });
});

// Get quizzes created by a specific user
exports.getUsersQuizzes = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id });

  res.status(200).json({
    status: 'success',
    data: { quizzes }
  });
});

// Delete a quiz by ID
exports.deleteQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const quiz = await Quiz.findOneAndDelete({
    _id: id,
    createdBy: req.user.id
  });

  if (!quiz) {
    return next(new AppError('No quiz found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Attempt a quiz and calculate the results
exports.attemptedQuiz = catchAsync(async (req, res, next) => {
  const { results } = req.body;

  if (!results) {
    return next(new AppError('Please provide results', 400));
  }

  const { id } = req.params;
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    return next(new AppError('No quiz exists', 404));
  }

  let correctAnswers = 0;

  // Improved performance by avoiding nested loops
  const questionsMap = new Map(quiz.questions.map(q => [q._id.toString(), q]));

  for (const result of results) {
    const question = questionsMap.get(result.questionId);

    if (!question) {
      return next(new AppError('Question not found', 403));
    }

    if (result.selectedOption === question.answer) {
      correctAnswers += 1;
      question.corrects += 1;
    }
  }

  await quiz.save();

  const userResults = {
    totalQuestions: quiz.questions.length,
    correctAnswers
  };

  res.status(200).json({
    status: 'success',
    data: { userResults }
  });
});

// Update a quiz by ID
exports.updateQuiz = catchAsync(async (req, res, next) => {
  const { name, questions, timer } = req.body;
  const { id } = req.params;

  const quiz = await Quiz.findOneAndUpdate(
    {
      _id: id,
      createdBy: req.user.id
    },
    { name, questions, timer },
    { new: true }
  );

  if (!quiz) {
    return next(new AppError('Quiz does not exist, or you do not have permission to update it', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { quiz }
  });
});
