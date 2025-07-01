const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

console.log('Starting build process...');

// 1. Generate missing .webp images for every .png/.jpg in img/
const srcImgDir = path.join(__dirname, 'img');
function generateWebpRecursive(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      generateWebpRecursive(fullPath);
    } else if (entry.isFile()) {
      if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
        const webpPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        if (!fs.existsSync(webpPath)) {
          sharp(fullPath)
            .toFile(webpPath)
            .then(() => console.log('Generated', webpPath))
            .catch(err => console.error('Error generating webp for', fullPath, err));
        }
      }
    }
  }
}
if (fs.existsSync(srcImgDir)) {
  generateWebpRecursive(srcImgDir);
} else {
  console.warn('img/ directory not found, skipping webp generation.');
}

// 2. Copy all images from img/ to dist/img/ (preserve structure)
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
        // console.log('Copied', srcPath, '->', destPath);
      }
    }
  }
}
const distImgDir = path.join(__dirname, 'dist', 'img');
if (fs.existsSync(srcImgDir)) {
  copyImagesRecursive(srcImgDir, distImgDir);
  console.log('All images copied to dist/img/');
} else {
  console.warn('img/ directory not found, skipping image copy.');
}

// 3. Ensure dist/js directory exists
const distJsDir = path.join(__dirname, 'dist', 'js');
if (!fs.existsSync(distJsDir)) {
  fs.mkdirSync(distJsDir, { recursive: true });
  console.log('Created dist/js directory');
}

// Check if source file exists
const sourceFile = path.join(__dirname, 'js', 'script.js');
if (!fs.existsSync(sourceFile)) {
  console.error('Error: Source file js/script.js not found!');
  console.log('Current directory:', __dirname);
  console.log('Looking for file:', sourceFile);
  process.exit(1);
}

console.log('Source file found:', sourceFile);

// Minify JavaScript
try {
  const outputFile = path.join(__dirname, 'dist', 'js', 'script.min.js');
  execSync(`npx uglify-js "${sourceFile}" -o "${outputFile}" --compress --mangle`, { stdio: 'inherit' });
  console.log('JavaScript minified successfully');
} catch (error) {
  console.error('Error minifying JavaScript:', error.message);
  process.exit(1);
}

// 4. Copy fonts directory to dist/fonts
const srcFontsDir = path.join(__dirname, 'fonts');
const distFontsDir = path.join(__dirname, 'dist', 'fonts');
function copyDirRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
if (fs.existsSync(srcFontsDir)) {
  copyDirRecursive(srcFontsDir, distFontsDir);
  console.log('Fonts copied to dist/fonts/');
} else {
  console.warn('fonts/ directory not found, skipping font copy.');
}

// 5. Copy all .js files from js/ to dist/js/ (except script.js, which is minified)
const srcJsDir = path.join(__dirname, 'js');
if (fs.existsSync(srcJsDir)) {
  const jsFiles = fs.readdirSync(srcJsDir).filter(f => f.endsWith('.js') && f !== 'script.js');
  for (const file of jsFiles) {
    fs.copyFileSync(path.join(srcJsDir, file), path.join(distJsDir, file));
  }
  console.log('Other JS files copied to dist/js/');
} else {
  console.warn('js/ directory not found, skipping JS copy.');
}

console.log('Build completed successfully!'); 