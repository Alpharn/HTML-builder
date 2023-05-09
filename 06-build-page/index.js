const fs = require('fs').promises;
const path = require('path');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'index.html');
const outputStylesFile = path.join(outputDir, 'style.css');
async function buildPage() {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    const template = await fs.readFile(templatePath, 'utf-8');
    const componentTags = template.match(/{{\w+}}/g);
    let output = template;
    for (const tag of componentTags) {
      const componentName = tag.slice(2, -2);
      const componentPath = path.join(componentsDir, `${componentName}.html`);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      output = output.replace(tag, componentContent);
    }
    await fs.writeFile(outputFile, output, 'utf-8');
    const styleEntries = await fs.readdir(stylesDir, { withFileTypes: true });
    const cssFiles = styleEntries.filter(
      (entry) => entry.isFile() && path.extname(entry.name) === '.css'
    );
    const stylesPromises = cssFiles.map((file) =>
      fs.readFile(path.join(stylesDir, file.name), 'utf-8')
    );
    const styles = await Promise.all(stylesPromises);
    const stylesBundle = styles.join('\n');
    await fs.writeFile(outputStylesFile, stylesBundle, 'utf-8');
    const assetsEntries = await fs.readdir(assetsDir, { withFileTypes: true });
    const copyAssetsPromises = assetsEntries.map(async (entry) => {
      const srcPath = path.join(assetsDir, entry.name);
      const destPath = path.join(outputDir, 'assets', entry.name);
      if (entry.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        const files = await fs.readdir(srcPath, { withFileTypes: true });
        return await Promise.all(
          files.map((file) =>
            fs.copyFile(path.join(srcPath, file.name), path.join(destPath, file.name))
          )
        );
      } else {
        return fs.copyFile(srcPath, destPath);
      }
    });
    await Promise.all(copyAssetsPromises);

  } catch (err) {
    console.error('Error:', err);
  }
}
buildPage();