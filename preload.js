const { moveOrCopyFile, customCopyFile, customMoveFile, checkDragFile } = require('./utils')
const electron = require('electron')
window.electron = electron;

window.moveOrCopyFile = moveOrCopyFile;
window.customMoveFile = customMoveFile;
window.customCopyFile = customCopyFile;
window.checkDragFile = checkDragFile;
