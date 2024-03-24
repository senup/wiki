---
title: markdown
date: 2024-01-03 15:45:14
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---
## 转义符号
如果你在 Obsidian 的 Markdown 模式中输入了"<" 或者">" 这样的特殊符号，可能会打乱你的排版，因为 Markdown 会将其解析为 HTML 标签。这种时候，你就需要使用转义字符来"隐藏"它们，也就是在它们前面加上一个反斜杠()。

比如你想输入"<Java>"，你可以这样写："\<Java\>"。这样 Obsidian 就不会将其当作 HTML 标签来解析，而是直接显示出"<Java>"。

同样的，如果你想输入其它 Markdown 语法中的特殊字符，比如"#", "\*", "\_"等，也可以使用同样的方式进行转义，这样 Obsidian 就不会将其解析为 Markdown 语法，而是直接显示原字符。

<!--more-->
