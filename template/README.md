# %PACKAGE_NAME% package

---

Mappable JS API package

[![npm version](https://badge.fury.io/js/%PACKAGE_NAME_ENC%.svg)](https://badge.fury.io/js/%PACKAGE_NAME%)
[![npm](https://img.shields.io/npm/dm/%PACKAGE_NAME%.svg)](https://www.npmjs.com/package/%PACKAGE_NAME%)

## How use

The package is located in the `dist` folder:

- `dist/types` TypeScript types
- `dist/esm` es6 modules for direct connection in your project
- `dist/index.js` Mappable JS Module

Recommended use `MMapEntityTileLoader` as usual npm package:

```sh
npm i %PACKAGE_NAME%
```

and dynamic import

```js
const {MMapEntityTileLoader} = await import('%PACKAGE_NAME%/dist/esm/index');
```

But you can use CDN with module loading handler in JS API:

### Development

```js
mappable.import.loaders.unshift(async (pkg) => {
  if (!pkg.startsWith('%PACKAGE_NAME%')) {
    return;
  }

  await mappable.import.script(`./node_modules/%PACKAGE_NAME%/dist/index.js`);

  return window[`${pkg}`];
});
```

### Production

```js
mappable.import.loaders.unshift(async (pkg) => {
  if (!pkg.includes('%PACKAGE_NAME%')) {
    return;
  }

  // You can use another CDN
  await mappable.import.script(`https://unpkg.com/${pkg}/dist/index.js`);

  return window[`${pkg}`];
});
```

and in your final code just use `mappable.import`

```js
const pkg = await mappable.import('%PACKAGE_NAME%')
```
