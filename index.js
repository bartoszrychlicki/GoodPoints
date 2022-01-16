const express = require('express');
const app = express();
const debug = require('Debug')('GoodPoints:main');
const port = process.env.PORT || 3003;
const categories = require('./routes/categories');
const users = require('./routes/users');

const mongoose = require('mongoose');
try {
  mongoose.connect('mongodb://localhost/goodpoints');
  module.export = mongoose;
} catch (err) {
  debug('Cant connect to DB: ', err);
}

app.use(express.json());

// adding all the routes
app.use('/api/users', users);
app.use('/api/categories', categories);

app.listen(port, () => {
  debug('Listening on port:', port);
});
