const { format } = require('../src');

test('It orders keys using the default key order', () => {
  const json = {
    description: 'Description',
    version: '0.0.0',
    name: 'Test'
  };

  expect(format(json)).toMatchSnapshot();
});

test('It orders keys using the specified key order', () => {
  const json = {
    description: 'Description',
    version: '0.0.0',
    name: 'Test'
  };

  expect(format(json, { keyOrder: ['name', 'version', 'description'] })).toMatchSnapshot();
});

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
