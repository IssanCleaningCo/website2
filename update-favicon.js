const fs = require('fs');
const path = require('path');

// Regex to match any <link rel="icon" ... href*="favicon.png" ...> line, flexible to path, attribute order, spacing, and quote style
const OLD_FAVICON_REGEX = /<link\s+[^>]*rel=['"]icon['"][^>]*href=['"][^'"]*favicon\.png['"][^>]*>/gi;
const NEW_FAVICON_TAG = '<link rel="icon" href="/favicon.ico" type="image/x-icon" />';

function updateHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace any old favicon line with the new one
  if (OLD_FAVICON_REGEX.test(content)) {
    content = content.replace(OLD_FAVICON_REGEX, NEW_FAVICON_TAG);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated favicon in: ${filePath}`);
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

walkDir(process.cwd()); 