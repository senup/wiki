// linkConverter.js

module.exports = {
    enhanceApp({ app, router, siteData }) {
      // Parse double links in Markdown content
      router.afterEach((to) => {
        const { content } = siteData.pages.find((page) => page.path === to.path) || {};
  
        if (content) {
          const convertedContent = content.replace(/\[\[([^\]]+)\]\]/g, '<li><a href="./$1.html">$1</a></li>');
          siteData.pages.find((page) => page.path === to.path).content = convertedContent;
        }
      });
    },
  };
  