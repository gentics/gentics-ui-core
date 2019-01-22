# How to contribute

## Getting started

- Fork the repository
- Create a topic branch from where you want to base your work (usually master)
- Make commits of logical units, always together with your tests and documentation
- Make sure you have added the necessary tests for your changes
- Run *all* the tests with `npm test` to assure nothing else was accidentally broken
- When you are done, rebase on the current `dev` branch (`git pull --rebase`)
- Push to your fork and create a pull request

## Requirements

- node >= 10.0

## Dependencies

- Install the current dependencies with `npm install`
- Add new dependencies with `--save` or `--save-dev`
- Use reasonable [semver](http://semver.org/) version dependencies
  in package.json like `^0.8.1`, `~1.4.2`, *never* `"*"`

## Code standards & linting

To help reduce whitespace clutter in git diffs and pull requests, please use [editorconfig](http://editorconfig.org/#download). Some IDEs have native support,
some require a plugin, such as [Atom](https://github.com/sindresorhus/atom-editorconfig#readme)
and [Sublime](https://github.com/sindresorhus/editorconfig-sublime#readme).
If you use an exotic IDE without editorconfig support, please set it to:
- indentation 4 spaces
- no trailing whitespace (except in markdown)
- enforced *one* newline on last line in file

To lint the TypeScript and JavaScript, please install a [jscs](http://jscs.info/) and
[tslint](https://github.com/palantir/tslint) plugin for your Editor or use `gulp lint`.
