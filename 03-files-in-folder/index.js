const fs = require('fs');
const path = require('path');

const { readdir } = require('fs/promises');
const { stat } = require('fs');
const pathToSecretFolder = path.join(__dirname, 'secret-folder');

readdir(pathToSecretFolder, {withFileTypes: true})
  .then(files => {
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(pathToSecretFolder, file.name);

        stat(filePath, (err, stats) => {
          if (err) throw err;
          console.log(`${path.parse(filePath).name} - ${path.extname(filePath).slice(1)} - ${(stats.size / 1024).toFixed(3)} Kb`);
        });
      }
    }
  });
