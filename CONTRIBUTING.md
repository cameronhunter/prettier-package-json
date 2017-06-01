# Contributing to `prettier-package-json`

To get up and running, install the dependencies and run the tests:

```sh
yarn
yarn test
```

Here's what you need to know about the tests:

* The tests uses [Jest](https://facebook.github.io/jest/) snapshots.
* You can make changes and run `jest -u` (or `yarn test -- -u`) to update the
  snapshots. Then run `git diff` to take a look at what changed. Always update
  the snapshots when opening a PR.

Run `yarn format` to automatically format files.
