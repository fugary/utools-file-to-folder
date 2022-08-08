const fs = require('fs');
const path = require('path');

const moveOrCopyFile = function (files, dir, copy, checkFileFunc) {
  // 如果不是绝对路径，根据文件转换成绝对路径
  dir = dir.trim();
  if (!path.isAbsolute(dir)) {
    dir = path.join(path.resolve(files[0].path, '..'), dir);
  }
  if(files.length && !fs.existsSync(files[0].path)){
    utools.showNotification('文件或文件夹不存在，不能执行移动或复制');
    throw new Error('File not exists!');
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
      if(!subFiles.length){ // 空文件夹没有复制和移动的问题
        fs.mkdirSync(path.join(dir, file.name), { recursive: true });
      }
      if (!copy) { // 处理移动完还有个文件夹残留问题
        fs.rmdirSync(file.path);
      }
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
    let msg = e.message;
    if (e.code === 'EBUSY') {
      msg = `文件正在使用中，${e.message}`;
    } else if (e.code === 'EXDEV') {
      msg = `不支持跨盘移动文件，${e.message}`;
    }
    utools.showNotification(msg);
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