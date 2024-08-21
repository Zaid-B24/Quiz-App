const Poll = require('../Models/pollModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get a poll by ID and increment impressions
exports.getPoll = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const poll = await Poll.findByIdAndUpdate(
    id,
    { $inc: { impressions: 1 } }, // Atomic increment
    { new: true } // Return updated document
  );

  if (!poll) {
    return next(new AppError('Poll not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { poll }
  });
});

// Get all polls created by the logged-in user
exports.getUsersPolls = catchAsync(async (req, res) => {
  const polls = await Poll.find({ createdBy: req.user.id });

  res.status(200).json({
    status: 'success',
    results: polls.length,
    data: { polls }
  });
});
exports.addPoll = catchAsync(async (req, res, next) => {
  const { name, questions } = req.body;

  // Validate that name and questions are provided and questions is an array
  if (!name || !Array.isArray(questions) || questions.length === 0) {
    return next(new AppError('Name and a non-empty questions array must be provided', 400));
  }

  // Validate each question
  for (const question of questions) {
    // Check if each question has text and a non-empty options array
    if (!question.question || !Array.isArray(question.options) || question.options.length === 0) {
      return next(new AppError('Each question must have text and a non-empty options array', 400));
    }
    
    // Validate options
    for (const option of question.options) {
      // Validate if the options match the optionsType
      if (question.optionsType === 'text' && !option.text) {
        return next(new AppError('Text option is required when optionsType is text', 400));
      }
      if (question.optionsType === 'image' && !option.image) {
        return next(new AppError('Image option is required when optionsType is image', 400));
      }
      if (question.optionsType === 'textAndImage') {
        // Either text or image should be provided
        if (!option.text && !option.image) {
          return next(new AppError('Either text or image is required when optionsType is textAndImage', 400));
        }
      }
    }
  }

  // Create the poll
  const poll = await Poll.create({
    name,
    questions,
    createdBy: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    data: { poll }
  });
});


// exports.addPoll = catchAsync(async (req, res, next) => {
//   const { name, questions } = req.body;
//   if (!name || !Array.isArray(questions) || questions.length === 0) {
//     return next(new AppError('Name and a non-empty questions array must be provided', 400));
//   }

//   for (const question of questions) {
//     if (!question.text || !Array.isArray(question.options) || question.options.length === 0) {
//       return next(new AppError('Each question must have text and a non-empty options array', 400));
//     }
//   }

//   const poll = await Poll.create({
//     name,
//     questions,
//     createdBy: req.user.id,
//   });

  
//   res.status(200).json({
//     status: 'success',
//     data: { poll }
//   });
// });


// Update a poll (only by its creator)
exports.updatePoll = catchAsync(async (req, res, next) => {
  const { name, questions } = req.body;
  const { id } = req.params;

  const poll = await Poll.findOneAndUpdate(
    {
      _id: id,
      createdBy: req.user._id // Ensure only the creator can update
    },
    { name, questions },
    { new: true, runValidators: true } // Return updated document with validation
  );

  if (!poll) {
    return next(
      new AppError("Poll not found, or you don't have permission to edit it", 403)
    );
  }

  res.status(200).json({
    status: 'success',
    data: { poll }
  });
});

// Attempt a poll and record responses
exports.attemptPoll = catchAsync(async (req, res, next) => {
  const { results } = req.body;
  const { id } = req.params;

  if (!results || !Array.isArray(results)) {
    return next(new AppError('Please provide valid results', 400));
  }

  const poll = await Poll.findById(id);

  if (!poll) {
    return next(new AppError('Poll not found', 404));
  }

  results.forEach(el => {
    const question = poll.questions.find(q => q._id.toString() === el.questionId);

    if (!question) {
      return next(new AppError('Question not found', 400));
    }

    if (el.selectedOption >= question.options.length) {
      return next(new AppError('Invalid option selected', 400));
    }

    question.options[el.selectedOption].votes += 1;
  });

  await poll.save(); // Save after all updates

  res.status(200).json({
    status: 'success',
    data: { poll }
  });
});

// Delete a poll (only by its creator)
exports.deletePoll = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const poll = await Poll.findOneAndDelete({
    _id: id,
    createdBy: req.user._id // Ensure only the creator can delete
  });

  if (!poll) {
    return next(
      new AppError(
        "No poll found with this ID, or you don't have permission to delete it.",
        404
      )
    );
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
