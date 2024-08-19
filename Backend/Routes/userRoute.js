const express = require('express');
const { getTrendings, getStats, getUsersPollsAndQuizzes } = require('../Controllers/userController');
const { auth } = require('../Controllers/authController');
const router = express.Router();
router.use(auth);

router.get('/trendings', getTrendings);
router.get('/stats', getStats);
router.get('/pollsandquizzes', getUsersPollsAndQuizzes);

module.exports = router;
