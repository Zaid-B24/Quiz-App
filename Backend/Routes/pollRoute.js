const express = require('express');
const {
  getPoll,
  addPoll,
  getUsersPolls,
  deletePoll,
  updatePoll,
  attemptPoll
} = require('../Controllers/pollController');
const { auth } = require('../Controllers/authController');

const router = express.Router();

router.use(auth);

router
  .route('/')
  .post(addPoll)
  .get(getUsersPolls);

router
  .route('/:id')
  .get(getPoll)
  .patch(updatePoll)
  .delete(deletePoll);
router.route('/attempt/:id').patch(attemptPoll);

module.exports = router;
