const fs = require('fs');
const path = require('path');

// 递归遍历指定目录下的Markdown文件，并按文件夹分组
function getMarkdownFiles(dir, baseDir) {
    let results = {};
    const list = fs.readdirSync(dir);

    list.forEach(function(file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* 递归进入子目录 */
            results = {...results, ...getMarkdownFiles(file, baseDir)};
        } else {
            /* 如果是Markdown文件，则加入列表 */
            if (path.extname(file) === '.md') {
                const dirPath = path.relative(baseDir, path.dirname(file));
                if (!results[dirPath]) {
                    results[dirPath] = [];
                }
                results[dirPath].push(file);
            }
        }
    });
    return results;
}

// 生成侧边栏配置对象
function generateSidebarConfig(filesByDirectory) {
    let sidebar = [];
    for (const dir in filesByDirectory) {
        let items = filesByDirectory[dir].map((filePath) => {
            // 获取相对于docs目录的文件路径
            const relativePath = path.relative(docsPath, filePath);
            // 生成侧边栏显示的文本，通常为文件名（去掉.md后缀）
            const text = path.basename(filePath, '.md');
            return {
                text: text,
                link: `/${relativePath}`,
            };
        });
        // 使用文件夹名作为侧边栏的分类标题
        let text = dir || 'Home';
        sidebar.push({
            text: text,
            items: items
        });
    }
    return sidebar;
}

// 假设你的Markdown文件在docs目录下
const docsPath = path.join(__dirname, 'docs');
const markdownFilesByDirectory = getMarkdownFiles(docsPath, docsPath);
const sidebarConfig = generateSidebarConfig(markdownFilesByDirectory);

// 写入sidebar-config.json到.vitepress目录
const configPath = path.join(docsPath, '.vitepress', 'sidebar-config.json');
fs.writeFileSync(configPath, JSON.stringify(sidebarConfig, null, 2), 'utf8');

console.log('Sidebar config generated successfully.');