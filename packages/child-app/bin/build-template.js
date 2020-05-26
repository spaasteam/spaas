#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const {templateFiles, templateDirs} = require('../entry/index');
// 1、检查对应的文件夹是否存在，如果存在的话则删除再创建
// 2、将脚手架需要的文件拷贝到template文件夹并且重命名，将文件名为.开头的全部重命名为_开头
// 3、处理package,将其处理为_开头的模板json文件

// 1、检查对应的文件夹是否存在，如果存在的话则删除再创建
const targetPath = path.join(process.cwd(), 'template');
if (fs.existsSync(targetPath)) {
  fs.removeSync(targetPath);
}
fs.mkdirSync(targetPath);

// 2、将脚手架需要的文件拷贝到template文件夹并且重命名，将文件名为.开头的全部重命名为_开头

templateFiles.forEach(item => {
  const sourceFile = path.join(process.cwd(), item);
  let targetFileName = item.replace(/^\./g, '_');
  if (targetFileName === 'package.json') {
    targetFileName = '_package.json';
  }
  const targetFile = path.join(targetPath, targetFileName);
  try {
    fs.copyFileSync(sourceFile, targetFile);
  } catch (err) {
    console.error(err);
  }
});

templateDirs.forEach(item => {
  const sourceDir = path.join(process.cwd(), item);
  const targetDir = path.join(targetPath, item);
  try {
    fs.copySync(sourceDir, targetDir);
  } catch (err) {
    console.error(err);
  }
});

// 3、处理package,将其处理为_开头的模板json文件
const packagePath = path.join(targetPath, '_package.json');
const packageMap = require(packagePath);

packageMap.name = '<%= name %>';
packageMap.version = '<%= version %>';
packageMap.description = '<%= description %>';
delete packageMap.main;

try {
  fs.writeJsonSync(packagePath, packageMap, {spaces: '\t'});
} catch (err) {
  console.log(err);
}
