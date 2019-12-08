module.exports = Object.freeze({
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
    'description',
    'license',
    'author',
    'maintainers',
    'contributors',
    'homepage',
    'repository',
    'bugs',
    'version',
    'type',

    /**
     * Yarn specific
     */
    'workspaces',

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
     * Dependencies
     */
    'optionalDependencies',
    'dependencies',
    'bundleDependencies',
    'bundledDependencies',
    'peerDependencies',
    'devDependencies',

    /**
     * Used for npm search
     */
    'keywords',

    /**
     * Constraints
     */
    'engines',
    'engine-strict',
    'engineStrict',
    'os',
    'cpu',

    /**
     * Package publishing configuration
     */
    'publishConfig'
  ]
});
