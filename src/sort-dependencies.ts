import sortObject from 'sort-object-keys';
import { PackageJson } from './types';

function order(a: string, b: string) {
  return a.localeCompare(b, 'en');
}

export default function sortDependencies<
  TKey extends
    | 'bundledDependencies'
    | 'bundleDependencies'
    | 'dependencies'
    | 'devDependencies'
    | 'optionalDependencies'
    | 'peerDependencies'
>(key: TKey, packageJson: PackageJson) {
  const dependencies = packageJson[key];
  const keys = Object.keys(dependencies || {}) as Array<keyof typeof dependencies & string>;
  return keys.length === 0 ? {} : { [key]: sortObject(dependencies, keys.sort(order)) };
}
