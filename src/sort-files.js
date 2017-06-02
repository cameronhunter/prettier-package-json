/**
 * Sort and filter files field
 *
 * More info:
 *   https://docs.npmjs.com/files/package.json#files
 */

const sortObject = require('sort-object-keys');
const orderBy = require('sort-order');
const minimatch = require('minimatch');

const not = (filterFn) => (...args) => !filterFn(...args);
const or = (...filterFns) => (...args) => filterFns.some((fn) => fn(...args));

const ALWAYS_INCLUDED = [
  /^package.json$/,
  /^README.*/i,
  /^CHANGE(S|LOG).*/i,
  /^HISTORY.*/i,
  /^LICEN(C|S)E.*/i,
  /^NOTICE.*/i
].map((regex) => {
  return (filepath) => regex.test(filepath);
}).reduce((a, b) => {
  return or(a, b);
});

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
].map((glob) => {
  return minimatch.filter(glob);
}).reduce((a, b) => {
  return or(a, b);
});

module.exports = function sortFiles(packageJson) {
  const { files = [], main } = packageJson;

  const isPackageMain = (filepath) => filepath === main;
  const ignored = or(ALWAYS_INCLUDED, ALWAYS_EXCLUDED, isPackageMain);

  const sortedAndFilteredFiles = files.filter(not(ignored)).sort();

  return sortedAndFilteredFiles.length > 0 ? { files: sortedAndFilteredFiles } : {};
};
