
const defaults = require('./defaultOptions');
const sortObject = require('sort-object-keys');

function format(packageJson, opts) {
  const options = Object.assign({}, defaults, opts);
  const space = options.useTabs ? '\t' : options.tabWidth;
  return JSON.stringify(sortObject(packageJson, options.keyOrder), null, space);
}

function check(stringifiedPackageJson, opts) {
  try {
    const formatted = format(JSON.parse(packageJson), opts);
    return stringifiedPackageJson === formatted;
  } catch(e) {
    return false;
  }
}

module.exports = {
  format,
  check
};
