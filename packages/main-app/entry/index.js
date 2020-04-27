const path = require('path');

const templateFiles = [
  '.babelrc',
  '.commitlintrc.js',
  '.editorconfig',
  '.eslintignore',
  '.eslintrc.js',
  '.gitignore',
  '.npmignore',
  '.npmrc',
  '.stylelintrc',
  'build.sh',
  'jsconfig.json',
  'proxy.config.js',
  'vue.config.js',
  'package.json',
  'yarn.lock',
];

const templateDirs = ['public', 'src', 'views'];

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
  publicDirPath: path.join(__dirname, '..', 'public'),
  srcDirPath: path.join(__dirname, '..', 'src'),
};
