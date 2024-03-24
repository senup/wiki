const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, 'docs');
const sidebarFile = path.join(__dirname, '.vitepress', 'sidebar.js');

function generateSidebar() {
  const sidebar = {};

  // 遍历docs目录下的所有文件和子目录
  const filesAndDirs = fs.readdirSync(docsPath);

  filesAndDirs.forEach((name) => {
    const fullPath = path.join(docsPath, name);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      sidebar[`/${name}/`] = fs.readdirSync(fullPath)
        .filter(filename => filename.endsWith('.md') && filename !== 'README.md')
        .map(filename => `/${name}/${filename}`);
    }
  });

  return sidebar;
}

function writeSidebarConfig(sidebar) {
  const content = `module.exports = ${JSON.stringify(sidebar, null, 2)};\n`;
  fs.writeFileSync(sidebarFile, content, 'utf-8');
  console.log('侧边栏配置已生成:', sidebarFile);
}

const sidebar = generateSidebar();
writeSidebarConfig(sidebar);