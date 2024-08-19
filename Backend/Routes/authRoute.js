
const express = require('express');
const { login, register } = require('../Controllers/authController');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendStatus(403);  
});

router.post('/login', login);  

router.post('/register', register);

module.exports = router;
