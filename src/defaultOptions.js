module.exports = Object.freeze({
  useTabs: false,
  tabWidth: 2,
  expandUsers: false,
  keyOrder: [
    /**
     * Details
     */
    'private',
    'name',
    'description',
    'author',
    'contributors',
    'maintainers',
    'license',
    'homepage',
    'repository',
    'bugs',
    'version',

    /**
     * Configuration
     */
    'main',
    'man',
    'preferGlobal',
    'bin',
    'files',
    'directories',
    'scripts',
    'config',

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
