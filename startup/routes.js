const express = require('express');
// requiring routes
const users = require('../routes/users');
const categories = require('../routes/categories');
const taskTypes = require('../routes/taskTypes');
const activityTypes = require('../routes/activityTypes');

// adding all the routes
module.exports = function (app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/categories', categories);
  app.use('/api/taskTypes', taskTypes);
  app.use('/api/activityTypes', activityTypes);
};
