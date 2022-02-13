const express = require('express')
const error = require('../middleware/error')

const cors = require('cors')
const corsOptions = {
  exposedHeaders: ['Authorization', 'x-auth-token'],
}
// requiring routes
const users = require('../routes/users')
const categories = require('../routes/categories')
const taskTypes = require('../routes/taskTypes')
const activityTypes = require('../routes/activityTypes')
const activities = require('../routes/activities')

// adding all the routes
module.exports = function (app) {
  app.use(cors(corsOptions))

  app.use(express.json())
  app.use('/api/users', users)
  app.use('/api/categories', categories)
  app.use('/api/taskTypes', taskTypes)
  app.use('/api/activityTypes', activityTypes)
  app.use('/api/activities', activities)

  // error handling in middleware function
  app.use(error)
}
