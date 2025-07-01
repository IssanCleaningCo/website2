const fs = require('fs');
const path = require('path');

function updateScriptReferences(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateScriptReferences(fullPath);
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Remove all 'dist/' from paths (do NOT replace with 'public/')
      content = content.replace(/dist\//g, '');
      // Optionally, also update script references
      content = content.replace(/js\/script\.js/g, 'js/script.min.js');
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  });
}

updateScriptReferences(path.join(__dirname, 'public'));
console.log('Removed all dist/ references and updated js/script.js to js/script.min.js in public/.');
