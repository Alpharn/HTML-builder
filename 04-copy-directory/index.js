const fs = require('fs').promises;
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');
async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Ошибка:', err);
  }
}
copyDir(sourceDir, targetDir);