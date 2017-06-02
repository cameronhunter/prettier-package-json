const { format } = require('../src');

test('It orders keywords in alphabetical order', () => {
  const json = {
    keywords: ['c', 'a', 'b']
  };

  expect(format(json)).toMatchSnapshot();
});
