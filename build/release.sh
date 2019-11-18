#!/usr/bin/env sh
set -e

git pull origin dev
git checkout master
git merge dev


lerna publish --force-publish=* --exact --temp-tag --registry=http://129.204.96.188:4873
conventional-changelog -p angular -i CHANGELOG.md -s -r 0

# commit
git add -A
git commit -m "[build] $VERSION"

# publish
git push origin master
git checkout dev
git rebase master
git push origin dev
