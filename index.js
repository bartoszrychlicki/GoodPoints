const express = require('express');
require('express-async-errors');

const req = require('express/lib/request');
const app = express();
const winston = require('winston');

winston.remove(winston.transports.Console);
winston.configure({
  transports: [
    new winston.transports.File({
      filename: './logfile.log',
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
    new winston.transports.Console({
      name: 'c2',
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
  ],
});

const port = process.env.PORT || 3003;
require('./startup/config')();

require('./startup/prod')(app);
require('./startup/db')();
require('./startup/routes')(app);

app.listen(port, () => {
  winston.info('Listening on port:', port);
});
