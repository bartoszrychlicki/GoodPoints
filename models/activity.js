const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const mongoose = require('mongoose');
const { ActivityType, ActivityTypeSchema } = require('./activityType');

const schema = {
  doneAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  activityType: {
    type: ActivityTypeSchema,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
};

const object = new mongoose.model('Activity', schema);

function validate(object) {
  const schema = Joi.object({
    activitytype: Joi.objectId().required(),
    description: Joi.string(),
  });
  return schema.validate(object);
}

module.exports.Activity = object;
module.exports.validate = validate;
