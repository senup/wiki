import{_ as t,o as n,c as o,k as a,a as e}from"./chunks/framework.7FlijoJG.js";const M=JSON.parse('{"title":"markdown","description":"","frontmatter":{"title":"markdown","date":"2024-01-03T15:45:14.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"常用工具/markdown.md","filePath":"常用工具/markdown.md","lastUpdated":1711296665000}'),d={name:"常用工具/markdown.md"},s=a("h2",{id:"转义符号",tabindex:"-1"},[e("转义符号 "),a("a",{class:"header-anchor",href:"#转义符号","aria-label":'Permalink to "转义符号"'},"​")],-1),r=a("p",null,'如果你在 Obsidian 的 Markdown 模式中输入了"<" 或者">"这样的特殊符号,可能会打乱你的排版,因为 Markdown 会将其解析为 HTML 标签。这种时候,你就需要使用转义字符来"隐藏"它们,也就是在它们前面加上一个反斜杠()。',-1),l=a("p",null,[e('比如你想输入"'),a("code",null,"<Java>"),e('",你可以这样写:"'),a("code",null,"\\<Java\\>"),e('"。这样 Obsidian 就不会将其当作 HTML 标签来解析,而是直接显示出"'),a("code",null,"<Java>"),e('"。')],-1),c=a("p",null,'同样的,如果你想输入其它 Markdown 语法中的特殊字符,比如"#", "*", "_"等,也可以使用同样的方式进行转义,这样 Obsidian 就不会将其解析为 Markdown 语法,而是直接显示原字符。',-1),i=[s,r,l,c];function _(m,p,h,k,u,f){return n(),o("div",null,i)}const T=t(d,[["render",_]]);export{M as __pageData,T as default};
