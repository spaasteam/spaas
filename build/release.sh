#!/usr/bin/env sh
set -e

git pull origin dev
git checkout master
git merge dev

conventional-changelog -p angular -i CHANGELOG.md -s -r 0

lerna publish --force-publish=* --exact --temp-tag --registry=http://129.204.96.188:4873

