module.exports = {
    name: 'link-parser',
    extendMarkdown: md => {
      md.core.ruler.push('custom_link_parser', state => {
        // Log the original content
        console.log('Original content:', state.src);
  
        // Your logic for parsing double-bracket links and replacing them with HTML
        // state.src contains the Markdown source content
        // Modify the state.src accordingly
        // For instance, use regular expressions to find and replace [[Hello]] with HTML
  
        state.src = state.src.replace(/\[\[(.*?)\]\]/g, '<li><a href="./$1.html">$1</a></li>');
  
        // Log the updated content
        console.log('Updated content:', state.src);
      });
    }
  };
  