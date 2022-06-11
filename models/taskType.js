const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const mongoose = require('mongoose')
const User = require('./user')
const { Category, categorySchema } = require('./category')
const { ActivityType } = require('./activityType')

const schema = {
  name: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
  }),
  activityTypes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'activityType' },
  ],
}

const object = new mongoose.model('taskType', schema)

function validate(object) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    user: Joi.objectId().required(),
    category: Joi.objectId().required(),
  })
  return schema.validate(object)
}

module.exports.TaskType = object
module.exports.validate = validate
