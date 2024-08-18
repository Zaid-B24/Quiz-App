const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const quizRouter = require('./Routes/quizRoute');
const pollRouter = require('./Routes/pollRoute');
const userRouter = require('./Routes/userRoute');

const app = express();

app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again after an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.status(200).json('Welcome to the quizze server!');
});

app.use('/api/v1/quizzes', quizRouter);
app.use('/api/v1/polls', pollRouter);
app.use('/api/v1/users', userRouter);


app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;
