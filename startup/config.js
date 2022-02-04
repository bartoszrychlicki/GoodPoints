const config = require('config');
module.exports = function () {
  if (!config.get('db')) {
    throw new Error('No database connection string in config');
  }
};
