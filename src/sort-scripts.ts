import type { PackageJson } from './types';

import orderBy from 'sort-order';
import sortObject from 'sort-object-keys';

type Scripts = PackageJson['scripts'];

const inbuiltScripts = ['install', 'pack', 'publish', 'restart', 'start', 'stop', 'test', 'uninstall', 'version'];

// Remove pre/post prefixes from script name
const removePrefix = (scripts: Scripts, arg: string, prefix?: 'pre' | 'post'): string | false => {
  if (prefix !== 'post' && arg === 'prepublishOnly') return 'publish';
  const base = arg.replace(new RegExp(`^(${prefix || 'pre|post'})`), '');
  return base !== arg && (scripts!.hasOwnProperty(base) || inbuiltScripts.includes(base)) ? base : false;
};

// Sort alphabetically by script name excluding pre/post prefixes
const scriptName = (scripts: Scripts, ...args: [string, string]): 1 | 0 | -1 => {
  const [a, b] = args.map((arg) => removePrefix(scripts, arg) || arg);
  return a === b ? 0 : a < b ? -1 : 1;
};

// Sort by pre, script, post
const prePostHooks = (scripts: Scripts, a: string, b: string): 1 | 0 | -1 => {
  if (removePrefix(scripts, a, 'pre') || removePrefix(scripts, b, 'post')) return -1;
  if (removePrefix(scripts, a, 'post') || removePrefix(scripts, b, 'pre')) return 1;
  return 0;
};

// Sort publish scripts in an opinionated order
const publishScripts = (...args: [string, string]): 1 | 0 | -1 => {
  const [a, b] = args.map((arg) => ['prepublish', 'prepublishOnly', 'publish', 'postpublish'].indexOf(arg));
  return a === -1 || b === -1 || a === b ? 0 : a < b ? -1 : 1;
};

const sortScripts = (scripts: Scripts = {}): { scripts?: Scripts } => {
  const order = orderBy<string>(
    (a, b) => scriptName(scripts, a, b),
    (a, b) => prePostHooks(scripts, a, b)
  );
  const keys = Object.keys(scripts) as Array<keyof Scripts>;
  return keys.length === 0 ? {} : { scripts: sortObject(scripts, keys.sort(order).sort(publishScripts)) };
};

export default sortScripts;
