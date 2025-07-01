const fs = require('fs');
const path = require('path');

function copyImagesRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyImagesRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      if (/\.(png|jpg|jpeg|webp|svg)$/i.test(entry.name)) {
        fs.copyFileSync(srcPath, destPath);
        console.log('Copied', srcPath, '->', destPath);
      }
    }
  }
}

const srcImgDir = path.join(__dirname, 'img');
const distImgDir = path.join(__dirname, 'dist', 'img');
if (fs.existsSync(srcImgDir)) {
  copyImagesRecursive(srcImgDir, distImgDir);
  console.log('All images copied to dist/img/');
} else {
  console.warn('img/ directory not found, skipping image copy.');
}
