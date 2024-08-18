const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function(val) {
        return this.password === val;
      },
      message: 'Passwords do not match'
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.comparePassword = async function(providedPassword) {
  return await bcrypt.compare(providedPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
