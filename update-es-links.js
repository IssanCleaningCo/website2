const fs = require('fs');
const path = require('path');

// List of Spanish page filenames to update
const pages = [
  'index.html',
  'sobre-nosotros.html',
  'servicios.html',
  'precios.html',
  'contacto.html'
];

function updateLinks(content) {
  let updated = content;
  pages.forEach(page => {
    // Only replace href="page" or href='page' with absolute path
    const regex = new RegExp(`href=["']${page}["']`, 'g');
    updated = updated.replace(regex, `href="/es/${page}"`);
  });
  return updated;
}

function updateHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const newContent = updateLinks(content);
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated links in: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      updateHtmlFile(fullPath);
    }
  });
}

walkDir(path.join(process.cwd(), 'es')); 