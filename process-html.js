const fs = require('fs');
const path = require('path');

console.log('Processing HTML files for Vercel deployment...');

// Function to process HTML content
function processHtmlContent(content) {
  // Remove 'dist/' prefix from image paths
  content = content.replace(/src="dist\//g, 'src="');
  content = content.replace(/srcset="dist\//g, 'srcset="');
  content = content.replace(/href="dist\//g, 'href="');
  
  // Remove '../dist/' prefix from image paths (for Spanish pages)
  content = content.replace(/src="\.\.\/dist\//g, 'src="../');
  content = content.replace(/srcset="\.\.\/dist\//g, 'srcset="../');
  content = content.replace(/href="\.\.\/dist\//g, 'href="../');
  
  return content;
}

// Function to process a single HTML file
function processHtmlFile(sourcePath, destPath) {
  try {
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Read and process the file
    const content = fs.readFileSync(sourcePath, 'utf8');
    const processedContent = processHtmlContent(content);
    
    // Write the processed file
    fs.writeFileSync(destPath, processedContent);
    console.log(`Processed: ${sourcePath} → ${destPath}`);
  } catch (error) {
    console.error(`Error processing ${sourcePath}:`, error.message);
  }
}

// Process root HTML files
const rootHtmlFiles = [
  'index.html',
  'about.html', 
  'services.html',
  'contact.html',
  'pricing.html',
  'blog.html',
  'estimate.html',
  'invoice.html',
  'offline.html'
];

rootHtmlFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(__dirname, 'dist', file);
  
  if (fs.existsSync(sourcePath)) {
    processHtmlFile(sourcePath, destPath);
  }
});

// Process Spanish HTML files
const spanishHtmlFiles = [
  'es/index.html',
  'es/sobre-nosotros.html',
  'es/servicios.html', 
  'es/precios.html',
  'es/contacto.html'
];

spanishHtmlFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(__dirname, 'dist', file);
  
  if (fs.existsSync(sourcePath)) {
    processHtmlFile(sourcePath, destPath);
  }
});

// Process admin HTML files
const adminHtmlFiles = [
  'admin/calculator.html'
];

adminHtmlFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(__dirname, 'dist', file);
  
  if (fs.existsSync(sourcePath)) {
    processHtmlFile(sourcePath, destPath);
  }
});

// Copy other files
const otherFiles = [
  'sitemap.xml',
  'sw.js'
];

otherFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(__dirname, 'dist', file);
  
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