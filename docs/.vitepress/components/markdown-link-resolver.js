// markdown-link-resolver.js

// 导出一个函数作为 VitePress 插件
module.exports = (options = {}, app) => {
    return {
      // 在 Markdown 渲染中扩展功能
      extendMarkdown: (md) => {
        // 在 link 解析之前注册自定义解析规则
        md.inline.ruler.before('link', 'double-link-resolver', (state) => {
          // 获取当前解析状态中的 tokens
          const { tokens } = state;
  
          // 遍历所有 token
          for (let i = 0; i < tokens.length; i++) {
            // 检查是否是行内元素
            if (tokens[i].type === 'inline') {
              // 遍历行内元素的子元素
              tokens[i].children.forEach((token, index) => {
                // 检查是否为文本类型的 token 并且内容匹配双链格式 [[...]]
                if (token.type === 'text' && /\[\[([^\]]+)\]\]/.test(token.content)) {
                  // 获取双链内容并构建链接目标
                  const linkText = token.content;
                  const linkTarget = linkText.slice(2, -2) + '.md';
  
                  // 创建新的链接 token
                  const newToken = new state.Token('link_open', 'a', 1);
                  newToken.attrs = [['href', linkTarget]];
  
                  // 创建文本内容 token
                  const textToken = new state.Token('text', '', 0);
                  textToken.content = linkText.slice(2, -2);
  
                  // 创建链接关闭 token
                  const closeToken = new state.Token('link_close', 'a', -1);
  
                  // 将双链替换为新的链接 token、文本内容 token 和链接关闭 token
                  tokens[i].children.splice(index, 1, newToken, textToken, closeToken);
                }
              });
            }
          }
        });
      },
    };
  };
  