# Mappable JS Package utils

The project is used for inheritance in packages https://mappable.world/docs/js-api/ref/packages/index.html

> Requires a key to work https://mappable.world/docs/js-api/quickstart.html#get-api-key

In your project, you can include this package in order to simplify
the development of packages for mappable JS API.
It won't completely get rid of the boilerplate,
but it will at least allow you to inherit all the main configs.

## Using

Install package `@mappable-world/mappable-test-utils`

```sh
npm i @mappable-world/mappable-test-utils -D
```

### Linting

Install `eslint`

```sh
npm i eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier -D
```

Create `.eslintrc.js` file:

```js
module.exports = {
  extends: ['./node_modules/@mappable-world/mappable-test-utils/.eslintrc.js']
};
```

### Build

Install `webpack` and `typescript`

```sh
npm i webpack webpack-cli webpack-dev-server css-loader style-loader terser-webpack-plugin ts-loader typescript -D
```

Create files `webpack.config.js`:

```js
module.exports = (args, dir = process.cwd()) => {
  return require('@mappable-world/mappable-test-utils/webpack.config')(args, dir);
};
```

and `tsconfig.json`

```json
{
  "extends": ["@mappable-world/mappable-test-utils"]
}
```

### Test

We use `jest` + `jsdom`:

```sh
npm i -D jest jsdom ts-jest got dotenv cross-fetch
```

And create `jest.config.json` file:

```js
module.exports = {
  ...require('@mappable-world/mappable-test-utils/jest.config.json')
};
```

## Contributing

```sh
make ci
make lint
APIKEY=%YOUR_API_KEY% make test
APIKEY=%YOUR_API_KEY% make start
```

But it's better to create a `.env` file with the contents:

```env
APIKEY="%YOUR_API_KEY%"
```

After that, you will be able to run autotests and start the server
without specifying an environment variable:

```sh
make test
make start
```
