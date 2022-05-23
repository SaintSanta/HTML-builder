const path = require('path');
const { copyFile, mkdir, readdir, rm } = require('fs/promises');

const filesFolderPath = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

async function copyDirectory(filesFolderPath, pathToCopyFolder) {
  try {
    const filesInFolder = await readdir(filesFolderPath, {withFileTypes: true});
    for (let file of filesInFolder) {
      if (file.isDirectory()) {
        copyDirectory(path.join(filesFolderPath, file.name), path.join(pathToCopyFolder, file.name));
      } else {
        await copyFile(path.join(filesFolderPath, file.name), path.join(pathToCopyFolder, file.name));
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

(async function () {
  await rm(pathToCopyFolder, { recursive: true, force: true });
  await mkdir(pathToCopyFolder, {recursive: true});
  copyDirectory(filesFolderPath, pathToCopyFolder);
}) ();