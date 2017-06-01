
const defaults = require('./defaultOptions');
const sortObject = require('sort-object-keys');

function stringify(object, options) {
  const space = options.useTabs ? '\t' : options.tabWidth;
  return JSON.stringify(object, null, space);
}

function format(packageJson, opts) {
  const options = Object.assign({}, defaults, opts);
  return stringify(sortObject(packageJson, options.keyOrder), options);
}

function check(packageJson, opts) {
  try {
    const options = Object.assign({}, defaults, opts);
    const object = typeof packageJson === 'string' ? JSON.parse(packageJson) : packageJson;
    const formatted = format(object, options);
    return stringify(object, options) === formatted;
  } catch(e) {
    return false;
  }
}

module.exports = {
  format,
  check
};
