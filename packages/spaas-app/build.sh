#!/bin/bash
set -e
cd `dirname $0`
echo "检查yarn"

if ! which yarn -v &> /dev/null ;then
  echo "安装yarn"
  npm i -g yarn
fi

echo "build project"
yarn --frozen-lockfile && yarn build

echo "压缩项目"
cd dist
tar -czf ../$APP_NAME-v$VERSION.tar.gz .
cd ..
