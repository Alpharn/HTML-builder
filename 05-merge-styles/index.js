const fs = require('fs').promises;
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');
async function mergeStyles() {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    const entries = await fs.readdir(stylesDir, { withFileTypes: true });

    const cssFiles = entries.filter(
      (entry) => entry.isFile() && path.extname(entry.name) === '.css'
    );

    const stylesPromises = cssFiles.map((file) =>
      fs.readFile(path.join(stylesDir, file.name), 'utf-8')
    );

    const styles = await Promise.all(stylesPromises);
    const stylesBundle = styles.join('\n');
    await fs.writeFile(outputFile, stylesBundle, 'utf-8');

  } catch (err) {
    console.error('Error:', err);
  }
}
mergeStyles();