ARGS ?= ""

.PHONY: build test default coverage

default: .git/hooks/pre-commit build

build:
	docker-compose build
	npm install

.git/hooks/pre-commit: scripts/prettier.sh
	cp scripts/prettier.sh .git/hooks/pre-commit

run:
	docker-compose up

test:
	docker-compose run --rm node npm run test $(ARGS)

test-watch:
	docker-compose run --rm node npm run test --watch

lint:
	docker-compose run --rm node npm run lint

format:
	docker-compose run --rm node npm run format

shell:
	docker-compose run --rm node bash

coverage:
	open coverage/lcov-report/index.html
