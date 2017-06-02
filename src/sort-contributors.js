const parse = require('parse-author');
const sortObject = require('sort-object-keys');
const orderBy = require('sort-order');

// Sort by a field in an object
const field = (name) => (...args) => {
  const [a, b] = args.map((obj) => obj[name]);
  if (a !== b) {
    return a < b ? -1 : 1;
  } else {
    return 0;
  }
};

module.exports = (key, packageJson, opts = {}) => {
  const contributors = (
    hydrate(packageJson[key])
      .map((user) => sortObject(user, ['name', 'email', 'url']))
      .sort(orderBy(field('name'), field('email')))
  );

  switch(contributors.length) {
    case 0:
      return {};
    case 1:
      if (!opts.enforceMultiple) {
        return { [key]: opts.expandUsers ? contributors[0] : stringify(contributors[0]) };
      }
    default:
      return { [key]: opts.expandUsers ? contributors : contributors.map(stringify) };
  }
};

function hydrate(input) {
  if (!input) {
    return [];
  } else if (Array.isArray(input)) {
    return input.reduce((state, item) => [...state, ...hydrate(item)], []);
  } else if (typeof input === 'object') {
    return [input];
  } else if (typeof input === 'string') {
    return [parse(input)];
  } else {
    return [];
  }
}

function stringify(user) {
  const name = user.name;
  const email = user.email ? `<${user.email}>` : undefined;
  const url = user.url ? `(${user.url})` : undefined;

  return [name, email, url].filter(Boolean).join(' ');
}
