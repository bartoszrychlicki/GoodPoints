const auth = require('../middleware/auth')
const express = require('express')
//const auth = require('../middleware/auth');
//const admin = require('../middleware/admin');
const router = express.Router()
const mongoose = require('mongoose')

const { TaskType } = require('../models/taskType')
const { ActivityType, validate } = require('../models/activityType')
const winston = require('winston')

router.get('/', auth, async (req, res) => {
  const object = await ActivityType.find().populate('taskType')
  res.send(object)
})

router.get('/:id', auth, async (req, res) => {
  const object = await ActivityType.findById(req.params.id).populate('TaskType')
  if (!object) {
    return res
      .status(404)
      .send('The activityType with the given ID was not found.')
  }

  res.send(object)
})

router.post('/', auth, async function (req, res) {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const taskType = await TaskType.findById(req.body.taskType).exec()

  if (!taskType) {
    return res.status(400).send('TaskType with given ID not found')
  }

  const activityType = new ActivityType(req.body)
  activityType.tasktype = taskType

  await activityType.save()

  res.send(activityType)
})

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const result = await ActivityType.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    if (!result)
      return res
        .status(404)
        .send('The activitytype with the given ID was not found.')
    res.send(result)
  } catch (err) {
    console.log('Error ', err)
  }
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));

  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
})

router.delete('/:id', auth, async (req, res) => {
  const activityType = await ActivityType.findByIdAndRemove(req.params.id)

  if (!activityType) {
    return res
      .status(404)
      .send('The ActivityType with the given ID was not found.')
  }

  res.send(activityType)
})

module.exports = router
