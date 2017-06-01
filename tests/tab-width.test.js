const { format } = require('../src');

test('It indents using a default tab width', () => {
  const json = {
    name: 'Test',
    description: 'Description',
    version: '0.0.0'
  };

  expect(format(json)).toMatchSnapshot();
});

test('It indents using the specified tab width', () => {
  const json = {
    name: 'Test',
    description: 'Description',
    version: '0.0.0'
  };

  expect(format(json, { tabWidth: 4 })).toMatchSnapshot();
});
