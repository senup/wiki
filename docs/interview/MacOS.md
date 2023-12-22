---
title: MacOS
date: 2023-11-07 23:23:28
tags:
  - tech
  - mac
  - finder
  - hello
draft: false
hideInList: false
feature: 
isTop: false
---

## Finder

找出 当前文件夹或子目录下面所有的  pdf 文件并拷贝放到pdf文件夹下面
```
find ./  -name  "*.pdf" -exec mv {} ./pdf \;
```


## 剪切
其实访达中也可以实现剪切功能，只不过剪切的行为不是发生在开始，而是发生在粘贴时。

按下`command+C`快捷键之后，在目标目录按下`option+command+V`就可以将刚才复制的文件和目录移动到目标目录，即实现了剪切功能。





## [PopClip](https://github.com/tisfeng/Easydict/blob/main/README.md) 


开启 easydict。你需要先安装 [PopClip](https://pilotmoon.com/popclip/)，然后选中以下代码块，`PopClip` 会显示 "安装扩展 Easydict"，点击它即可。（By **[liziqiang](https://github.com/liziqiang)**）

```shell
# popclip
name: Easydict
icon: iconify:ri:translate
interpreter: zsh
shell script: |
  result=$(ps aux | grep Easydict.app | wc -l)
  if [[ $result -lt 2 ]];then
    open /Applications/Easydict.app
    sleep 2
  fi
  open "easydict://query?text=$POPCLIP_TEXT"
```

> 参考：[https://www.popclip.app/dev/shell-script-actions](https://www.popclip.app/dev/shell-script-actions)


## alias 别名

第一次的话需要手动打开 `open ~/.Bash_profile`，复制下面这段即可使用别名简化终端操作。

```shell
# 打开.bash_profile配置文件
alias edit="open ~/.bash_profile"
# 重新加载.bash_profile配置文件
alias save="source ~/.bash_profile"
eval "$(/opt/homebrew/bin/brew shellenv)"

# 预览wiki并启动本地服务
alias wikipre="open http://localhost:5173/wiki/ && cd '/Users/butcher/Library/Mobile Documents/com~apple~CloudDocs/wiki' && yarn docs:dev "


# 预览博客并启动本地服务器
alias blogpre="open http://localhost:1313/ && cd '/Users/butcher/Library/Mobile Documents/com~apple~CloudDocs/senup.github.io' && hugo server -D "

# 替换双链成为超链
alias replace="cd '/Users/butcher/Library/Mobile Documents/com~apple~CloudDocs/wiki' && node replace.js "

```



## 修改默认程序
右键简介-全部更改
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311301238958.png)

<!--more-->

## Finder

找出当前文件夹或子目录下面所有的  pdf 文件并拷贝放到 pdf 文件夹下面
```
find ./  -name  "*.pdf" -exec mv {} ./pdf \;
```


## 剪切
其实访达中也可以实现剪切功能，只不过剪切的行为不是发生在开始，而是发生在粘贴时。

按下 `command+C` 快捷键之后，在目标目录按下 `option+command+V` 就可以将刚才复制的文件和目录移动到目标目录，即实现了剪切功能。





## [PopClip](https://github.com/tisfeng/Easydict/blob/main/README.md) 


开启 easydict。你需要先安装 [PopClip](https://pilotmoon.com/popclip/)，然后选中以下代码块，`PopClip` 会显示 "安装扩展 Easydict"，点击它即可。（By **[liziqiang](https://github.com/liziqiang)**）

```shell
# popclip
name: Easydict
icon: iconify:ri:translate
interpreter: zsh
shell script: |
  result=$(ps aux | grep Easydict.app | wc -l)
  if [[ $result -lt 2 ]];then
    open /Applications/Easydict.app
    sleep 2
  fi
  open "easydict://query?text=$POPCLIP_TEXT"
```

> 参考：[https://www.popclip.app/dev/shell-script-actions](https://www.popclip.app/dev/shell-script-actions)

## 访达窗口始终使用标签页开启
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311301446302.png)


设置好之后，1. Command+N 快捷键打开； 2. 在文件夹上右键“在新标签页打开”； 3. 点击访达菜单栏窗口-合并所有窗口。

