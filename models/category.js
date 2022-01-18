const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('./user');

const schema = {
  name: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
};

const object = new mongoose.model('Category', schema);

function validate(object) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    user: Joi.objectId().required(),
  });
  return schema.validate(object);
}

module.exports.Category = object;
module.exports.validate = validate;
module.exports.categorySchema = schema;
