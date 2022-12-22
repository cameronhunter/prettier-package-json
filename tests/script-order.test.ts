import { format } from '../src';

test('It orders scripts in alphabetical order, keeping pre and post scripts beside their counterparts', () => {
  const json = {
    scripts: {
      test: 'test',
      pretest: 'pretest',
      version: 'version',
      postversion: 'postversion',
      build: 'build'
    }
  };

  expect(format(json)).toMatchSnapshot();
});

test('It orders scripts with separators in alphabetical order', () => {
  const json = {
    scripts: {
      dev: 'dev',
      test: 'test',
      lint: 'lint',
      'lint:foo': 'lint:foo',
      'lint:bar': 'lint:bar',
      'lint-fix': 'lint-fix',
      'lint-fix:baz': 'lint-fix:baz',
      'lint-fix:qux': 'lint-fix:qux'
    }
  };

  expect(format(json)).toMatchSnapshot();
});
