#!/usr/bin/env sh
set -e

git pull origin dev
git checkout master
git merge dev

VERSION=`npx select-version-cli`

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # build
  VERSION=$VERSION npm run dist

  # publish theme 不需要进行发版
  # echo "Releasing theme-chalk $VERSION ..."
  # cd packages/theme-chalk
  # npm version $VERSION --message "[release] $VERSION"
  # if [[ $VERSION =~ "beta" ]]
  # then
  #   npm publish --tag beta
  # else
  #   npm publish
  # fi
  # cd ../..

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"

  # publish
  git push origin master
  git push origin refs/tags/v$VERSION
  git checkout dev
  git rebase master
  git push origin dev

  if [[ $VERSION =~ "beta" ]]
  then
    lerna publish --force-publish=* --exact --dist-tag beta --registry=http://129.204.96.188:4873
  else
    lerna publish --force-publish=* --exact --registry=http://129.204.96.188:4873
  fi
fi
