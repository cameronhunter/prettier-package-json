import { format } from '../src';

test('It orders files in alphabetical order, directories first', () => {
  const json = {
    files: [
      'IMPORTANT.md',
      'lib/',
      'bin/'
    ]
  };

  expect(format(json)).toMatchSnapshot();
});

test('It orders files in alphabetical order, exclusions last', () => {
  const json = {
    files: [
      '!lib/**/*.test.js',
      'lib/',
      'bin/',
      '!bin/secret.text'
    ]
  };

  expect(format(json)).toMatchSnapshot();
});

test('It removes always excluded entries from files', () => {
  const json = {
    files: [
      'bin/',
      'lib/',
      'node_modules/',
      'package-lock.json'
    ]
  };

  expect(format(json)).toMatchSnapshot();
});

test('It removes always included entries from files', () => {
  const json = {
    files: [
      'bin/',
      'lib/',
      'package.json',
      'README.md'
    ]
  };

  expect(format(json)).toMatchSnapshot();
});
