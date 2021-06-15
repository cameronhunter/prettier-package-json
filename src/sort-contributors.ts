import parse from 'parse-author';
import sortObject from 'sort-object-keys';
import orderBy from 'sort-order';
import { Author, Options, PackageJson } from './types';

// prettier-ignore
// Sort by a field in an object
const field = <TType extends object>(name: keyof TType) => (...args: [TType, TType]) => {
  const [a, b] = args.map((obj) => obj[name]);
  if (a !== b) {
    return a < b ? -1 : 1;
  } else {
    return 0;
  }
};

export default function sortContributors<TKey extends 'author' | 'contributors' | 'maintainers'>(
  key: TKey,
  packageJson: PackageJson,
  opts: Options = {}
) {
  const sortByName = field<Author>('name');
  const sortByEmail = field<Author>('email');

  const contributors = hydrate(packageJson[key])
    .map((user) => sortObject(user, ['name', 'email', 'url']))
    .sort(orderBy(sortByName, sortByEmail));

  switch (contributors.length) {
    case 0:
      return {};
    case 1:
      if (!opts.enforceMultiple) {
        return { [key]: opts.expandUsers ? contributors[0] : stringify(contributors[0]) };
      }
    default:
      return { [key]: opts.expandUsers ? contributors : contributors.map(stringify) };
  }
}

function hydrate(input: undefined | string | Author | Array<string | Author>): Author[] {
  if (!input) {
    return [];
  } else if (Array.isArray(input)) {
    return input.reduce((state, item) => [...state, ...hydrate(item)], [] as Author[]);
  } else if (typeof input === 'object') {
    return [input];
  } else if (typeof input === 'string') {
    return [parse(input)];
  } else {
    return [];
  }
}

function stringify(user: Author): string {
  const name = user.name;
  const email = user.email ? `<${user.email}>` : undefined;
  const url = user.url ? `(${user.url})` : undefined;

  return [name, email, url].filter(Boolean).join(' ');
}
