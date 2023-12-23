import{_ as a,o as e,c as s,R as t}from"./chunks/framework.7FlijoJG.js";const m=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"interview/git.md","filePath":"interview/git.md","lastUpdated":1703310429000}'),n={name:"interview/git.md"},l=t(`<ul><li><a href="#集中式与分布式">集中式与分布式</a></li><li><a href="#中心服务器">中心服务器</a></li><li><a href="#工作流">工作流</a></li><li><a href="#分支实现">分支实现</a></li><li><a href="#冲突">冲突</a></li><li><a href="#fast-forward">Fast forward</a></li><li><a href="#分支管理策略">分支管理策略</a></li><li><a href="#储藏stashing">储藏（Stashing）</a></li><li><a href="#ssh-传输设置">SSH 传输设置</a></li><li><a href="#gitignore-文件">.gitignore 文件</a></li><li><a href="#git-命令一览">Git 命令一览</a></li><li><a href="#参考资料">参考资料</a></li></ul><h2 id="集中式与分布式" tabindex="-1">集中式与分布式 <a class="header-anchor" href="#集中式与分布式" aria-label="Permalink to &quot;集中式与分布式&quot;">​</a></h2><p>Git 属于分布式版本控制系统，而 SVN 属于集中式。</p><p>集中式版本控制只有中心服务器拥有一份代码，而分布式版本控制每个人的电脑上就有一份完整的代码。</p><p>集中式版本控制有安全性问题，当中心服务器挂了所有人都没办法工作了。</p><p>集中式版本控制需要连网才能工作，如果网速过慢，那么提交一个文件会慢的无法让人忍受。而分布式版本控制不需要连网就能工作。</p><p>分布式版本控制新建分支、合并分支操作速度非常快，而集中式版本控制新建一个分支相当于复制一份完整代码。</p><h2 id="中心服务器" tabindex="-1">中心服务器 <a class="header-anchor" href="#中心服务器" aria-label="Permalink to &quot;中心服务器&quot;">​</a></h2><p>中心服务器用来交换每个用户的修改，没有中心服务器也能工作，但是中心服务器能够 24 小时保持开机状态，这样就能更方便的交换修改。</p><p>Github 就是一个中心服务器。</p><h2 id="工作流" tabindex="-1">工作流 <a class="header-anchor" href="#工作流" aria-label="Permalink to &quot;工作流&quot;">​</a></h2><p>新建一个仓库之后，当前目录就成为了工作区，工作区下有一个隐藏目录 .git，它属于 Git 的版本库。</p><p>Git 的版本库有一个称为 Stage 的暂存区以及最后的 History 版本库，History 存储所有分支信息，使用一个 HEAD 指针指向当前分支。</p><ul><li>git add files 把文件的修改添加到暂存区</li><li>git commit 把暂存区的修改提交到当前分支，提交之后暂存区就被清空了</li><li>git reset -- files 使用当前分支上的修改覆盖暂存区，用来撤销最后一次 git add files</li><li>git checkout -- files 使用暂存区的修改覆盖工作目录，用来撤销本地修改</li></ul><p>可以跳过暂存区域直接从分支中取出修改，或者直接提交修改到分支中。</p><ul><li>git commit -a 直接把所有文件的修改添加到暂存区然后执行提交</li><li>git checkout HEAD -- files 取出最后一次修改，可以用来进行回滚操作</li></ul><h2 id="分支实现" tabindex="-1">分支实现 <a class="header-anchor" href="#分支实现" aria-label="Permalink to &quot;分支实现&quot;">​</a></h2><p>使用指针将每个提交连接成一条时间线，HEAD 指针指向当前分支指针。</p><p>新建分支是新建一个指针指向时间线的最后一个节点，并让 HEAD 指针指向新分支，表示新分支成为当前分支。</p><p>每次提交只会让当前分支指针向前移动，而其它分支指针不会移动。</p><p>合并分支也只需要改变指针即可。</p><h2 id="冲突" tabindex="-1">冲突 <a class="header-anchor" href="#冲突" aria-label="Permalink to &quot;冲突&quot;">​</a></h2><p>当两个分支都对同一个文件的同一行进行了修改，在分支合并时就会产生冲突。</p><p>Git 会使用 &lt;&lt;&lt;&lt;&lt;&lt;&lt; ，======= ，&gt;&gt;&gt;&gt;&gt;&gt;&gt; 标记出不同分支的内容，只需要把不同分支中冲突部分修改成一样就能解决冲突。</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span></span>
<span class="line"><span style="color:#e1e4e8;">Creating a new branch is quick &amp; simple.</span></span>
<span class="line"><span style="color:#e1e4e8;">=======</span></span>
<span class="line"><span style="color:#e1e4e8;">Creating a new branch is quick AND simple.</span></span>
<span class="line"><span style="color:#e1e4e8;">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature1</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span></span>
<span class="line"><span style="color:#24292e;">Creating a new branch is quick &amp; simple.</span></span>
<span class="line"><span style="color:#24292e;">=======</span></span>
<span class="line"><span style="color:#24292e;">Creating a new branch is quick AND simple.</span></span>
<span class="line"><span style="color:#24292e;">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature1</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="fast-forward" tabindex="-1">Fast forward <a class="header-anchor" href="#fast-forward" aria-label="Permalink to &quot;Fast forward&quot;">​</a></h2><p>&quot;快进式合并&quot;（fast-farward merge），会直接将 master 分支指向合并的分支，这种模式下进行分支合并会丢失分支信息，也就不能在分支历史上看出分支信息。</p><p>可以在合并时加上 --no-ff 参数来禁用 Fast forward 模式，并且加上 -m 参数让合并时产生一个新的 commit。</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">$ git merge --no-ff -m &quot;merge with no-ff&quot; dev</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">$ git merge --no-ff -m &quot;merge with no-ff&quot; dev</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="分支管理策略" tabindex="-1">分支管理策略 <a class="header-anchor" href="#分支管理策略" aria-label="Permalink to &quot;分支管理策略&quot;">​</a></h2><p>master 分支应该是非常稳定的，只用来发布新版本；</p><p>日常开发在开发分支 dev 上进行。</p><h2 id="ignore-文件删除已提交的" tabindex="-1">ignore 文件删除已提交的 <a class="header-anchor" href="#ignore-文件删除已提交的" aria-label="Permalink to &quot;ignore 文件删除已提交的&quot;">​</a></h2><p>配置 gitignore，把不想提交的内容写进去，然后执行下面这句。 效果是删除根目录下所有已被追踪且已 commit 的文件，并覆盖远程仓库，本地文件不受影响。</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">git rm --cached -r ./ &amp;&amp; git add . &amp;&amp; git commit -am &quot;注释&quot; &amp;&amp; git push</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">git rm --cached -r ./ &amp;&amp; git add . &amp;&amp; git commit -am &quot;注释&quot; &amp;&amp; git push</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="储藏-stashing" tabindex="-1">储藏（Stashing） <a class="header-anchor" href="#储藏-stashing" aria-label="Permalink to &quot;储藏（Stashing）&quot;">​</a></h2><p>在一个分支上操作之后，如果还没有将修改提交到分支上，此时进行切换分支，那么另一个分支上也能看到新的修改。这是因为所有分支都共用一个工作区的缘故。</p><p>可以使用 git stash 将当前分支的修改储藏起来，此时当前工作区的所有修改都会被存到栈中，也就是说当前工作区是干净的，没有任何未提交的修改。此时就可以安全的切换到其它分支上了。</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">$ git stash</span></span>
<span class="line"><span style="color:#e1e4e8;">Saved working directory and index state \\ &quot;WIP on master: 049d078 added the index file&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">HEAD is now at 049d078 added the index file (To restore them type &quot;git stash apply&quot;)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">$ git stash</span></span>
<span class="line"><span style="color:#24292e;">Saved working directory and index state \\ &quot;WIP on master: 049d078 added the index file&quot;</span></span>
<span class="line"><span style="color:#24292e;">HEAD is now at 049d078 added the index file (To restore them type &quot;git stash apply&quot;)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>该功能可以用于 bug 分支的实现。如果当前正在 dev 分支上进行开发，但是此时 master 上有个 bug 需要修复，但是 dev 分支上的开发还未完成，不想立即提交。在新建 bug 分支并切换到 bug 分支之前就需要使用 git stash 将 dev 分支的未提交修改储藏起来。</p><h2 id="ssh-传输设置" tabindex="-1">SSH 传输设置 <a class="header-anchor" href="#ssh-传输设置" aria-label="Permalink to &quot;SSH 传输设置&quot;">​</a></h2><p>Git 仓库和 Github 中心仓库之间的传输是通过 SSH 加密。</p><p>如果工作区下没有 .ssh 目录，或者该目录下没有 id_rsa 和 id_rsa.pub 这两个文件，可以通过以下命令来创建 SSH Key：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">$ ssh-keygen -t rsa -C &quot;youremail@example.com&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">$ ssh-keygen -t rsa -C &quot;youremail@example.com&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>然后把公钥 id_rsa.pub 的内容复制到 Github &quot;Account settings&quot; 的 SSH Keys 中。</p><h2 id="远程仓库覆盖本地仓库" tabindex="-1">远程仓库覆盖本地仓库 <a class="header-anchor" href="#远程仓库覆盖本地仓库" aria-label="Permalink to &quot;远程仓库覆盖本地仓库&quot;">​</a></h2><p>注意分支是 main 分支。</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">git</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">fetch</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">origin</span><span style="color:#E1E4E8;"> &amp;&amp; </span><span style="color:#B392F0;">git</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">reset</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">--hard</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">origin/main</span><span style="color:#E1E4E8;"> &amp;&amp; </span><span style="color:#B392F0;">git</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">clean</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-df</span><span style="color:#E1E4E8;"> &amp;&amp; </span><span style="color:#B392F0;">git</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">pull</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">origin</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">main</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">git</span><span style="color:#24292E;"> </span><span style="color:#032F62;">fetch</span><span style="color:#24292E;"> </span><span style="color:#032F62;">origin</span><span style="color:#24292E;"> &amp;&amp; </span><span style="color:#6F42C1;">git</span><span style="color:#24292E;"> </span><span style="color:#032F62;">reset</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">--hard</span><span style="color:#24292E;"> </span><span style="color:#032F62;">origin/main</span><span style="color:#24292E;"> &amp;&amp; </span><span style="color:#6F42C1;">git</span><span style="color:#24292E;"> </span><span style="color:#032F62;">clean</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-df</span><span style="color:#24292E;"> &amp;&amp; </span><span style="color:#6F42C1;">git</span><span style="color:#24292E;"> </span><span style="color:#032F62;">pull</span><span style="color:#24292E;"> </span><span style="color:#032F62;">origin</span><span style="color:#24292E;"> </span><span style="color:#032F62;">main</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><ol><li><code>git fetch origin</code>: 从远程仓库（通常是名为 &quot;origin&quot; 的远程仓库）获取最新的变更，但不合并到你当前的工作目录或分支。</li><li><code>git reset --hard origin/main</code>: 将你本地当前分支（通常是 &quot;main&quot; 分支）重置为与远程 &quot;origin/main&quot; 分支完全相同的状态。这会丢弃你本地所有未提交的修改和提交记录，确保你的本地分支与远程分支一致。</li><li><code>git clean -df</code>: 删除你的工作目录中未被 Git 追踪的文件和目录（<code>-d</code> 删除未被追踪的目录，<code>-f</code> 强制执行操作）。</li><li><code>git pull origin main</code>: 从远程 &quot;origin&quot; 仓库的 &quot;main&quot; 分支拉取最新的变更并合并到你的本地 &quot;main&quot; 分支。</li></ol><p>这个命令序列的作用是从远程仓库获取最新的代码并确保你的本地工作目录与远程分支状态一致。需要注意的是，这些操作会丢失你本地未提交的修改，因此在执行之前应谨慎备份或确认你不需要这些修改。</p><h2 id="gitignore-文件" tabindex="-1">.gitignore 文件 <a class="header-anchor" href="#gitignore-文件" aria-label="Permalink to &quot;.gitignore 文件&quot;">​</a></h2><p>忽略以下文件：</p><ul><li>操作系统自动生成的文件，比如缩略图；</li><li>编译生成的中间文件，比如 Java 编译产生的 .class 文件；</li><li>自己的敏感信息，比如存放口令的配置文件。</li></ul><p>不需要全部自己编写，可以到 <a href="https://github.com/github/gitignore" target="_blank" rel="noreferrer">https://github.com/github/gitignore</a> 中进行查询。</p><h2 id="git-命令一览" tabindex="-1">Git 命令一览 <a class="header-anchor" href="#git-命令一览" aria-label="Permalink to &quot;Git 命令一览&quot;">​</a></h2><p>比较详细的地址：<a href="http://www.cheat-sheets.org/saved-copy/git-cheat-sheet.pdf" target="_blank" rel="noreferrer">http://www.cheat-sheets.org/saved-copy/git-cheat-sheet.pdf</a></p><h2 id="参考资料" tabindex="-1">参考资料 <a class="header-anchor" href="#参考资料" aria-label="Permalink to &quot;参考资料&quot;">​</a></h2><ul><li><a href="http://rogerdudler.github.io/git-guide/index.zh.html" target="_blank" rel="noreferrer">Git - 简明指南</a></li><li><a href="http://marklodato.github.io/visual-git-guide/index-zh-cn.html" target="_blank" rel="noreferrer">图解 Git</a></li><li><a href="https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000" target="_blank" rel="noreferrer">廖雪峰 : Git 教程</a></li><li><a href="https://learngitbranching.js.org/" target="_blank" rel="noreferrer">Learn Git Branching</a></li></ul>`,58),i=[l];function p(o,r,c,d,h,g){return e(),s("div",null,i)}const b=a(n,[["render",p]]);export{m as __pageData,b as default};