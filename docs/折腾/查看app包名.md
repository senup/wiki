---
title: app包名
date: 2023-12-28 08:47:14
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

## Osascript
"osascript"其实是一个非常强大的命令行工具，它允许你运行 AppleScript 和 JavaScript 等脚本。这些脚本可以用来做许多事情，比如操作应用程序、操纵系统设置、调整硬件设备状态等等。

打开Mac上的"Utility"文件夹中的"终端"应用，然后键入以下命令：`osascript -e 'id of app "Mail"'`。记住，要将"Mail"替换为你要查找的应用的名字。然后，按下回车键，它会显示出对应应用的包名。

➜ /Applications `osascript -e 'id of app "Mail"'`
com.Apple.Mail
➜ /Applications `osascript -e 'id of app "Typora"'`
abnerworks.Typora
➜ /Applications `osascript -e 'id of app "Obsidian"'`
md.Obsidian
➜ /Applications

 ## 使用"Finder"中的"显示包内容"  
首先，在"Finder"中找到你要查看包名的应用，例如"Mail.app"。然后，右击应用的图标并选择"显示包内容"。接下来，打开"Contents"文件夹并找到一个名为"Info.plist"的文件，用文本编辑器打开它。在这个文件中，你可以找到一个值为"CFBundleIdentifier"的键，它的值就是程序的包名，例如"com.apple.mail"。
<!--more-->
