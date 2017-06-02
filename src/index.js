
const defaults = require('./defaultOptions');
const sortObject = require('sort-object-keys');
const sortScripts = require('./sort-scripts');
const sortKeywords = require('./sort-keywords');

function stringify(object, options) {
  const space = options.useTabs ? '\t' : options.tabWidth;
  return JSON.stringify(object, null, space);
}

function format(packageJson, opts) {
  const options = Object.assign({}, defaults, opts);

  const json = Object.assign(
    {},
    packageJson,
    sortScripts(packageJson.scripts),
    sortKeywords(packageJson.keywords)
  );

  return stringify(sortObject(json, options.keyOrder), options);
}

function check(packageJson, opts) {
  try {
    const options = Object.assign({}, defaults, opts);
    const isString = typeof packageJson === 'string';
    const object = isString ? JSON.parse(packageJson) : packageJson;
    const original = isString ? packageJson : stringify(object, options);
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
