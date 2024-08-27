const express = require('express');
const { getTrendings, getStats, getUsersPollsAndQuizzes } = require('../Controllers/userController');
const { auth } = require('../Controllers/authController');
const router = express.Router();


router.get('/trendings',auth, getTrendings);
router.get('/stats',auth, getStats);
router.get('/pollsandquizzes',auth, getUsersPollsAndQuizzes);

module.exports = router;
