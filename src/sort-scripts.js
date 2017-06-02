const sortObject = require('sort-object-keys');
const orderBy = require('sort-order');

const PRE_OR_POST_PREFIX = /^(pre|post)/;

// Sort alphabetically by script name excluding pre/post prefixes
function scriptName(...args) {
  const [a, b] = args.map((arg) => arg.replace(PRE_OR_POST_PREFIX, ''));
  if (a !== b) {
    return a < b ? -1 : 1;
  } else {
    return 0;
  }
}

// Sort by pre, script, post
function prePostHooks(a, b) {
  if (a.startsWith('pre') || b.startsWith('post')) {
    return -1;
  } else if (a.startsWith('post') || b.startsWith('pre')) {
    return 1;
  } else {
    return 0;
  }
}

const order = orderBy(scriptName, prePostHooks);

module.exports = function sortScripts(scripts = {}) {
  const keys = Object.keys(scripts);
  if (keys.length === 0) {
    return {};
  } else {
    return { scripts: sortObject(scripts, keys.sort(order)) };
  }
};
