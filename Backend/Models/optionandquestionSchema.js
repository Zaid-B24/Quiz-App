const mongoose = require('mongoose');
const validator = require('validator');

const optionSchema = new mongoose.Schema({
    text: {
      type: String,
      required: function () {
        return this.optionsType === 'text' || this.optionsType === 'textAndImage';
      }
    },
    image: {
      type: String,
      validate: [validator.isURL, 'Enter a valid URL'],
      required: function () {
        return this.optionsType === 'image' || this.optionsType === 'textAndImage';
      }
    }
  });

  const questionSchema = new mongoose.Schema({
    question: {
      type: String,
      required: true
    },
    optionsType: {
      type: String,
      enum: ['text', 'image', 'textAndImage'],
      required: true
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: function (options) {
          return options.length >= 2 && options.length <= 4;
        },
        message: 'Options must be between 2 and 4'
      },
      required: true
    }
  });

  module.exports = {
    optionSchema,
    questionSchema
  };