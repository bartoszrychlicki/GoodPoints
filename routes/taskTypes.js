const express = require('express');
//const auth = require('../middleware/auth');
//const admin = require('../middleware/admin');
const router = express.Router();
const mongoose = require('mongoose');
const { Category } = require('../models/category');
const { User } = require('../models/user');
const { TaskType, validate } = require('../models/taskType');

router.get('/', async (req, res) => {
  const taskType = await TaskType.find();
  res.send(taskType);
});

router.get('/:id', async (req, res) => {
  const taskType = await TaskType.findById(req.params.id).populate(
    'user',
    '-password'
  );
  if (!taskType) {
    return res
      .status(404)
      .send('The taskType with the given ID was not found.');
  }

  res.send(taskType);
});

router.post('/', async function (req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.category).exec();
  if (!category) {
    return res.status(400).send('Category with given ID not found');
  }

  console.log(category);

  const taskType = new TaskType(req.body);
  taskType.category = category;

  await taskType.save();

  res.send(taskType);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const result = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!result)
      return res
        .status(404)
        .send('The category with the given ID was not found.');
    res.send(result);
  } catch (err) {
    console.log('Error ', err);
  }
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));

  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
});

router.delete('/:id', async (req, res) => {
  const cateogry = await Cateogry.findByIdAndRemove(req.params.id);

  if (!cateogry) {
    return res.status(404).send('The genre with the given ID was not found.');
  }

  res.send(cateogry);
});

module.exports = router;
