const fs = require('fs/promises');
const path = require('path');
const originalDir = path.join(__dirname, 'files');
const copiedDir = path.join(__dirname, 'files-copy');
fs.rm(copiedDir, { recursive: true, force: true })
  .finally(() => {
    fs.mkdir(copiedDir, { recursive: true })
      .then(() => fs.readdir(originalDir, { withFileTypes: true }))
      .then(files => {
        for (let file of files) {
          if (file.isFile()) {
            const sourcePath = path.join(originalDir, file.name);
            const destPath = path.join(copiedDir, file.name);
            fs.copyFile(sourcePath, destPath)
              .then(() => console.log(`Copied: ${file.name}`));
          }
        }
      })
      .catch(err => console.error('An error occurred:', err));
  });