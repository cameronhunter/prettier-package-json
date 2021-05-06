import type { Author } from 'parse-author';
import type { PackageJson as PackageJsonTF } from 'type-fest';

export { Author };

export type PackageJson = PackageJsonTF & { $schema?: string };
export type PackageJsonKey = keyof PackageJson;

export type Options = Partial<{
  useTabs: boolean;
  tabWidth: number;
  expandUsers: boolean;
  enforceMultiple: boolean;
  keyOrder: PackageJsonKey[] | ((a: PackageJsonKey, b: PackageJsonKey) => -1 | 0 | 1);
}>;
