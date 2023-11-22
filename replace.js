const fs = require('fs');
const path = require('path');
const directoryPath = __dirname;

function replaceMarkdownLink(filePath) {
  if (path.extname(filePath).toLowerCase() !== '.md') {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const replacedContent = content.replace(/\[\[([^\[\]]*?)\]\]/g, '[$1]($1.md)');
  
  fs.writeFileSync(filePath, replacedContent, 'utf-8');
}

function processDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath);
    } else {
      replaceMarkdownLink(filePath);
    }
  }
}

processDirectory(directoryPath);