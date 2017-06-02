const { format } = require('../src');

test('It orders contributors in alphabetical order', () => {
  const json = {
    contributors: [
      'Cameron <cameron@email.com> (https://cameronhunter.co.uk)',
      'Adam <adam@email.com>',
      'Barry'
    ]
  };

  expect(format(json)).toMatchSnapshot();
});

test('It expands users if requested', () => {
  const json = {
    author: 'Cameron <cameron@email.com> (https://cameronhunter.co.uk)',
    contributors: [
      'Adam <adam@email.com>',
      'Barry'
    ]
  };

  expect(format(json, { expandUsers: true })).toMatchSnapshot();
});
