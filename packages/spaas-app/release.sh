#!/bin/sh

yarn stdver

git remote add github https://$GITHUB_TOKEN@github.com/spaasteam/spaas-admin-template.git > /dev/null 2>&1
git push github HEAD:master --follow-tags
