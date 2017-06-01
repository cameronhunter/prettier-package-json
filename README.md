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
| **Print Width** - Specify the length of line that the printer will wrap on.<br /><br /><strong>We strongly recommend against using more than 80 columns</strong>. Prettier works by craming as much content as possible until it reaches the limit, which happens to work well for 80 columns but makes lines that are very crowded. When a bigger column count is used in styleguides, it usually means that code is allowed to go beyond 80 columns, but not to make every single line go there, like prettier would do.  | `80` | `--print-width <int>`  | `printWidth: <int>`
| **Tab Width** - Specify the number of spaces per indentation-level. | `2` | `--tab-width <int>` | `tabWidth: <int>` |
| **Tabs** - Indent lines with tabs instead of spaces. | `false` | `--use-tabs` | `useTabs: <bool>` |
| **Semicolons** - Print semicolons at the ends of statements.<br /><br />Valid options: <br /> - `true` - add a semicolon at the end of every statement <br /> - `false` - only add semicolons at the beginning of lines that may introduce ASI failures | `true` | `--no-semi` | `semi: <bool>` |
| **Quotes** - Use single quotes instead of double quotes. | `false` | `--single-quote` | `singleQuote: <bool>` |
| **Trailing Commas** - Print trailing commas wherever possible.<br /><br />Valid options: <br /> - `"none"` - no trailing commas <br /> - `"es5"` - trailing commas where valid in ES5 (objects, arrays, etc) <br /> - `"all"`  - trailing commas wherever possible (function arguments). This requires node 8 or a [transform](https://babeljs.io/docs/plugins/syntax-trailing-function-commas/). | `"none"` | <code>--trailing-comma <none&#124;es5&#124;all></code> | <code>trailingComma: "<none&#124;es5&#124;all>"</code> |
| **Bracket Spacing** - Print spaces between brackets in object literals.<br /><br />Valid options: <br /> - `true` - Example: `{ foo: bar }` <br /> - `false` - Example: `{foo: bar}` | `true` | `--no-bracket-spacing` | `bracketSpacing: <bool>` |
| **JSX Brackets on Same Line** - Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line | `false` | `--jsx-bracket-same-line` | `jsxBracketSameLine: <bool>` |
| **Range Start** - Format code starting at a given character offset. The range will extend backwards to the start of the first line containing the selected statement. | `0` | `--range-start <int>` | `rangeStart: <int>` |
| **Range End** - Format code ending at a given character offset (exclusive). The range will extend forwards to the end of the selected statement. | `Infinity` | `--range-end <int>` | `rangeEnd: <int>` |
| **Parser** - Specify which parser to use. Both parsers support the same set of JavaScript features (including Flow). You shouldn't have to change this setting. | `babylon` | <code>--parser <flow&#124;babylon></code> | <code>parser: "<flow&#124;babylon&#124;postcss&#124;typescript>"</code> |
| **Filepath** - Specify the input filepath this will be used to do parser inference.<br /><br /> Example: <br />`cat foo \| prettier --stdin-filepath foo.css`<br /> will default to use `postcss` parser |  | `--stdin-filepath` | `filepath: <string>` |

### Excluding code from formatting

A JavaScript comment of `// prettier-ignore` will exclude the next node in the abstract syntax tree from formatting.

For example:

```js
matrix(
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
)

// prettier-ignore
matrix(
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
)
```

will be transformed to:

```js
matrix(1, 0, 0, 0, 1, 0, 0, 0, 1);

// prettier-ignore
matrix(
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
)
```

## Editor Integration

### Atom

Atom users can simply install the [prettier-atom](https://github.com/prettier/prettier-atom) package and use
`Ctrl+Alt+F` to format a file (or format on save if enabled).

### Emacs

Emacs users should see [this directory](https://github.com/prettier/prettier/tree/master/editors/emacs)
for on-demand formatting.

### Vim

Add [sbdchd](https://github.com/sbdchd)/[neoformat](https://github.com/sbdchd/neoformat) to your list based on the tool you use:

```vim
Plug 'sbdchd/neoformat'
```

Then make Neoformat run on save:

```vim
autocmd BufWritePre *.js Neoformat
```

#### Other `autocmd` events

You can also make Vim format your code more frequently, by setting an `autocmd` for other events. Here are a couple of useful ones:

* `TextChanged`: after a change was made to the text in Normal mode
* `InsertLeave`: when leaving Insert mode

For example, you can format on both of the above events together with `BufWritePre` like this:

```vim
autocmd BufWritePre,TextChanged,InsertLeave *.js Neoformat
```

See `:help autocmd-events` in Vim for details.

#### Customizing Prettier in Vim

If your project requires settings other than the default Prettier settings, you can pass arguments to do so in your `.vimrc` or [vim project](http://vim.wikia.com/wiki/Project_specific_settings), you can do so:

```vim
autocmd FileType javascript setlocal formatprg=prettier\ --stdin\ --parser\ flow\ --single-quote\ --trailing-comma\ es5
" Use formatprg when available
let g:neoformat_try_formatprg = 1
```

Each option needs to be escaped with `\`.

#### Running Prettier manually in Vim

If you need a little more control over when prettier is run, you can create a
custom key binding. In this example, `gp` (mnemonic: "get pretty") is used to
run prettier (with options) in the currently active buffer:

```vim
nnoremap gp :silent %!prettier --stdin --trailing-comma all --single-quote<CR>
```

### Visual Studio Code

Can be installed using the extension sidebar. Search for `Prettier - JavaScript formatter`.

Can also be installed using `ext install prettier-vscode`.

[Check its repository for configuration and shortcuts](https://github.com/esbenp/prettier-vscode)

### Visual Studio

Install the [JavaScript Prettier extension](https://github.com/madskristensen/JavaScriptPrettier).

### Sublime Text

Sublime Text support is available through Package Control and
the [JsPrettier](https://packagecontrol.io/packages/JsPrettier) plug-in.

### WebStorm

See the [WebStorm
guide](https://github.com/jlongster/prettier/tree/master/editors/webstorm/README.md).

## Language Support

Prettier attempts to support all JavaScript language features,
including non-standardized ones. By default it uses the
[Babylon](https://github.com/babel/babylon) parser with all language
features enabled, but you can also use the
[Flow](https://github.com/facebook/flow) parser with the
`parser` API or `--parser` CLI [option](#options).

All of JSX and Flow syntax is supported. In fact, the test suite in
`tests` *is* the entire Flow test suite and they all pass.

## Related Projects

- [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier) plugs Prettier into your ESLint workflow
- [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) turns off all ESLint rules that are unnecessary or might conflict with Prettier
- [`prettier-eslint`](https://github.com/prettier/prettier-eslint)
passes `prettier` output to `eslint --fix`
- [`prettier-standard`](https://github.com/sheerun/prettier-standard)
uses `prettier` and `prettier-eslint` to format code with standard rules
- [`prettier-standard-formatter`](https://github.com/dtinth/prettier-standard-formatter)
passes `prettier` output to `standard --fix`
- [`prettier-miscellaneous`](https://github.com/arijs/prettier-miscellaneous)
`prettier` with a few minor extra options
- [`neutrino-preset-prettier`](https://github.com/SpencerCDixon/neutrino-preset-prettier) allows you to use Prettier as a Neutrino preset
- [`prettier_d`](https://github.com/josephfrazier/prettier_d.js) runs Prettier as a server to avoid Node.js startup delay
- [`Prettier Bookmarklet`](https://prettier.glitch.me/) provides a bookmarklet and exposes a REST API for Prettier that allows to format CodeMirror editor in your browser

## Technical Details

This printer is a fork of
[recast](https://github.com/benjamn/recast)'s printer with its
algorithm replaced by the one described by Wadler in "[A prettier
printer](http://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf)".
There still may be leftover code from recast that needs to be cleaned
up.

The basic idea is that the printer takes an AST and returns an
intermediate representation of the output, and the printer uses that
to generate a string. The advantage is that the printer can "measure"
the IR and see if the output is going to fit on a line, and break if
not.

This means that most of the logic of printing an AST involves
generating an abstract representation of the output involving certain
commands. For example, `concat(["(", line, arg, line ")"])` would
represent a concatentation of opening parens, an argument, and closing
parens. But if that doesn't fit on one line, the printer can break
where `line` is specified.

More (rough) details can be found in [commands.md](commands.md).

## Badge

Show the world you're using *Prettier* → [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

```md
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
