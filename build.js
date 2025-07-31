const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

console.log('Starting build process...');

// 1. Generate missing .webp images for every .png/.jpg in img/
const srcImgDir = path.join(__dirname, 'img');
async function generateWebpRecursive(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const promises = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      promises.push(generateWebpRecursive(fullPath));
    } else if (entry.isFile()) {
      if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
        const webpPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        if (!fs.existsSync(webpPath)) {
          promises.push(
            sharp(fullPath)
              .toFile(webpPath)
              .then(() => console.log('Generated', webpPath))
              .catch(err => console.error('Error generating webp for', fullPath, err))
          );
        }
      }
    }
  }
  await Promise.all(promises);
}

(async () => {
  if (fs.existsSync(srcImgDir)) {
    await generateWebpRecursive(srcImgDir);
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

// 2b. Copy logo.png and logo.webp from images/ to dist/images/
const srcImagesDir = path.join(__dirname, 'images');
const distImagesDir = path.join(__dirname, 'dist', 'images');
if (!fs.existsSync(distImagesDir)) fs.mkdirSync(distImagesDir, { recursive: true });
['logo.png', 'logo.webp'].forEach(filename => {
  const srcLogo = path.join(srcImagesDir, filename);
  const distLogo = path.join(distImagesDir, filename);
  if (fs.existsSync(srcLogo)) {
    fs.copyFileSync(srcLogo, distLogo);
    // console.log('Copied', srcLogo, '->', distLogo);
  }
});

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

// 4. Copy fonts, css, images, and videos directories to dist/
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
// Fonts
if (fs.existsSync(srcFontsDir)) {
  copyDirRecursive(srcFontsDir, distFontsDir);
  console.log('Fonts copied to dist/fonts/');
} else {
  console.warn('fonts/ directory not found, skipping font copy.');
}
// CSS
const srcCssDir = path.join(__dirname, 'css');
const distCssDir = path.join(__dirname, 'dist', 'css');
if (fs.existsSync(srcCssDir)) {
  copyDirRecursive(srcCssDir, distCssDir);
  console.log('CSS copied to dist/css/');
} else {
  console.warn('css/ directory not found, skipping css copy.');
}
// Images
const srcImagesDirAll = path.join(__dirname, 'images');
const distImagesDirAll = path.join(__dirname, 'dist', 'images');
if (fs.existsSync(srcImagesDirAll)) {
  copyDirRecursive(srcImagesDirAll, distImagesDirAll);
  console.log('Images copied to dist/images/');
} else {
  console.warn('images/ directory not found, skipping images copy.');
}
// Videos
const srcVideosDir = path.join(__dirname, 'videos');
const distVideosDir = path.join(__dirname, 'dist', 'videos');
if (fs.existsSync(srcVideosDir)) {
  copyDirRecursive(srcVideosDir, distVideosDir);
  console.log('Videos copied to dist/videos/');
} else {
  console.warn('videos/ directory not found, skipping videos copy.');
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


// 6. Copy all HTML files to dist/ (with link-fixing for Spanish pages)
const srcEsDir = path.join(__dirname, 'es');
const distEsDir = path.join(__dirname, 'dist', 'es');
const distDir = path.join(__dirname, 'dist');

const esPages = [
  'index.html',
  'sobre-nosotros.html',
  'servicios.html',
  'precios.html',
  'contacto.html'
];

function fixEsLinks(content) {
  let updated = content;
  esPages.forEach(page => {
    const regex = new RegExp(`href=["']${page}["']`, 'g');
    updated = updated.replace(regex, `href="/es/${page}"`);
  });
  return updated;
}


function copyHtmlRecursive(srcDir, destDir, isEs = false) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    // Skip the dist directory to avoid infinite recursion
    if (entry.isDirectory() && entry.name === 'dist') continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyHtmlRecursive(srcPath, destPath, isEs && entry.name === 'es');
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(srcPath, 'utf8');
      if (isEs) {
        content = fixEsLinks(content);
      }
      fs.writeFileSync(destPath, content, 'utf8');
      // console.log('Copied HTML', srcPath, '->', destPath);
    }
  }
}

// Copy root HTML files
copyHtmlRecursive(__dirname, distDir, false);
// Copy es/ HTML files with link-fixing
if (fs.existsSync(srcEsDir)) {
  copyHtmlRecursive(srcEsDir, distEsDir, true);
  console.log('Spanish HTML files copied to dist/es/ with link-fixing.');
} else {
  console.warn('es/ directory not found, skipping Spanish HTML copy.');
}
console.log('All HTML files copied to dist/.');

console.log('Build completed successfully!');
})(); 