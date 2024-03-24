import{_ as s,o as a,c as l,R as n}from"./chunks/framework.7FlijoJG.js";const F=JSON.parse('{"title":"ArrayList","description":"","frontmatter":{"title":"ArrayList","date":"2023-12-26T10:01:37.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"Java集合/ArrayList.md","filePath":"Java集合/ArrayList.md","lastUpdated":1711296414000}'),o={name:"Java集合/ArrayList.md"},t=n(`<h2 id="原理" tabindex="-1">原理 <a class="header-anchor" href="#原理" aria-label="Permalink to &quot;原理&quot;">​</a></h2><p>，ArrayList 底层的核心数据结构是个数组，这就解释了为啥它叫 ArrayList（数组列表）。对这个数组，她有主宰一切的权力，增大它，减小它，都是她的能耐范围。</p><ol><li><strong>初始化：</strong>  当我们创建一个 ArrayList 的时候，ArrayList 会初始化一个空数组。如果我们指定了初始化容量，那么它就会创建一个指定大小的数组。如果我们没指定，那当我们第一次调用 add 方法时，它会创建一个 10 大小的数组。你看，这就好像明星在摄影棚中，选择器合适尺寸的布景，来拍摄美轮美奂的照片一样。</li><li><strong>添加元素：</strong>  当我们向 ArrayList 中添加元素时，它会在数组的末尾添加这个元素。如果数组已经满了，那么 ArrayList 就会创建一个新的数组，这个数组的大小是旧数组大小的 1.5 倍。然后，它会把旧数组的所有元素都复制到新数组中，同时旧数组会被垃圾回收。这个过程就像是热闹的派对人数越来越多，现在的会场已经容纳不下，于是换了一个更大的会场，然后把人们都引导到新会场里。</li><li><strong>访问元素：</strong>  因为 ArrayList 底层是用数组实现的，所以我们可以直接通过数组的索引快速访问元素。这就像是我们直接凭票根找到自己的座位一样。</li><li><strong>删除元素：</strong>  当我们在 ArrayList 中删除元素时，后面的元素将会向前移动，覆盖掉被删除元素的位置。这就像是派对中有人离开，大家都往前挤，盛情之下，空位完全看不出来。</li><li><strong>扩容：</strong> ArrayList 的扩容是一个相对耗费资源的过程，因为需要创建新的数组并复制旧元素。所以如果我们预知数据规模，最好在初始化的时候就设置好容量，避免后续的多次扩容。就像租会场，如果预知了人数，一开始就租大一点。</li></ol><h2 id="举例" tabindex="-1">举例 <a class="header-anchor" href="#举例" aria-label="Permalink to &quot;举例&quot;">​</a></h2><p>以一段简单的例子为例，假设我们有一个 ArrayList，其中添加了 5 个元素，如下：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">ArrayList&lt;</span><span style="color:#F97583;">String</span><span style="color:#E1E4E8;">&gt; list </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> ArrayList&lt;&gt;();</span></span>
<span class="line"><span style="color:#E1E4E8;">list.</span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Java&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">list.</span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Python&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">list.</span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;JavaScript&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">list.</span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;C++&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">list.</span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;C#&quot;</span><span style="color:#E1E4E8;">);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">ArrayList&lt;</span><span style="color:#D73A49;">String</span><span style="color:#24292E;">&gt; list </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> ArrayList&lt;&gt;();</span></span>
<span class="line"><span style="color:#24292E;">list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Java&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Python&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;JavaScript&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;C++&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;C#&quot;</span><span style="color:#24292E;">);</span></span></code></pre></div><p>ArrayList 底层会有一个元素数组，用来存储添加的元素。展示出来就像这样：</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">elementData:</span><span style="color:#E1E4E8;"> [</span><span style="color:#9ECBFF;">&quot;Java&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;Python&quot;,</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;JavaScript&quot;,</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;C++&quot;,</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;C#&quot;,</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">null,</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">null,</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">null,</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">null,</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">null]</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">elementData:</span><span style="color:#24292E;"> [</span><span style="color:#032F62;">&quot;Java&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;Python&quot;,</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;JavaScript&quot;,</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;C++&quot;,</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;C#&quot;,</span><span style="color:#24292E;"> </span><span style="color:#032F62;">null,</span><span style="color:#24292E;"> </span><span style="color:#032F62;">null,</span><span style="color:#24292E;"> </span><span style="color:#032F62;">null,</span><span style="color:#24292E;"> </span><span style="color:#032F62;">null,</span><span style="color:#24292E;"> </span><span style="color:#032F62;">null]</span></span></code></pre></div><p>其中，elementData 是 ArrayList 内部用来存元素的数组，初始大小是 10。我们添加了 5 个元素，所以数组的前五个位置被填充，后五个位置为空。</p><p>当我们继续添加元素并超过数组的大小时，它会进行扩容操作，创建一个新的数组，新数组大小是旧数组大小的 1.5 倍，旧数组的元素会被复制到新数组中。</p><p>同时，ArrayList 还有一个属性 size，用来记录元素的实际数量，也就是我们说的 list.size()。在上述的场景下，size 的值就是 5。</p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><p><a href="https://yikun.github.io/2015/04/04/Java-ArrayList%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E5%8F%8A%E5%AE%9E%E7%8E%B0/" target="_blank" rel="noreferrer">Java ArrayList工作原理及实现 | Yikun</a></p>`,13),p=[t];function e(r,c,E,y,i,u){return a(),l("div",null,p)}const q=s(o,[["render",e]]);export{F as __pageData,q as default};
