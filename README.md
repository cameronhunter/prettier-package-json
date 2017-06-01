# Prettier `package.json`

`prettier-package-json` is an opinionated JSON formatter inspired by `prettier`. It removes all original styling and ensures that the outputted `package.json` conforms to a consistent style.

## Usage

Install:

```sh
yarn add prettier-package-json --dev
```

You can install it globally if you like:

```sh
yarn global add prettier-package-json
```

_We're defaulting to yarn but you can use npm if you like:_

```sh
npm install [-g] prettier-package-json
```

### CLI

Run `prettier-package-json` through the CLI with this script. Run it without any arguments to see the options.

To format a file in-place, use `--write`. You may want to consider committing your file before doing that, just in case.

```sh
prettier-package-json [opts] [filename]
```

In practice, this may look something like:

```sh
prettier-package-json --write ./package.json
```

#### Pre-commit hook for changed files

You can use this with a pre-commit tool. This can re-format your files that are marked as "staged" via git add before you commit.

##### 1. [lint-staged](https://github.com/okonet/lint-staged)

Install it along with [husky](https://github.com/typicode/husky):

```bash
yarn add lint-staged husky --dev
```

and add this config to your `package.json`:

```json
{
  "scripts": {
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "package.json": [
      "prettier-package-json --write",
      "git add"
    ]
  }
}
```

See https://github.com/okonet/lint-staged#configuration for more details about how you can configure lint-staged.

##### 2. bash script

Alternately you can just save this script as `.git/hooks/pre-commit` and give it execute permission:

```bash
#!/bin/sh
packagejsonfiles=$(git diff --cached --name-only --diff-filter=ACM | grep 'package\.json$' | tr '\n' ' ')
[ -z "$packagejsonfiles" ] && exit 0

diffs=$(node_modules/.bin/prettier-package-json -l $packagejsonfiles)
[ -z "$diffs" ] && exit 0

echo "here"
echo >&2 "package.json files must be formatted with prettier-package-json. Please run:"
echo >&2 "node_modules/.bin/prettier-package-json --write "$diffs""

exit 1
```

### API

The API has two functions, exported as `format` and `check`. `format` usage is as follows:

```js
const prettier = require("prettier-package-json");

const options = {} // optional
prettier.format(source, options);
```

`check` checks to see if the file has been formatted with `prettier-package-json` given those options and returns a Boolean.
This is similar to the `--list-different` parameter in the CLI and is useful for running in CI scenarios.

### Options

Prettier ships with a handful of customizable format options, usable in both the CLI and API.

| Option | Default | CLI override | API override |
| ------------- | ------------- | ------------- | ------------- |
| **Tab Width** - Specify the number of spaces per indentation-level. | `2` | `--tab-width <int>` | `tabWidth: <int>` |
| **Tabs** - Indent lines with tabs instead of spaces. | `false` | `--use-tabs` | `useTabs: <bool>` |
| **Key Order** - Specify the order of keys. | See [default options](https://github.com/cameronhunter/prettier-package-json/blob/master/src/defaultOptions.js) | `--key-order` | `keyOrder: <comma,separated,list...>` |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
