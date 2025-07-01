const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Helper to ensure directory exists
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Recursively get all HTML files in dist
function getHtmlFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    if (file === 'node_modules' || file === '.git') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getHtmlFiles(fullPath, files);
    } else if (file.endsWith('.html')) {
      files.push(fullPath);
    }
  });
  return files;
}

// Extract all .webp img src references from HTML content
function extractWebpLinks(content) {
  const links = [];
  const regex = /<img[^>]+src="([^"]+\.webp)"/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1]);
  }
  return links;
}

const distRoot = path.join(__dirname, 'dist');
const srcRoot = path.join(__dirname, 'img');
const htmlFiles = getHtmlFiles(distRoot);
const generated = [];
const missing = [];

htmlFiles.forEach(htmlFile => {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const webpLinks = extractWebpLinks(content);
  webpLinks.forEach(link => {
    if (link.startsWith('img/')) {
      const distWebpPath = path.join(distRoot, link);
      if (!fs.existsSync(distWebpPath)) {
        // Try to find a source image with .png, .jpg, or .jpeg
        const base = link.replace(/\.webp$/, '');
        const candidates = ['.png', '.jpg', '.jpeg'].map(ext => path.join(srcRoot, base.replace(/^img\//, '') + ext));
        const found = candidates.find(f => fs.existsSync(f));
        if (found) {
          ensureDirSync(path.dirname(distWebpPath));
          sharp(found)
            .toFile(distWebpPath)
            .then(() => {
              generated.push({ from: found, to: distWebpPath });
              console.log(`Generated: ${distWebpPath} from ${found}`);
            })
            .catch(err => {
              missing.push({ htmlFile, link, error: err.message });
              console.error(`Error generating ${distWebpPath}: ${err.message}`);
            });
        } else {
          missing.push({ htmlFile, link });
          console.warn(`Missing source for: ${link} (referenced in ${htmlFile})`);
        }
      }
    }
  });
});
