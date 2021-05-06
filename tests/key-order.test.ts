import { format } from '../src';

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

test('It orders unspecified keys alphabetically at the end', () => {
  const json = {
    unknownPropertyB: false,
    unknownPropertyA: true,
    description: 'Description',
    version: '0.0.0',
    name: 'Test'
  };

  expect(format(json, { keyOrder: ['name', 'version', 'description'] })).toMatchSnapshot();
});

test('It orders keys using a custom key order function', () => {
  const json = {
    description: 'Description',
    version: '0.0.0',
    name: 'Test'
  };

  const keyOrder = (keyA: string, keyB: string) => {
    if (keyA === keyB) {
      return 0;
    } else {
      return keyA < keyB ? -1 : 1;
    }
  };

  expect(format(json, { keyOrder })).toMatchSnapshot();
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
