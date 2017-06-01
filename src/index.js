
const defaults = require('./defaultOptions');
const sortObject = require('sort-object-keys');

function format(packageJson, opts) {
  const options = Object.assign({}, defaults, opts);
  return JSON.stringify(sortObject(packageJson, options.keyOrder), null, options.tabWidth);
}

module.exports = {
  format
};
