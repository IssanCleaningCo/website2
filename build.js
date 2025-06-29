const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting build process...');

// Ensure dist/js directory exists
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

console.log('Build completed successfully!'); 