import { format } from '../src';

test('It orders dependencies in alphabetical order', () => {
  const json = {
    dependencies: {
        foo_bar: "3",
        g: "4",
        a: "1",
        "foo-bar": "2", // the "-" should be before the "_" to match `npm` sorting
    }
  };

  expect(format(json)).toMatchSnapshot();
});
