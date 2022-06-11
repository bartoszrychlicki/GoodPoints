const express = require('express')
//const auth = require('../middleware/auth');
//const admin = require('../middleware/admin');
const router = express.Router()
const mongoose = require('mongoose')
const { Category } = require('../models/category')
const { User } = require('../models/user')
const { TaskType, validate } = require('../models/taskType')

router.get('/', async (req, res) => {
  // const taskType = await TaskType.find()

  const taskType = await TaskType.aggregate([
    {
      $lookup: {
        from: 'activitytypes',
        localField: '_id',
        foreignField: 'tasktype',
        as: 'activitytypes',
      },
    },
  ])
  res.send(taskType)
})

router.get('/:id', async (req, res) => {
  const taskType = await TaskType.findById(req.params.id).populate(
    'user',
    '-password'
  )
  if (!taskType) {
    return res.status(404).send('The taskType with the given ID was not found.')
  }

  res.send(taskType)
})

router.post('/', async function (req, res) {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const category = await Category.findById(req.body.category).exec()
  if (!category) {
    return res.status(400).send('Category with given ID not found')
  }

  //console.log(category)

  const taskType = new TaskType(req.body)
  taskType.category = category

  await taskType.save()

  res.send(taskType)
})

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const taskType = await TaskType.findById(req.params.id)
  if (!taskType) {
    return res
      .status(404)
      .send('The task type with the given ID was not found.')
  }
  // if (taskType.user != req.body.user) {
  //   return res.status(401).send('Trying to get task type for different user.')
  // }

  const category = await Category.findById(req.body.category).exec()
  if (!category) {
    return res.status(400).send('Category with given ID not found')
  }

  taskType.name = req.body.name
  taskType.category = category
  try {
    await taskType.save()
    res.send(taskType)
  } catch (err) {
    console.log('Error ', err)
  }
})

router.delete('/:id', async (req, res) => {
  const task = await TaskType.findByIdAndRemove(req.params.id)

  if (!task) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

  res.send(task)
})

module.exports = router
