const fs = require('fs');
const path = require('path');
const {moveOrCopyFile} = require('./utils')

const distPath = 'dist';
const excludes = [/.md$/, /^[.]/, /build\.js/, /dist/]

function checkFileExcludes(fileName) {
    for (let exclude of excludes) {
        if (exclude.test(fileName)) {
            return true;
        }
    }
    return false;
}

function buildToDist() {
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
    cleanDist();
    console.log('build copy files...')
    moveOrCopyFile(subFiles, dist, true, file => !checkFileExcludes(file.name));
    console.log('build success')
}

function cleanDist() {
    const dist = path.join(path.resolve(), distPath);
    console.log('deleting dir ', dist);
    if (fs.existsSync(dist)) {
        fs.rmSync(dist, {recursive: true});
    }
    console.log('deleted dir ', dist);
}

const args = process.argv;

console.log('input params:', args)

if (args) {
    if (args[2] === 'build') {
        buildToDist();
    } else if (args[2] === 'clean') {
        cleanDist();
    }
}
