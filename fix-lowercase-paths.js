const fs = require('fs');
const path = require('path');

// Recursively rename files and folders to lowercase
function renameToLowerCase(dir) {
  fs.readdirSync(dir).forEach(file => {
    if (file === 'node_modules' || file === '.git') return;
    const oldPath = path.join(dir, file);
    const stat = fs.statSync(oldPath);

    // Recursively process directories
    if (stat.isDirectory()) {
      renameToLowerCase(oldPath);
    }

    // Rename if not already lowercase
    const lower = file.toLowerCase();
    if (file !== lower) {
      const tempPath = path.join(dir, lower + '_temp');
      const newPath = path.join(dir, lower);

      // Step 1: Rename to a temp name if the target exists (case-insensitive)
      if (fs.existsSync(newPath)) {
        fs.renameSync(oldPath, tempPath);
        fs.renameSync(tempPath, newPath);
      } else {
        fs.renameSync(oldPath, newPath);
      }
    }
  });
}

// Update HTML files to use lowercase paths in src, href, srcset
function updateHtmlPaths(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      updateHtmlPaths(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      // Replace src, href, srcset values with lowercase
      content = content.replace(/(src|href|srcset)="([^"]+)"/gi, (match, attr, val) => {
        return `${attr}="${val.toLowerCase()}"`;
      });
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

// Run the script
const root = process.cwd();
renameToLowerCase(root);
updateHtmlPaths(root);

console.log('All files/folders renamed to lowercase and HTML paths updated.');