---
title: Hello，Github
date: 2023-11-09T01:47:03
tags:
  - git
  - tech
  - hello
draft: true
hideInList: false
feature: 
isTop: false
---

## github 挂载配置

https://raw.githubusercontent.com/Moli-X/Resources/main/Script/Bilibili/AD_Bilibili.conf
研究QuantumultX的时候，发现这种raw.githubusercontent.com的域名有种似曾相识的感觉，但是没想出来github什么时候提供了这种功能。后面发现自己傻了，这其实就是普通仓库中某个文件的raw格式。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311120152504.png)



## gist是什么






## 无法读取远程仓库

```shell
32GM1-Pro: wiki butcher$ git push

kex_exchange_identification: Connection closed by remote host
Connection closed by 20.205.243.160 port 443
致命错误：无法读取远程仓库。
```



## ignore 文件删除已提交的

配置 gitignore，把不想提交的内容写进去，然后执行下面这句。

```
git rm --cached -r && git add . && git commit -am "注释" && git push
```

<!--more-->