# Contributing

## Getting started

```sh
npm ci
npm run build
node ./dist
```

You need a real APIKEY to run test cases https://mappable.world/docs/js-api/quickstart.html#get-api-key:

```sh
echo 'APIKEY="%%APIKEY%%"' > .env
npm test
```

## New version

```sh
npm run bump
```

This will increment the version, add all the files in the stage,
commit, create a new tag, and push into main:origin

New version will be published in github actions.
