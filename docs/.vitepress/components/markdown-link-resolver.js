module.exports = (md) => {
  md.core.ruler.push('custom-link-resolver', (state) => {
    state.tokens.forEach((token) => {
      if (token.type === 'inline' && token.children) {
        token.children.forEach((child, index) => {
          if (
            child.type === 'link_open' &&
            token.children[index + 1]?.type === 'text' &&
            token.children[index + 1]?.content.startsWith('[[') &&
            token.children[index + 1]?.content.endsWith(']]')
          ) {
            const linkText = token.children[index + 1].content.slice(2, -2);
            const newToken = new state.Token('html_block', '', 0);
            newToken.content = `<li><a href="./${linkText}.html">${linkText}</a></li>`;
            token.children[index + 1] = newToken;
          }
        });
      }
    });
  });
};
