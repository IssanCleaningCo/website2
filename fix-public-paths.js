const fs = require('fs');
const path = require('path');

const ASSET_FOLDERS = ['images', 'js', 'css', 'fonts', 'videos', 'img'];

function fixPathsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  ASSET_FOLDERS.forEach(folder => {
    // Replace /public/folder/ with /folder/
    const regex = new RegExp(`/public/${folder}/`, 'g');
    updated = updated.replace(regex, `/${folder}/`);
  });
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Fixed asset paths in: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.css') || entry.name.endsWith('.js'))) {
      fixPathsInFile(fullPath);
    }
  });
}

walkDir(path.join(process.cwd(), 'public')); 