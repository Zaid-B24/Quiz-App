const Quiz = require('../Models/QnAModel');
const Poll = require('../Models/pollModel');
const catchAsync = require('../utils/catchAsync');

exports.getTrendings = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id });
  const polls = await Poll.find({ createdBy: req.user.id });
  console.log("this is quiz ",quizzes);
  console.log("this is poll",polls);
  
  

  const docs = [...quizzes, ...polls];

  docs.sort((a, b) => b.impressions - a.impressions);

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: { docs }
  });
});

exports.getStats = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id });
  const polls = await Poll.find({ createdBy: req.user.id });
  console.log("this is quiz ",quizzes);
  console.log("this is poll",polls);

  const stats = {};
  stats.totalQuizzesAndPolls = quizzes.length + polls.length;

  let totalQuizzesQuestions = 0;
  let totalPollsQuestions = 0;

  quizzes.forEach(quiz => {
    totalQuizzesQuestions += quiz.questions.length;
  });

  polls.forEach(poll => {
    totalPollsQuestions += poll.questions.length;
  });

  stats.totalQuestions = totalPollsQuestions + totalQuizzesQuestions;

  let totalPollImpressions = 0;
  let totlaQuizImpressions = 0;

  quizzes.forEach(quiz => {
    totlaQuizImpressions += quiz.impressions;
  });

  polls.forEach(poll => {
    totalPollImpressions += poll.impressions;
  });

  stats.totalImpressions = totalPollImpressions + totlaQuizImpressions;

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});

exports.getUsersPollsAndQuizzes = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id });
  const polls = await Poll.find({ createdBy: req.user.id });

  const userDocs = [...quizzes, ...polls];

  const docs = userDocs.sort((a, b) => {
    const createdAtA = new Date(a.createdAt).getTime();
    const createdAtB = new Date(b.createdAt).getTime();
    return createdAtB - createdAtA;
  });

  console.log(docs);

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: { docs }
  });
});