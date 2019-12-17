# !/bin/sh
if [ "$TRAVIS_TEST_RESULT" != "0" ]
then
  echo "build not success, bye"
  exit 1
fi

url=https://api.github.com/repos/spaasteam/spaas-admin-template/releases/latest
resp_tmp_file=resp.tmp

curl -H "Authorization: token $GITHUB_TOKEN" $url > $resp_tmp_file

html_url=$(sed -n 5p $resp_tmp_file | sed 's/\"html_url\"://g' | awk -F '"' '{print $2}')
tag=$(grep tag_name < $resp_tmp_file | sed 's/\"tag_name\"://g;s/\"//g')
changelogUrl=https://github.com/spaasteam/spaas-admin-template/blob/master/CHANGELOG.md

msg='{"msgtype": "markdown", "markdown": {"title": "spaas-admin-template更新", "text": "@所有人\n# [spaas-admin-template]('$html_url')\n\n 更新版本号：['$tag']('$html_url') \n\n 详细更新信息：[链接]('$changelogUrl')"}}'

curl -X POST https://oapi.dingtalk.com/robot/send\?access_token\=$DINGTALK_ROBOT_TOKEN -H 'Content-Type: application/json' -d "$msg"

rm $resp_tmp_file