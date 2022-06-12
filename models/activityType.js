const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const mongoose = require('mongoose')
//const { TaskType } = require('./taskType')

const schema = {
  reward: { type: Number, required: true, min: 0, max: 100 },
  taskType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'taskType',
    required: true,
  },
  description: { type: String, required: true },
}

const object = new mongoose.model('activityType', schema)

function validate(object) {
  const schema = Joi.object({
    reward: Joi.number().min(0).max(100).required(),
    taskType: Joi.objectId().required(),
    description: Joi.string().required(),
  })
  return schema.validate(object)
}

module.exports.ActivityType = object
module.exports.validate = validate
module.exports.ActivityTypeSchema = schema
