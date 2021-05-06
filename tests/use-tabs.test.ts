import { format } from '../src/index';

test('It indents using spaces (default)', () => {
  const json = {
    name: 'Test',
    description: 'Description',
    version: '0.0.0'
  };

  expect(format(json)).toMatchSnapshot();
});

test('It indents using tabs', () => {
  const json = {
    name: 'Test',
    description: 'Description',
    version: '0.0.0'
  };

  expect(format(json, { useTabs: true })).toMatchSnapshot();
});
