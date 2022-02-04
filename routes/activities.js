const express = require('express');
const req = require('express/lib/request');
//const auth = require('../middleware/auth');
//const admin = require('../middleware/admin');
const router = express.Router();
const mongoose = require('mongoose');
const winston = require('winston');

const { Activity, validate } = require('../models/activity');
const { ActivityType, ActivityTypeSchema } = require('../models/activityType');

router.get('/', async (req, res) => {
  const object = await Activity.find();
  res.send(object);
});

router.get('/:id', async (req, res) => {
  const object = await Activity.findById(req.params.id).populate(
    'ActivityType'
  );
  if (!object) {
    return res
      .status(404)
      .send('The Activity with the given ID was not found.');
  }

  res.send(object);
});

router.post('/', async function (req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const activityType = await ActivityType.findById(
    req.body.activitytype
  ).exec();
  if (!activityType) {
    return res.status(400).send('ActivityType with given ID not found');
  }

  const activity = new Activity(req.body);

  activity.activityType = activityType;

  await activity.save();
  //activity.populate('activityType');
  res.send(activity);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const result = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!result)
      return res
        .status(404)
        .send('The Activity with the given ID was not found.');
    res.send(result);
  } catch (err) {
    console.log('Error ', err);
  }
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));

  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
});

router.delete('/:id', async (req, res) => {
  const activity = await Activity.findByIdAndRemove(req.params.id);

  if (!activity) {
    return res
      .status(404)
      .send('The Activity with the given ID was not found.');
  }

  res.send(activity);
});

module.exports = router;
