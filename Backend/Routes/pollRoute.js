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



router
  .route('/')
  .post(auth,addPoll)
  .get(auth,getUsersPolls);

router
  .route('/:id')
  .get(getPoll)
  .patch(auth,updatePoll)
  .delete(auth,deletePoll);
router.route('/attempt/:id').patch(attemptPoll);

module.exports = router;
