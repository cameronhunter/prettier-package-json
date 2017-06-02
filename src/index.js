
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
    // 'author',
    // 'contributors',
    sort('man', packageJson),
    sort('bin', packageJson),
    sort('files', packageJson),
    sort('directories', packageJson),
    sortScripts(packageJson.scripts),
    sort('config', packageJson),
    sort('dependencies', packageJson),
    sort('bundledDependencies', packageJson),
    sort('peerDependencies', packageJson),
    sort('devDependencies', packageJson),
    sort('optionalDependencies', packageJson),
    sort('keywords', packageJson),
    sort('engines', packageJson),
    sort('os', packageJson),
    sort('cpu', packageJson),
    sort('publishConfig', packageJson)
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

function sort(key, packageJson) {
  const input = packageJson[key] || {};
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return {};
    } else {
      return { [key]: input.sort() };
    }
  } else if (typeof input === 'object') {
    const keys = Object.keys(input);
    if (keys.length === 0) {
      return {};
    } else {
      return { [key]: sortObject(input, keys.sort()) };
    }
  } else {
    return {};
  }
}

module.exports = {
  format,
  check
};
