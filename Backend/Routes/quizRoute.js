const express = require('express');
const { addQuiz, getQuiz, getUsersQuizzes, deleteQuiz, attemptedQuiz, updateQuiz } = require('../Controllers/quizController');
const { auth } = require('../Controllers/authController');

const router = express.Router();

router
    .route('/')
    .post(auth,addQuiz)
    .get(auth, getUsersQuizzes);

router
    .route('/:id')
    .get(getQuiz)
    .patch(auth,updateQuiz)
    .delete(auth, deleteQuiz);

router.route('/attempt/:id').patch(attemptedQuiz);

module.exports = router;