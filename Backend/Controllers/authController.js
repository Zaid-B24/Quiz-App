const jwt = require('jsonwebtoken');
const User = require('../Models/userSchema');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Email or password is incorrect', 400));
  }

  const token = getToken({ id: user.id });

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});

exports.register = catchAsync(async(req,res) => {
    const {name, email, password, confirmPassword} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        confirmPassword
    });
    res.status(200).send({
        message: 'Success',
        data: { user }
    });
});

exports.auth = catchAsync(async (req, res, next) => {
    if (!req.headers.authorization) {
      return next(
        new AppError('You are not authorized to access this resource.', 403)
      );
    }
  
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.JWT_EXPIRY)
    const user = await User.findOne({ _id: decoded.id });
  
    if (!user) {
      return next(new AppError('User not found', 400));
    }
  
    req.user = user;
  
    next();
  });
