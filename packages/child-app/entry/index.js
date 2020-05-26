const path = require('path');

const templateFiles = [
  '.browserslistrc',
  '.editorconfig',
  '.env',
  '.babelrc',
  '.eslintignore',
  '.eslintrc.js',
  '.gitignore',
  '.npmignore',
  '.npmrc',
  '.stylelintrc',
  'build.sh',
  'jsconfig.json',
  'tsconfig.json',
  'proxy.config.js',
  'vue.config.js',
  'package.json',
  'yarn.lock',
  'README.md',
];

const templateDirs = ['public', 'src'];

const templateFilePaths = templateFiles.map(item => {
  let targetFileName = item.replace(/^\./g, '_');
  if (targetFileName === 'package.json') {
    targetFileName = '_package.json';
  }
  return path.join(__dirname, '..', 'template', targetFileName);
});

const templateDirPaths = templateDirs.map(item => {
  return path.join(__dirname, '..', 'template', item);
});

module.exports = {
  templateFilePaths,
  templateDirPaths,
  templateDirs,
  templateFiles,
  publicDirPath: path.join(__dirname, '..', 'template', 'public'),
  srcDirPath: path.join(__dirname, '..', 'template', 'src'),
};
