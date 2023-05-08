const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function getFilesInfo(folderPath) {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileStat = await fs.stat(filePath);
        const fileSize = (fileStat.size / 1024).toFixed(3); // В килобайтах
        const fileExt = path.extname(file.name).slice(1); // Удаляем точку перед расширением
        const fileName = path.basename(file.name, `.${fileExt}`);

        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error('Ошибка:', err);
  }
}
getFilesInfo(folderPath);