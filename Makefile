.PONY: ci
ci:
	npm ci

.PONY: test
test:
	jest

.PONY: lint
lint:
	eslint ./