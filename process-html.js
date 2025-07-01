const fs = require('fs');
const path = require('path');

console.log('Processing HTML files for Vercel deployment...');

// Function to process HTML content
function processHtmlContent(content) {
  // Remove 'dist/' prefix from all asset paths
  content = content.replace(/dist\/(images|img|videos|css|fonts|js)\//g, '$1/');
  // Remove '../dist/' prefix from image paths (for Spanish pages)
  content = content.replace(/\.\.\/dist\/(images|img|videos|css|fonts|js)\//g, '../$1/');
  // Remove preload link for quicksand-v30-latin-regular.woff2
  content = content.replace(/<link[^>]*preload[^>]*quicksand-v30-latin-regular\.woff2[^>]*>\s*/gi, '');
  return content;
}

// Recursively get all HTML files in the project (including subdirectories)
function getAllHtmlFiles(dir, files = []) {
  const fs = require('fs');
  const path = require('path');
  fs.readdirSync(dir).forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'dist') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (file.endsWith('.html')) {
      files.push(fullPath);
    }
  });
  return files;
}

const projectRoot = __dirname;
const htmlFiles = getAllHtmlFiles(projectRoot);

htmlFiles.forEach(sourcePath => {
  const relPath = path.relative(projectRoot, sourcePath);
  const destPath = path.join(projectRoot, 'public', relPath); // changed from 'dist' to 'public'
  // Ensure destination directory exists
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  // Process and write the file
  const content = fs.readFileSync(sourcePath, 'utf8');
  const processed = processHtmlContent(content);
  fs.writeFileSync(destPath, processed, 'utf8');
  console.log(`Processed HTML: ${sourcePath} → ${destPath}`);
});

// Copy other files
const otherFiles = [
  'sitemap.xml',
  'sw.js'
];

otherFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(__dirname, 'public', file); // changed from 'dist' to 'public'
  if (fs.existsSync(sourcePath)) {
    try {
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${sourcePath} → ${destPath}`);
    } catch (error) {
      console.error(`Error copying ${sourcePath}:`, error.message);
    }
  }
});

console.log('HTML processing complete!');