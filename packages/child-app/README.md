# 微前端子应用开发说明

<a name="df368884"></a>

## 前言

<br />对子应用封装的主要目的：<br />

- 为了保证团队的子应用的通用性
- 方便团队快速开发子应用


<br />

<a name="ee317cce"></a>

## 开发说明


<a name="0ce614c2"></a>

### 一、安装spaas命令行工具

<br />spaas-cli工具需要全局安装，在命令行工具里面输入以下命令：（spaas-cli依赖yarn，yarn需要事先全局安装）<br />

```bash
npm install @spaas/cli --registry=http://129.204.96.188:4873 -g
# 验证是否安装成功
spaas -V
# 如果出现对应的版本号，即对应的spaas-cli命令行工具安装成功
```

<br />

<a name="dafeb72a"></a>

### 二、初始化子应用脚手架

<br />执行如下命令，按照输入提示填写应用信息<br />

```bash
# 执行启动交互命令
spaas init
# 1、选择对应的初始化应用模板，这里选择“微前端子应用模块”
# 2、填写相应的项目名称（必填，到时候初始化后为项目的文件夹名称了）；
# 3、填写项目版本；
# 4、填写项目描述；
```

<br />

<a name="69ce27f1"></a>

### 三、在项目根目录下创建.env文件


```bash
API_SERVER=http://dr.sandbox.deepexi.top

# PUBLIC_PATH=http://cdn-dev.deepexi.top/deepexi-ci-cd/deploy/5da1824b70e174004079a44a/xraclv96jd2nd7z8cyanl0h4i8jtu51n/
```

<br />

<a name="htqww"></a>

## 注意事项

- 用户token（token）、用户信息（userInfo）、菜单信息（menuInfo）、应用信息（appInfo）都应该通过@spaas/bridge进行获取
- 其他的开发与普通应用开发相同
