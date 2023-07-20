# Mappable JS API Example Package

To get started in the `.env` file, you need to declare `APIKEY` https://mappable.world/docs/js-api/quickstart.html#get-api-key:


## Getting started

To get started:

```sh
npm start
```

or so if you didn't create the `.env` file

```sh
APIKEY=%APIKEY% npm start
```

To check with linter:

```sh
npm run lint
```

For the final build:

```sh
npm run build
```

## GitHub actions

After you create a new tag, or just push changes to the server, ci will be launched

CI described here `.github/workflows/release.yml` and `.github/workflows/tests.yml`

For it to work, you need to declare two secrets in the GitHub Action:

- `APIKEY` - To run autotests on the JS API https://mappable.world/docs/js-api/quickstart.html#get-api-key
- `NPM_TOKEN` - To publish your package to npm

