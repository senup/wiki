// module.exports = (md) => {
//     console.log('Plugin initialized! Word: Hello');

//     md.core.ruler.push('double-links', (state) => {
//       const regex = /\[\[([^\]]+)\]\]/g;
//       state.src = state.src.replace(regex, (_, content) => {
//         const linkText = content.trim();
//         const linkPath = `${linkText}.md`;
//         return `[${linkText}](${linkPath})`;
//       });
//     });
//   };
  

// module.exports = (md) => {
//     md.core.ruler.push('double-links', (state) => {
//       const regex = /\[\[([^\]]+)\]\]/g;
//       state.src = state.src.replace(regex, (_, content) => {
//         const linkText = content.trim();
//         const linkPath = `${linkText}.md`;
//         const changedContent = `[${linkText}](${linkPath})`;
  
//         // Log the changes
//         console.log(`Changed "${_}" to "${changedContent}"`);
  
//         return changedContent;
//       });
//     });
//   };
  



// module.exports = (md) => {
//     let insideCodeBlock = false;
  
//     md.core.ruler.push('double-links', (state) => {
//       const regex = /\[\[([^\]]+)\]\]/g;
  
//       state.src = state.src.replace(regex, (_, content) => {
//         if (!insideCodeBlock) {
//           const linkText = content.trim();
//           const linkPath = `${linkText}.md`;
//           const changedContent = `[${linkText}](${linkPath})`;
  
//           // Log the changes
//           console.log(`Changed "${_}" to "${changedContent}"`);
  
//           return changedContent;
//         } else {
//           return _; // Return the original content if inside a code block
//         }
//       });
//     });
  
//     // Update the insideCodeBlock state when encountering code block markers
//     md.core.ruler.push('track-code-blocks', (state) => {
//       const codeBlockRules = state.md.block.ruler.getRules('fence');
  
//       for (const rule of codeBlockRules) {
//         state.tokens.forEach((token) => {
//           if (token.type === 'fence' && token.info === rule) {
//             insideCodeBlock = !insideCodeBlock;
//           }
//         });
//       }
//     });
//   };
  

  module.exports = (md) => {
    let insideCodeBlock = false;
  
    md.core.ruler.push('double-links', (state) => {
      const regex = /\[\[([^\]]+)\]\]/g;
  
      state.tokens.forEach((token) => {
        if (token.type === 'fence' && token.info) {
          // Check if it's a code block that needs exclusion
          const excludedLanguages = ['java', 'html']; // Add more languages as needed
          const language = token.info.trim().toLowerCase();
  
          if (excludedLanguages.includes(language)) {
            insideCodeBlock = true;
          } else {
            insideCodeBlock = false;
          }
        }
  
        if (token.type !== 'inline') {
          return;
        }
  
        if (!insideCodeBlock) {
          token.content = token.content.replace(regex, (_, content) => {
            const linkText = content.trim();
            const linkPath = `${linkText}.md`;
            const changedContent = `[${linkText}](${linkPath})`;
  
            // Log the changes
            console.log(`Changed "${_}" to "${changedContent}"`);
  
            return changedContent;
          });
        }
      });
    });
  };
  