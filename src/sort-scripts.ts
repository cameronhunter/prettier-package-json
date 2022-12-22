import sortObject from 'sort-object-keys';
import orderBy from 'sort-order';
import { PackageJson } from './types';

const PRE_OR_POST_PREFIX = /^(pre|post)/;
const NPM_RUN_ALL_SEPARATOR = /([:/])/;
const NPM_BUILTIN_SCRIPTS = ['install', 'prepare', 'pack', 'publish', 'restart', 'start', 'stop', 'test', 'version', 'uninstall'];

function parseScriptName(scripts: PackageJson['scripts'], script: string): { prefix: '' | 'pre' | 'post'; name: string } {
  if (script === 'prepublishOnly') return { prefix: 'pre', name: 'publish' };
  const prefixMatch = PRE_OR_POST_PREFIX.exec(script);
  const prefix = prefixMatch ? prefixMatch[0] as 'pre' | 'post' : '';
  const name = script.slice(prefix.length);
  if (scripts!.hasOwnProperty(name) || NPM_BUILTIN_SCRIPTS.includes(name)) return { prefix, name };
  return { prefix: '', name: script };
}

// Sort alphabetically by script name excluding pre/post prefixes
function scriptName(scripts: PackageJson['scripts']) {
  return function (a: string, b: string): 1 | 0 | -1 {
    const an = parseScriptName(scripts, a).name;
    const bn = parseScriptName(scripts, b).name;
    const aa = an.split(NPM_RUN_ALL_SEPARATOR);
    const bb = bn.split(NPM_RUN_ALL_SEPARATOR);
    const al = aa.length;
    const bl = bb.length;
    for (let i = 0; i < al || i < bl; i++) {
      if (aa[i] !== bb[i]) {
        return aa[i] < bb[i] ? -1 : 1;
      }
    }
    if (al !== bl) {
      return al < bl ? -1 : 1;
    }
    return 0;
  }
}

// Sort by pre, script, post
function prePostHooks(scripts: PackageJson['scripts']) {
  return function (a: string, b: string): 1 | 0 | -1 {
    const av = parseScriptName(scripts, a);
    const bv = parseScriptName(scripts, b);
    if (av.prefix === 'pre' || bv.prefix === 'post') {
      return -1;
    } else if (av.prefix === 'post' || bv.prefix === 'pre') {
      return 1;
    } else if (av.name !== bv.name) {
      return av.name < bv.name ? -1 : 1;
    }
    return 0;
  }
}

export default function sortScripts(scripts: PackageJson['scripts']): { scripts?: PackageJson['scripts'] } {
  const keys = Object.keys(scripts || {}) as Array<keyof PackageJson['scripts']>;
  const order = orderBy(scriptName(scripts), prePostHooks(scripts));
  return keys.length === 0 ? {} : { scripts: sortObject(scripts, keys.sort(order)) };
}
