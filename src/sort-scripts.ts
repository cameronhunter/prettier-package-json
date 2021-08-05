import sortObject from 'sort-object-keys';
import orderBy from 'sort-order';
import { PackageJson } from './types';

const checkPre = (arg: string, scripts: PackageJson['scripts']): boolean =>
  /^pre/.test(arg) && scripts!.hasOwnProperty(arg.substr(3));

const checkPost = (arg: string, scripts: PackageJson['scripts']): boolean =>
  /^post/.test(arg) && scripts!.hasOwnProperty(arg.substr(4));

// Sort alphabetically by script name excluding pre/post prefixes
function scriptName(this: PackageJson['scripts'], ...args: [string, string]): 1 | 0 | -1 {
  const [a, b] = args.map((arg) =>
    checkPre(arg, this) || checkPost(arg, this) ? arg.replace(/^(pre|post)/, '') : arg,
  );
  return a === b ? 0 : a < b ? -1 : 1;
}

// Sort by pre, script, post
function prePostHooks(this: PackageJson['scripts'], a: string, b: string): 1 | 0 | -1 {
  if (checkPre(a, this) || checkPost(b, this)) return -1;
  else if (checkPost(a, this) || checkPre(b, this)) return 1;
  return 0;
}

export default function sortScripts(scripts: PackageJson['scripts'] = {}): {
  scripts?: PackageJson['scripts'];
} {
  const order = orderBy(scriptName.bind(scripts), prePostHooks.bind(scripts));
  const keys = Object.keys(scripts) as never[];
  return keys.length === 0 ? {} : { scripts: sortObject(scripts, keys.sort(order)) };
}
