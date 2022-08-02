const fs = require('fs');
const path = require('path');
const { moveOrCopyFile } = require('./utils')

const distPath = 'dist';
const excludes = [/.md$/, /^[.]/, /build\.js/, /dist/]

function checkFileExcludes (fileName) {
  for (let exclude of excludes) {
    if (exclude.test(fileName)) {
      return true;
    }
  }
  return false;
}

function buildToDist () {
  const currentPath = path.resolve();
  const subFileNames = fs.readdirSync(currentPath);
  const subFiles = subFileNames.map(subFileName => {
    const subPath = path.join(currentPath, subFileName);
    const stat = fs.statSync(subPath);
    return {
      name: subFileName,
      path: subPath,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile()
    }
  });
  const dist = path.join(currentPath, distPath);
  fs.rmdirSync(dist, { recursive: true });
  moveOrCopyFile(subFiles, dist, true, file => !checkFileExcludes(file.name));
}

buildToDist();