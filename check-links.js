const fs = require('fs');
const path = require('path');

// Recursively get all HTML files in the project
function getHtmlFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'dist') return;
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

// Extract all href/src/srcset references from HTML content
function extractLinks(content) {
  const links = [];
  // href and src
  const regex = /(href|src)="([^"]+)"/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[2]);
  }
  // srcset (split by comma)
  const srcsetRegex = /srcset="([^"]+)"/gi;
  while ((match = srcsetRegex.exec(content)) !== null) {
    match[1].split(',').forEach(part => {
      const url = part.trim().split(' ')[0];
      if (url) links.push(url);
    });
  }
  return links;
}

// Check if a link is local (not external)
function isLocal(link) {
  return !/^https?:\/\//i.test(link) && !/^\/\//.test(link) && !link.startsWith('mailto:') && !link.startsWith('tel:') && !link.startsWith('#') && !link.includes('favicon.ico');
}

// Main check
const root = process.cwd();
const htmlFiles = getHtmlFiles(root);
const missing = [];

htmlFiles.forEach(htmlFile => {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const links = extractLinks(content);
  links.forEach(link => {
    if (isLocal(link)) {
      // Remove query/hash
      const cleanLink = link.split(/[?#]/)[0];
      // Resolve relative to HTML file
      const absPath = path.resolve(path.dirname(htmlFile), cleanLink);
      if (!fs.existsSync(absPath)) {
        missing.push({ htmlFile, link });
      }
    }
  });
});

if (missing.length === 0) {
  console.log('✅ All local links and references are valid!');
} else {
  console.log('❌ Broken/missing links found:');
  missing.forEach(({ htmlFile, link }) => {
    console.log(`  In ${htmlFile}: ${link}`);
  });
  process.exit(1);
}
