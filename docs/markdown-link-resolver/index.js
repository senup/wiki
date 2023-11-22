// markdown-link-resolver/index.js

module.exports = (options = {}) => {
    return {
      name: 'markdown-link-resolver',
      markdown: {
        extendMarkdown(md) {
          // 重写渲染函数以解析双链接
          const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
          };
  
          md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
            const token = tokens[idx];
            const href = token.attrGet('href');
            if (href && href.startsWith("[[") && href.endsWith("]]")) {
              const linkText = href.slice(2, -2);
              const html = `<li><a href="./${linkText}.html">${linkText}</a></li>`;
              return html;
            }
            return defaultRender(tokens, idx, options, env, self);
          };
        }
      }
    };
  };
  