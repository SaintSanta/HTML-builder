const fs = require('fs');
const path = require('path');
const { copyFile, mkdir, readdir, rm } = require('fs/promises');

const projectPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const pagePath = path.join(__dirname, 'template.html');

async function buildPage(pagePath, componentsPath) {
  try {
    const templatePage = fs.createReadStream(pagePath, 'utf8');
    let templateData = '';
    templatePage.on('data', (chunk) => (templateData += chunk));
    templatePage.on('end', async () => {
      const components = await readdir(componentsPath, { withFileTypes: true });

      for (let component of components) {
        const inputComponents = fs.createReadStream(
          path.join(componentsPath, component.name),'utf8');
        const componentName = path.basename(
          path.join(componentsPath, component.name),'.html');
        let componentsData = '';
        inputComponents.on('data', (chunk) => (componentsData += chunk));
        inputComponents.on('end', () => {
          templateData = templateData.replace(
            `{{${componentName}}}`,componentsData);
          const output = fs.createWriteStream(
            path.join(projectPath, 'index.html'));
          output.write(templateData);
        });
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function copyDirectory(filesFolderPath, pathToCopyFolder) {
  try {
    await rm(pathToCopyFolder, { recursive: true, force: true });
    await mkdir(pathToCopyFolder, { recursive: true });
    const filesInFolder = await readdir(filesFolderPath, {
      withFileTypes: true,});

    for await (let file of filesInFolder) {
      if (file.isDirectory()) {
        copyDirectory(
          path.join(filesFolderPath, file.name),
          path.join(pathToCopyFolder, file.name));
      } else {
        await copyFile(
          path.join(filesFolderPath, file.name),
          path.join(pathToCopyFolder, file.name)
        );
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function createStyleCSS(stylesPath, projectPath) {
  try {
    const stylesFolder = await readdir(stylesPath, { withFileTypes: true });
    const output = fs.createWriteStream(path.join(projectPath, 'style.css'));

    for (let style of stylesFolder) {
      if (style.isFile() && style.name.includes('.css')) {
        const input = fs.createReadStream(
          path.join(stylesPath, style.name),'utf8');
        input.pipe(output);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function buildProject(
  projectPath,
  pagePath,
  componentsPath,
  stylesPath,
  assetsPath
) {
  await rm(projectPath, { recursive: true, force: true });
  await mkdir(projectPath, { recursive: true });
  await mkdir(path.join(projectPath, 'assets'), { recursive: true });
  buildPage(pagePath, componentsPath);
  createStyleCSS(stylesPath, projectPath);
  copyDirectory(assetsPath, path.join(projectPath, 'assets'));
}

buildProject(projectPath, pagePath, componentsPath, stylesPath, assetsPath);
