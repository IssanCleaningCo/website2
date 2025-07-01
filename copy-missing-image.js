const fs = require('fs');
const path = require('path');

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

// Extract all img src references from HTML content
function extractImgLinks(content) {
  const links = [];
  const regex = /<img[^>]+src="([^"]+)"/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1]);
  }
  return links;
}

const distRoot = path.join(__dirname, 'dist');
const srcRoot = path.join(__dirname, 'img');
const htmlFiles = getHtmlFiles(distRoot);
const copied = [];
const missing = [];

htmlFiles.forEach(htmlFile => {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const imgLinks = extractImgLinks(content);
  imgLinks.forEach(link => {
    // Only handle local img/ links
    if (link.startsWith('img/')) {
      const distImgPath = path.join(distRoot, link);
      const srcImgPath = path.join(srcRoot, link.replace(/^img\//, ''));
      if (!fs.existsSync(distImgPath)) {
        if (fs.existsSync(srcImgPath)) {
          ensureDirSync(path.dirname(distImgPath));
          fs.copyFileSync(srcImgPath, distImgPath);
          copied.push({ from: srcImgPath, to: distImgPath });
        } else {
          missing.push({ htmlFile, link });
        }
      }
    }
  });
});

if (copied.length > 0) {
  console.log('✅ Copied missing images:');
  copied.forEach(({ from, to }) => {
    console.log(`  ${from} → ${to}`);
  });
} else {
  console.log('No missing images needed to be copied.');
}

if (missing.length > 0) {
  console.log('\n❌ Images missing in both source and dist:');
  missing.forEach(({ htmlFile, link }) => {
    console.log(`  In ${htmlFile}: ${link}`);
  });
} else {
  console.log('\nAll image references are now satisfied!');
}
