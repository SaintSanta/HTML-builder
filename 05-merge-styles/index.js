const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const stylesPath = path.join(__dirname, 'styles');
const projectPath = path.join(__dirname, 'project-dist');

async function createBundleCSS(stylesPath, projectPath) {
  try {
    const stylesFolder = await readdir(stylesPath, {withFileTypes: true});
    const output = fs.createWriteStream(path.join(projectPath, 'bundle.css'));

    for (let style of stylesFolder) {
      if (style.isFile() && style.name.includes('.css')) {
        const input = fs.createReadStream(path.join(stylesPath, style.name), 'utf8');
        input.pipe(output);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

createBundleCSS(stylesPath, projectPath);
