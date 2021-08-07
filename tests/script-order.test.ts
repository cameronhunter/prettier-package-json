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

test('It sorts scripts beginning with pre or post in alphabetical order if their base script is not present', () => {
  const json = {
    scripts: {
      prettify: 'prettify',
      prepublishOnly: 'prepublishOnly',
      prepare: 'prepare',
      postpublish: 'postpublish',
      parse: 'parse',
      postprettify: 'postprettify',
      prepublish: 'prepublish',
      prestart: 'prestart',
      preprettify: 'preprettify',
      poststop: 'poststop',
      start: 'start',
      'postcss:watch': 'postcss:watch',
      instant: 'instant',
      preinstall: 'preinstall'
    }
  };

  expect(format(json)).toMatchSnapshot();
});
