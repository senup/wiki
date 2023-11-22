// 创建一个名为 markdown-link-resolver.js 的插件文件
export default ({ app, router, site, isServer }) => {
  // 引入 markdown-it
  const md = require('markdown-it')();

  // 在渲染 markdown 之前注册插件
  app.config.configureMarkdown((md) => {
    // 自定义解析双链接的规则
    const defaultRender = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const href = token.attrGet('href');
      // 如果链接以双方括号[[...]]格式，进行特殊处理
      if (href.startsWith('[[') && href.endsWith(']]')) {
        const linkText = href.substring(2, href.length - 2);
        const newHref = `./${linkText}.html`;
        return `<li><a href="${newHref}">${linkText}</a></li>`;
      }
      // 如果不是双链接格式，使用默认渲染
      return defaultRender(tokens, idx, options, env, self);
    };
  });
};
