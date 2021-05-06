import { Options } from './types';

export const defaultOptions: Options = {
  useTabs: false,
  tabWidth: 2,
  expandUsers: false,
  keyOrder: [
    /**
     * Details
     */
    '$schema',
    'private',
    'name',
    'version',
    'description',
    'license',
    'author',
    'maintainers',
    'contributors',
    'homepage',
    'repository',
    'bugs',
    'type',

    /**
     * Configuration
     */
    'main',
    'module',
    'browser',
    'man',
    'preferGlobal',
    'bin',
    'files',
    'directories',
    'scripts',
    'config',
    'sideEffects',
    'types',
    'typings',

    /**
     * Yarn specific
     */
    'workspaces',
    'resolutions',

    /**
     * Dependencies
     */
    'dependencies',
    'bundleDependencies',
    'bundledDependencies',
    'peerDependencies',
    'optionalDependencies',
    'devDependencies',

    /**
     * Used for npm search
     */
    'keywords',

    /**
     * Constraints
     */
    'engines',
    'engineStrict',
    'os',
    'cpu',

    /**
     * Package publishing configuration
     */
    'publishConfig'
  ]
};
