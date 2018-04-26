#!/bin/bash
git diff --staged --diff-filter=dx --name-only HEAD | grep ".*\.js$" | xargs npm run prettier -- --write
git diff --staged --diff-filter=dx --name-only HEAD | grep ".*\.gql$" | xargs npm run prettier -- --write --parser graphql
git diff --staged --diff-filter=dx --name-only HEAD | grep ".*\.js$" | xargs git add
git diff --staged --diff-filter=dx --name-only HEAD | grep ".*\.gql$" | xargs git add
