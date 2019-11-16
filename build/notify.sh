#!/bin/sh
url=https://api.github.com/repos/spaasteam/spaas/releases/latest
resp_tmp_file=resp.tmp

curl -H "Authorization: token $ROT_TOKEN" $url > $resp_tmp_file

html_url=$(sed -n 5p $resp_tmp_file | sed 's/\"html_url\"://g' | awk -F '"' '{print $2}')
body=$(grep body < $resp_tmp_file | sed 's/\"body\"://g;s/\"//g')
version=$(sed -n 8p $resp_tmp_file | sed 's/\"tag_name\"://g' | awk -F '"' '{print $2}')

msg='{"msgtype": "markdown", "markdown": {"title": "spaas工具更新至'$version'", "text": "@所有人\n# [spaas '$version']('$html_url')\n'$body'"}}'

curl -X POST https://oapi.dingtalk.com/robot/send\?access_token=$DINGTALK_ROBOT_TOKEN -H 'Content-Type: application/json' -d "$msg"

rm $resp_tmp_file
