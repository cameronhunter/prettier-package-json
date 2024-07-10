/**
 * Sort and filter files field
 *
 * More info:
 *   https://docs.npmjs.com/files/package.json#files
 */

import minimatch from 'minimatch';
import { PackageJson } from './types';

type FilterFn<T> = (...args: T[]) => boolean;

const not = <T>(filterFn: FilterFn<T>) => (arg: T) => !filterFn(arg); // prettier-ignore
const or = <T>(...filterFns: FilterFn<T>[]) => (arg: T) => filterFns.some((fn) => fn(arg)); // prettier-ignore

const ALWAYS_INCLUDED = [/^package.json$/, /^README.*/i, /^LICEN(C|S)E.*/i, /^copying.*/i]
  .map((regex) => (filepath: string) => regex.test(filepath))
  .reduce((a, b) => or(a, b));

const ALWAYS_EXCLUDED = [
  '.git',
  'CVS',
  '.svn',
  '.hg',
  '.lock-wscript',
  '.wafpickle-N',
  '.*.swp',
  '.DS_Store',
  '._*',
  'npm-debug.log',
  '.npmrc',
  'node_modules',
  'config.gypi',
  '*.orig',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml'
]
  .map((glob) => minimatch.filter(glob) as any as FilterFn<string>)
  .reduce((a, b) => or(a, b));

export default function sortFiles(packageJson: PackageJson): { files?: PackageJson['files'] } {
  const { files = [], main } = packageJson;

  const isPackageMain = (filepath: string) => filepath === main;
  const ignored = or(ALWAYS_INCLUDED, ALWAYS_EXCLUDED, isPackageMain);
  const directoriesFirst = (a: string, b: string) => {
    if (a.endsWith('/') && !b.endsWith('/')) {
      return -1;
    } else if (!a.endsWith('/') && b.endsWith('/')) {
      return 1;
    } else {
      return 0;
    }
  };
  const exclusionsLast = (a: string, b: string) => {
    if (a.startsWith('!') && !b.startsWith('!')) {
      return 1;
    } else if (!a.startsWith('!') && b.startsWith('!')) {
      return -1;
    } else {
      return 0;
    }
  };

  const sortedAndFilteredFiles = files.filter(not(ignored)).sort().sort(directoriesFirst).sort(exclusionsLast);

  return sortedAndFilteredFiles.length > 0 ? { files: sortedAndFilteredFiles } : {};
}
