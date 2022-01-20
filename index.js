const express = require('express');
const app = express();
const winston = require('winston');
const port = process.env.PORT || 3003;

//winston.add(winston.transports.File, { filename: './logfile.log' });

require('./startup/db')();
require('./startup/routes')(app);

app.listen(port, () => {
  winston.info('Listening on port:', port);
});
