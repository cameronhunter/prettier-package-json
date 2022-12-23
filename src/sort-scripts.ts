import sortObject from 'sort-object-keys';
import orderBy from 'sort-order';
import { PackageJson } from './types';

const PRE_OR_POST_PREFIX = /^(pre|post)/;
const NPM_RUN_ALL_SEPARATOR = /([:/])/;
const NPM_BUILTIN_SCRIPTS = ['install', 'prepare', 'pack', 'publish', 'restart', 'start', 'stop', 'test', 'version', 'uninstall'];

interface ParsedScriptName {
  prefix?: 'pre' | 'post';

  /**
   * Base event name in the npm lifecycle. Often the string with prefix removed.
   * For example, for an input `preprettier:lint`, the base would be `prettier:lint`.
   */
  base: string;


  /**
   * The full original name of the script
   */
  original: string;
};

function parseScriptName(scripts: PackageJson['scripts'], original: string): ParsedScriptName {
  // prepublishOnly is a script whose base event is publish.
  // cf. https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-publish
  if (original === 'prepublishOnly') {
    return { prefix: 'pre', base: 'publish', original };
  }

  const prefixMatch = PRE_OR_POST_PREFIX.exec(original);
  const prefix = prefixMatch ? prefixMatch[0] as 'pre' | 'post' : undefined;
  const base = prefix ? original.slice(prefix.length) : original;

  if (scripts?.hasOwnProperty(base) || NPM_BUILTIN_SCRIPTS.includes(base)) {
    return { prefix, base, original };
  }

  return { prefix: undefined, base: original, original };
}

// Sort alphabetically by script name excluding pre/post prefixes
function scriptName(scripts: PackageJson['scripts']) {
  return function (a: string, b: string): 1 | 0 | -1 {
    const aParsed = parseScriptName(scripts, a);
    const bParsed = parseScriptName(scripts, b);

    // For example, for an input name `prettier:lint`, the segments would be `['prettier', ':', 'lint']`.
    // The segments contains separators. There are two types of separators, to determine their order.
    const aSegments = aParsed.base.split(NPM_RUN_ALL_SEPARATOR);
    const bSegments = bParsed.base.split(NPM_RUN_ALL_SEPARATOR);

    const aLength = aSegments.length;
    const bLength = bSegments.length;

    // Compare each segment, and when the strings are different, return 1 or -1 in alphabetical order.
    for (let i = 0; i < Math.min(aLength, bLength); i++) {
      if (aSegments[i] !== bSegments[i]) {
        return aSegments[i] < bSegments[i] ? -1 : 1;
      }
    }

    // Compare segments length, return 1 or -1 in ascending order of length.
    if (aLength !== bLength) {
      return aLength < bLength ? -1 : 1;
    }
    return 0;
  }
}

// Sort by pre, script, post
function prePostHooks(scripts: PackageJson['scripts']) {
  return function (a: string, b: string): 1 | 0 | -1 {
    const aParsed = parseScriptName(scripts, a);
    const bParsed = parseScriptName(scripts, b);
    if (aParsed.prefix === 'pre' || bParsed.prefix === 'post') {
      return -1;
    } else if (aParsed.prefix === 'post' || bParsed.prefix === 'pre') {
      return 1;
    } else if (aParsed.base !== bParsed.base) {
      return aParsed.base < bParsed.base ? -1 : 1;
    }
    return 0;
  }
}

export default function sortScripts(scripts: PackageJson['scripts']): { scripts?: PackageJson['scripts'] } {
  const keys = Object.keys(scripts || {}) as Array<keyof PackageJson['scripts']>;
  const order = orderBy(scriptName(scripts), prePostHooks(scripts));
  return keys.length === 0 ? {} : { scripts: sortObject(scripts, keys.sort(order)) };
}
