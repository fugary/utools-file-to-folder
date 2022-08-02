const fs = require('fs');
const path = require('path');

const moveOrCopyFile = function (files, dir, copy, checkFileFunc) {
  // 如果不是绝对路径，根据文件转换成绝对路径
  dir = dir.trim();
  if (!path.isAbsolute(dir)) {
    dir = path.join(path.resolve(files[0].path, '..'), dir);
  }
  files.forEach(file => {
    if (checkFileFunc && !checkFileFunc(file)) {
      return;
    }
    if (file.isDirectory) {
      const subFileNames = fs.readdirSync(file.path);
      const subFiles = subFileNames.map(subFileName => {
        const subPath = path.join(file.path, subFileName);
        const stat = fs.statSync(subPath);
        return {
          name: subFileName,
          path: subPath,
          isDirectory: stat.isDirectory(),
          isFile: stat.isFile()
        }
      })
      moveOrCopyFile(subFiles, path.join(dir, file.name), copy);
    } else {
      if (copy) {
        customCopyFile(file.path, path.join(dir, file.name));
      } else {
        customMoveFile(file.path, path.join(dir, file.name));
      }
    }
  });
}

const customMoveFile = function (fromPath, toPath) {
  fs.mkdirSync(path.resolve(toPath, '..'), { recursive: true });
  try {
    fs.renameSync(fromPath, toPath);
  } catch (e) {
    utools.showNotification('不支持跨盘移动文件，请使用复制方式');
    throw e;
  }
}

const customCopyFile = function (fromPath, toPath) {
  fs.mkdirSync(path.resolve(toPath, '..'), { recursive: true });
  fs.copyFileSync(fromPath, toPath);
}

const checkDragFile = function (file) {
  const stat = fs.statSync(file.path);
  file.isDirectory = stat.isDirectory();
  file.isFile = stat.isFile();
}

module.exports = {
  moveOrCopyFile,
  customMoveFile,
  customCopyFile,
  checkDragFile
}