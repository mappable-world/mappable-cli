# %PACKAGE_NAME% package

---

Mappable JS API package

[![npm version](https://badge.fury.io/js/%PACKAGE_NAME%.svg)](https://badge.fury.io/js/%PACKAGE_NAME%)
[![npm](https://img.shields.io/npm/dm/%PACKAGE_NAME%.svg)](https://www.npmjs.com/package/%PACKAGE_NAME%)

## How use

The package is located in the `dist` folder:

- `dist/types` TypeScript types
- `dist/esm` es6 modules for direct connection in your project
- `dist/index.js` Mappable JS Module

to use Mappable JS Module you need to add your module loading handler to JS API

```js
mappable.import.loaders.unshift(async (pkg) => {
  if (!pkg.includes('%PACKAGE_NAME%')) {
    return;
  }

  if (location.href.includes('localhost')) {
    await mappable.import.script(`/dist/index.js`);
  } else {
    // You can use another CDN
    await mappable.import.script(`https://unpkg.com/${pkg}/dist/index.js`);
  }

  Object.assign(mappable, window[`${pkg}`]);
  return window[`${pkg}`];
});
```

and in your final code just use `mappable.import`

```js
const pkg = await mappable.import('%PACKAGE_NAME%')
```
