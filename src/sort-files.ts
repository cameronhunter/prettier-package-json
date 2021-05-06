/**
 * Sort and filter files field
 *
 * More info:
 *   https://docs.npmjs.com/files/package.json#files
 */

import minimatch from 'minimatch';
import { PackageJson } from './types';

type FilterFn<T> = (...args: T[]) => boolean;

const not = <T>(filterFn: FilterFn<T>) => (arg: T) => !filterFn(arg);
const or = <T>(...filterFns: FilterFn<T>[]) => (arg: T) => filterFns.some((fn) => fn(arg));

const ALWAYS_INCLUDED = [
  /^package.json$/,
  /^README.*/i,
  /^CHANGE(S|LOG).*/i,
  /^HISTORY.*/i,
  /^LICEN(C|S)E.*/i,
  /^NOTICE.*/i
]
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
  'package-lock.json'
]
  .map((glob) => (minimatch.filter(glob) as any) as FilterFn<string>)
  .reduce((a, b) => or(a, b));

export default function sortFiles(packageJson: PackageJson): { files?: PackageJson['files'] } {
  const { files = [], main } = packageJson;

  const isPackageMain = (filepath: string) => filepath === main;
  const ignored = or(ALWAYS_INCLUDED, ALWAYS_EXCLUDED, isPackageMain);

  const sortedAndFilteredFiles = files.filter(not(ignored)).sort();

  return sortedAndFilteredFiles.length > 0 ? { files: sortedAndFilteredFiles } : {};
}
