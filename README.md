# Mappable JS CLI utils

The project is used for inheritance in packages https://mappable.world/docs/js-api/ref/packages/index.html

> Requires a key to work https://mappable.world/docs/js-api/quickstart.html#get-api-key

In your project, you can include this package in order to simplify
the development of packages for mappable JS API.
It won't completely get rid of the boilerplate,
but it will at least allow you to inherit all the main configs.

## Create mappable package by template

```sh
npx @mappable-world/mappable-cli --name="mappable-my-super-pkg"
```

You can see the full list of options here:

```sh
npx @mappable-world/mappable-cli help
```

Or you can set up all elements of the package yourself, such as autotests, linting and building.

## Manual

Install package `@mappable-world/mappable-cli`

```sh
npm i -D mappable-world/mappable-package-utils#main
```

For development, you may also need types for the libraries you use:

```sh
npm i -D @types/got @types/jest @types/jsdom @types/react @mappable-world/mappable-types
```

### Linting

Install `eslint`

```sh
npm i eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier -D
```

Create `.eslintrc.js` file:

```js
module.exports = {
  extends: ['./node_modules/@mappable-world/mappable-cli/.eslintrc.js']
};
```

Create `.prettierrc.js` file:


```js
const config = require("@mappable-world/mappable-cli/.prettierrc.json");

module.exports = {
  ...config
}
```

### Build

Install `webpack` and `typescript`

```sh
npm i webpack webpack-cli webpack-dev-server css-loader style-loader terser-webpack-plugin ts-loader typescript -D
```

Create files `webpack.config.js`:

```js
module.exports = (args, env, dir = process.cwd()) => {
  return require('@mappable-world/mappable-cli/webpack.config')(args, env, dir);
}
```

and `tsconfig.json`

```json
{
  "extends": ["@mappable-world/mappable-cli"],
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./node_modules/@mappable-world"]
  }
}
```

### Test

We use `jest` + `jsdom`:

```sh
npm i -D jest jsdom ts-jest got@11.8.6 dotenv cross-fetch identity-obj-proxy
```

And create `jest.config.json` file:

```js
module.exports = {
  ...require('@mappable-world/mappable-cli/jest.config.js')
};
```
