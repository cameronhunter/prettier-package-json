const { format } = require('../src');

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
