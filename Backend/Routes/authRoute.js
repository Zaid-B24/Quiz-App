
const express = require('express');
const { login, register } = require('../Controllers/authController');

const router = express.Router();



// // Middleware for Zod validation
// const validateSchema = (schema) => (req, res, next) => {
//   const result = schema.safeParse(req.body);
//   if (!result.success) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Validation failed',
//       errors: result.error.errors
//     });
//   }
//   next();
// };

router.get('/', (req, res) => {
  res.sendStatus(403);
});

// Use the validation middleware before the login controller
router.post('/login',  login);

router.post('/register', register);

module.exports = router;
