# %PACKAGE_NAME% package

---

Mappable JS API package

[![npm version](https://badge.fury.io/js/%PACKAGE_NAME_ENCODED%.svg)](https://badge.fury.io/js/%PACKAGE_NAME_ENCODED%)
[![npm](https://img.shields.io/npm/dm/%PACKAGE_NAME%.svg)](https://www.npmjs.com/package/%PACKAGE_NAME%)
[![Build Status](https://github.com/mappable-world/%PACKAGE_NAME%/workflows/Run%20tests/badge.svg)](https://github.com/mappable-world/%PACKAGE_NAME%/actions/workflows/tests.yml)

## How use

The package is located in the `dist` folder:

- `dist/types` TypeScript types
- `dist/esm` es6 modules for direct connection in your project
- `dist/index.js` Mappable JS Module

Recommended use `MMapButtonExample` as usual npm package:

```sh
npm i %PACKAGE_NAME%
```

and dynamic import

```js
await mappable.ready;

// ...

const {MMapButtonExample} = await import('%PACKAGE_NAME%');

// ...

map.addChild(new MMapButtonExample(props));
```

### Usage without npm

You can use CDN with module loading handler in JS API on your page.

Just use `mappable.import`:

```js
const pkg = await mappable.import('%PACKAGE_NAME%');
```

By default `mappable.import` can load self modules.
If you want also load your package, should register cdn:

```js
mappable.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', '%PACKAGE_NAME%@latest');
```
