
## vitePress

没错，就是本站用来搭建 Wiki 的一个工具包。

准备工具：
- Obsidian: 编写 markdown 文档
- Vs code: 用于修改样式
- shell：Mac 自带的即可

运行环境：macOS
## 快速上手

具体步骤查看： [VitePress中文网](https://vitejs.cn/vitepress/guide/getting-started.html)

官方文档的几条指令写的很清楚，只要能在本地预览成功即可, 会看到一个非常简陋的网页。

如果遇到 Node 版本太低，最快的解决方式就是 nodejs 官网直接下载一个最新的版本覆盖安装即可，不要花太多时间去折腾 shell 的一些指令，比如 sudo、homebrew 安装等。

## vitePress实战

因为懒得折腾，所以直接抄别人作业显然是最快的方式。


首先在 GitHub 建立一个 repository，命名为 wiki，然后使用 git clone 命令克隆到本地。

找到该文件夹用 Mac 自带的终端打开，然后执行指令在本地安装 vitepress。

```shell
yarn add --dev vitepress
```

接下来直接在根目录拷贝这几个文件

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221205399.png)

然后复制其他人的样式。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221206291.png)


修改成自己的样式，主要有两个文件，一个是 config.mts，一个是 index.md。按照个人喜好修改即可。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221234768.png)
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221234288.png)


因为我已经使用了 xxx.github.io 作为仓库，因此另起炉灶开了一个 wiki 的 repository。控制路由的时候，需要额外配置基础的 base 路径，如下：

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221240797.png)



在根目录执行 `npm install`，这个时候就会有一个超级大的 node_modules 文件夹产生。所以为了不让这部分代码被上传，可以在根目录配置 ignore 文件。

```
/. History
Node_modules
/docs/. Vitepress/dist
.DS_Store
```


上面修改的差不多了，这个时候可以直接预览来查看效果，使用 `yarn docs:dev` 来查看效果，会返回一个 http://localhost:5173/wiki/ 给你进行预览。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221247448.png)

这期间可能因为 markdown 文件解析成静态的 HTML 会出现问题，怎么进行排查呢？

终端其实不会给你任何提示，所以需要的就是网页上面多点点，比如打开某个链接，就能看到一些报错信息。我遇到最多的是：
- 标签未闭合。比如 markdown 文档里面写了泛型，如 `List<T>`,那么坑人的 vue 就会提示你标签没有闭合，这种情况我暂时是先加了两个顿号包裹起来，这样构建才不会有问题。
- 提示死亡链接。也就是链接失效了，所以上面在 config 里面配置了忽略检测死亡链接，不可能因为一个链接失效而所有文章都构建失败吧。

总结就是尽量不要使用标签和左右括号。

---


然后是根目录新建一个 .github 的文件夹，下面再建一个 workflows 文件夹，下面放着一个 deploy.yml 的文件。内容如下：
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221215701.png)

简单来说，这段代码主要就是当你 push 代码到 main 分支的时候，那么任务会在 GitHub Action 自动部署。比如初始化环境以及构建部署，最终生成的静态文件会被放到 gh-pages 分支上面（不需要自己建 gh-pages 分支）。

其中的 GITHUB_TOKEN 需要在 GitHub 头像的 setting 选项中打开，找到 development 这个选项，然后选择生成个人的一个密钥，密钥的 note 选项就填入 GITHUB_TOKEN。然后权限那里需要勾选 repo、workflow、admin: repo_hook 这三个。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221220488.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221221725.png)


再把部署代码的仓库 setting 打开，其中 Actions-General 选项卡的工作流权限，打开读写权限，不然 actions 构建的时候会提示没有权限。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221225750.png)


以上整好后，在根目录直接使用命令 `git add . && git commit -m "提交完整代码" && git push` 提交到 GitHub 上面，这个时候就会 push 代码并建立 gh-pages 分支，启动 GitHub Action 自动部署。

如果在 GitHub Action 发现构建失败，那么就需要点开界面上的错误信息❌，观察是哪一步出错了，然后对症下药，这里一般出错在 deploy.yml 或者 markdown 解析出错。

构建完成后，pages 服务读取的分支需要改成 gh-pages 分支。构建完成后访问上方的链接即可。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311221226669.png)


## 双链转超链

背景：当前工作流本地使用的 obsidian，它的双链是由两个中括号括起来的，在编辑器内可以自由跳转和预览。但是线上部署的是 github page，解析后还是会产生中括号环绕的现象。而我希望本地和线上能出现同样的效果，为此我一开始是打算让 vitepress 渲染的时候自动将中括号解析成 HTML 的格式，但是失败了。

我尝试了好久，根据官网的 markdown-it 语法例子写了诸多版本的 JS 插件，最终渲染不出来，这一直让我很苦恼。

后面反过来想想，obsidian 除了双链，其实传统的相对链接也是能够引用的，于是我转头把目标改成了——将本地的中括号转化成相对链接。

实现起来也不复杂，就是写个正则替换脚本即可。

使用方式：

根目录存放 `replace.js` 的脚本，然后执行：

`node replace.js`

脚本代码：

```js
const fs = require('fs');
const path = require('path');
const directoryPath = __dirname;

function replaceMarkdownLink(filePath) {
  if (path.extname(filePath).toLowerCase() !== '.md') {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const replacedContent = content.replace(/\[\[([^\[\]]*?)\]\]/g, '[$1]($1.md)');
  
  fs.writeFileSync(filePath, replacedContent, 'utf-8');
}

function processDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath);
    } else {
      replaceMarkdownLink(filePath);
    }
  }
}

processDirectory(directoryPath);

```



## 忽略文件夹



## 自动生成侧边栏