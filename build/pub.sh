
# 设置全局变量
chmod 777 ./build/*.sh
source ./build/env.sh

# release
./build/release.sh

# git-release
GREN_GITHUB_TOKEN=$ROT_TOKEN
gren release --override

# 通过钉钉进行通知
./build/notify.sh
