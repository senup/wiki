import{_ as s,o as a,c as n,R as e}from"./chunks/framework.7FlijoJG.js";const u=JSON.parse('{"title":"头插法","description":"","frontmatter":{"title":"头插法","date":"2023-12-27T18:00:57.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"算法与数据结构/头插法.md","filePath":"算法与数据结构/头插法.md","lastUpdated":1711296414000}'),p={name:"算法与数据结构/头插法.md"},l=e(`<h2 id="头插法" tabindex="-1">头插法 <a class="header-anchor" href="#头插法" aria-label="Permalink to &quot;头插法&quot;">​</a></h2><p>在下面的例子中，我将会演示头插法是如何工作的。为了简单起见，我假定哈希函数是一个简单的模运算。</p><p>我们添加的元素是 1，2，3，4，5，他们的哈希值有些相同。要说明的是，在实际的 HashMap 中，哈希函数包含了哈希码，哈希扩展等复杂过程，这里只简化为模运算，方便理解。</p><p>假设我们的哈希表初始容量为 4（即 buckets 的长度为 4），而哈希函数为  <code>hash(x) = x % 4</code>。□ 表示 bucket，-&gt;表示链表指针。</p><p>一开始，哈希表 bucket 是空的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span></code></pre></div><p>我们插入元素 1，得到哈希值 1（因为 1 % 4 = 1），所以放入 bucket[1]里面：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; [1]</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; [1]</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span></code></pre></div><p>然后我们插入元素 2，得到哈希值为 2，所以放入 bucket[2]：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; [1]</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; [2]</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; [1]</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; [2]</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span></code></pre></div><p>然后我们插入元素 5，得到哈希值为 1（因为 5 % 4 = 1），所以放入 bucket[1]，头插法就显现出来了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; [5 -&gt; 1]</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; [2]</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; [5 -&gt; 1]</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; [2]</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span></code></pre></div><p>假设此时哈希表进行了扩容，长度扩大为 8，根据头插法重新排列元素，看看会怎么样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; [1 -&gt; 5]</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; [2]</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; [1 -&gt; 5]</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; [2]</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span></code></pre></div><p>你注意到 bucket[1]的区别了吗？通过头插法，当扩容后，元素 5 和元素 1 的顺序就变了。这就是头插法的效果。</p><h2 id="jdk-1-7-头插法为什么会引起死循环" tabindex="-1">JDK 1.7 头插法为什么会引起死循环？ <a class="header-anchor" href="#jdk-1-7-头插法为什么会引起死循环" aria-label="Permalink to &quot;JDK 1.7 头插法为什么会引起死循环？&quot;">​</a></h2><p>因为在 transfer 的扩容方法里面，使用了头插法来移动数组槽位和他的 next；导致的效果就是链表被倒序了，e 和 next 倒序了； 此时如果并发线程被阻塞后也开始进行扩容，就会将倒序后的两个元素 e 和 next 反过来执行头插法，导致出现死循环。</p><h2 id="死循环" tabindex="-1">死循环 <a class="header-anchor" href="#死循环" aria-label="Permalink to &quot;死循环&quot;">​</a></h2><p>首先我们的哈希表 bucket 初始情况如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span></code></pre></div><p>假设我们先后插入元素 7，3，和 11，他们的哈希值都是 3:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; [11 -&gt; 3 -&gt; 7]</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; [11 -&gt; 3 -&gt; 7]</span></span></code></pre></div><p>可见，因为使用头插法，插入顺序反而倒过来了。</p><p>现在开始进行扩容，假设我们扩大 bucket 为 8，并用头插法重新插入元素，就会发生什么呢？让我们看看：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; [11 -&gt; 7 -&gt; 3]</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; [11 -&gt; 7 -&gt; 3]</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span></code></pre></div><p>在扩容过程中，我们希望元素本该到达的链表尾部对应的新 bucket 下标是空的，而在旧数组中位于链表头部的元素显然后续才会进行扩容操作，此时新 bucket 下标还未被占据，也就是说元素从链表头迁移到新 bucket 去是没有问题的。</p><p>这也正契合了上一步的样例，我们看到用头插法迁移元素后，元素插入的顺序是反的。</p><p>在进一步的扩容过程中，位于链表末尾的元素应该被迁移到下标为 3 的 bucket，也就是我们现在正在操作的 bucket，但是该位置已经被占据了，位于链表末尾的元素位置没有找到，此时会形成环形链表，就像这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; [11 -&gt; 7 -&gt; 3 -&gt; 11 -&gt; 7 -&gt; 3 -&gt; ...]</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#e1e4e8;">        □ -&gt; []</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">bucket:□ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; [11 -&gt; 7 -&gt; 3 -&gt; 11 -&gt; 7 -&gt; 3 -&gt; ...]</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span>
<span class="line"><span style="color:#24292e;">        □ -&gt; []</span></span></code></pre></div><p>这导致的问题就是，当你从头开始找一个元素，程序会陷入无尽的寻找，也就是死循环。</p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><p><a href="https://www.bilibili.com/video/BV1n541177Ea/?spm_id_from=..search-card.all.click&amp;vd_source=31faf19ea9e246ceb3ce8e99ac2438b2" target="_blank" rel="noreferrer">JDK7 的 HashMap 头插法循环的问题，这么难理解吗？_哔哩哔哩_bilibili</a></p>`,32),t=[l];function c(o,i,r,g,d,y){return a(),n("div",null,t)}const b=s(p,[["render",c]]);export{u as __pageData,b as default};
