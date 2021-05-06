import { cosmiconfigSync } from 'cosmiconfig';
import sortObject from 'sort-object-keys';
import { defaultOptions } from './defaultOptions';
import sortUsers from './sort-contributors';
import sortFiles from './sort-files';
import sortScripts from './sort-scripts';
import type { Options, PackageJson, PackageJsonKey } from './types';

export { Options };

export function format(packageJson: PackageJson, opts?: Options) {
  const options = getConfig(opts);

  const json = {
    ...packageJson,
    ...sortUsers('author', packageJson, opts),
    ...sortUsers('maintainers', packageJson, { ...opts, enforceMultiple: true }),
    ...sortUsers('contributors', packageJson, { ...opts, enforceMultiple: true }),
    ...sort('man', packageJson),
    ...sort('bin', packageJson),
    ...sortFiles(packageJson),
    ...sort('directories', packageJson),
    ...sortScripts(packageJson.scripts),
    ...sort('config', packageJson),
    ...sort('optionalDependencies', packageJson),
    ...sort('dependencies', packageJson),
    ...sort('bundleDependencies', packageJson),
    ...sort('bundledDependencies', packageJson),
    ...sort('peerDependencies', packageJson),
    ...sort('devDependencies', packageJson),
    ...sort('keywords', packageJson),
    ...sort('engines', packageJson),
    ...sort('os', packageJson),
    ...sort('cpu', packageJson),
    ...sort('publishConfig', packageJson)
  };

  return stringify(sortObject(json, options.keyOrder), options);
}

export function check(packageJson: string | PackageJson, opts: Options): boolean {
  try {
    const options = getConfig(opts);
    const object = typeof packageJson === 'string' ? JSON.parse(packageJson) : packageJson;
    const formatted = format(object, options);
    return stringify(object, options) === formatted;
  } catch (e) {
    return false;
  }
}

function getConfig(options?: Options): Options {
  const explorer = cosmiconfigSync('prettier-package-json');
  const result = explorer.search();
  return { ...defaultOptions, ...result?.config, ...options };
}

function stringify(object: object, options: Options): string {
  const space = options.useTabs ? '\t' : options.tabWidth;
  return JSON.stringify(object, null, space) + '\n';
}

function sort(key: PackageJsonKey, packageJson: PackageJson): PackageJson {
  const input = packageJson[key];

  if (Array.isArray(input)) {
    return input.length === 0 ? {} : { [key]: input.sort() };
  }

  if (typeof input === 'object') {
    const keys = Object.keys(input) as Array<keyof typeof input>;
    return keys.length === 0 ? {} : { [key]: sortObject(input, keys.sort()) };
  }

  return {};
}
