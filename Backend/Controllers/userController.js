const Quiz = require('../Models/QnAModel');
const Poll = require('../Models/pollModel');
const catchAsync = require('../utils/catchAsync');

exports.getTrendings = catchAsync(async (req, res) => {
    const userId = req.user.id;
    if(!userId) {
      console.log('no or incorrect userId');
      res.status(404).json({
        status:'invalid or no userId',
      })
    }
    const docs = await Quiz.aggregate([
      { $match: { createdBy: userId } },
      { $unionWith: { coll: 'polls', pipeline: [{ $match: { createdBy: userId } }] } },
      { $sort: { impressions: -1 } },
      { $limit: 10 } 
    ]);
  
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { docs }
    });
  });

  exports.getStats = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
  
    const [stats] = await Quiz.aggregate([
      { $match: { createdBy: userId } },
      {
        $facet: {
          quizzes: [
            {
              $group: {
                _id: null,
                totalQuizzes: { $sum: 1 },
                totalQuestions: { $sum: { $size: "$questions" } },
                totalImpressions: { $sum: "$impressions" }
              }
            }
          ],
          polls: [
            { $match: { createdBy: userId } }, // Aggregating polls from the "Poll" collection
            {
              $group: {
                _id: null,
                totalPolls: { $sum: 1 },
                totalQuestions: { $sum: { $size: "$questions" } },
                totalImpressions: { $sum: "$impressions" }
              }
            }
          ]
        }
      },
      {
        $project: {
          totalQuizzesAndPolls: {
            $sum: [
              { $arrayElemAt: ["$quizzes.totalQuizzes", 0] },
              { $arrayElemAt: ["$polls.totalPolls", 0] }
            ]
          },
          totalQuestions: {
            $sum: [
              { $arrayElemAt: ["$quizzes.totalQuestions", 0] },
              { $arrayElemAt: ["$polls.totalQuestions", 0] }
            ]
          },
          totalImpressions: {
            $sum: [
              { $arrayElemAt: ["$quizzes.totalImpressions", 0] },
              { $arrayElemAt: ["$polls.totalImpressions", 0] }
            ]
          }
        }
      }
    ]);
  
    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  });

exports.getUsersPollsAndQuizzes = catchAsync(async (req,res) => {
    const userId = req.user.id;

    const docs = await Quiz.aggregate([
        {$match: {createdBy: userId}},
        {
            $unionWith:{
                coll:'polls',
                pipeline:[{$match:{createdBy:userId}}]
            }
        },
        {$sort: {createdAt: -1}}
    ]);

    res.status(200).json({
        stats:'success',
        results: docs.length,
        data: {docs}
    });
});
  