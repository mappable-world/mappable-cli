# Mappable JS Package utils

The project is used for inheritance in packages https://mappable.world/docs/js-api/ref/packages/index.html

> Requires a key to work https://mappable.world/docs/js-api/quickstart.html#get-api-key

## Using

Install package `@mappable-world/mappable-test-utils`

```sh
npm i @mappable-world/mappable-test-utils -D
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
