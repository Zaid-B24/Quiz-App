const express = require('express');
const { addQuiz, getQuiz, getUsersQuizzes, deleteQuiz, attemptedQuiz, updateQuiz } = require('../Controllers/quizController');
const { auth } = require('../Controllers/authController');

const router = express.Router();
router.use(auth);
router
    .route('/')
    .post(addQuiz)
    .get(getUsersQuizzes);

router
    .route('/:id')
    .get(getQuiz)
    .patch(updateQuiz)
    .delete(deleteQuiz);

router.route('/attempt/:id').patch(attemptedQuiz);

module.exports = router;