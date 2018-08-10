const spawn = require('./__helpers__/spawn');
const path = require('path');

const bin = (command) => path.relative(process.cwd(), path.join(__dirname, '..', 'bin', command));
const fixture = (name) => path.relative(process.cwd(), path.join(__dirname, '__fixtures__', name));

const testCommand = (cmdline, cb) => {
  const [command, ...args] = cmdline.split(' ');
  const matcher = cb
      ? cb
      : (result) => expect(result).toMatchSnapshot();

  test(`${command} ${args.join(' ')}`, () => {
    return spawn(bin(command), args).then(matcher, matcher);
  });
};

testCommand(`prettier-package-json ${fixture('package-1.json')}`);
testCommand(`prettier-package-json --use-tabs ${fixture('package-1.json')}`);
testCommand(`prettier-package-json --tab-width 8 ${fixture('package-1.json')}`);
testCommand(`prettier-package-json ${fixture('package-*.json')}`);
testCommand(`prettier-package-json --list-different ${fixture('package-*.json')}`);
testCommand(`prettier-package-json --list-different ${fixture('missing.json')}`);
testCommand(`prettier-package-json --list-different ${fixture('invalid.json')}`,
  (result) => {
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/tests\/__fixtures__\/invalid\.json: Unexpected token t in JSON at position 6/);
});
