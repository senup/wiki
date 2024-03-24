import{_ as s,o as a,c as n,R as l}from"./chunks/framework.7FlijoJG.js";const h=JSON.parse('{"title":"一、三大特性","description":"","frontmatter":{},"headers":[],"relativePath":"Java基础/面向对象思想.md","filePath":"Java基础/面向对象思想.md","lastUpdated":1711296414000}'),e={name:"Java基础/面向对象思想.md"},p=l(`<ul><li><a href="#一三大特性">一、三大特性</a><ul><li><a href="#封装">封装</a></li><li><a href="#继承">继承</a></li><li><a href="#多态">多态</a></li></ul></li><li><a href="#二类图">二、类图</a><ul><li><a href="#泛化关系-generalization">泛化关系 (Generalization)</a></li><li><a href="#实现关系-realization">实现关系 (Realization)</a></li><li><a href="#聚合关系-aggregation">聚合关系 (Aggregation)</a></li><li><a href="#组合关系-composition">组合关系 (Composition)</a></li><li><a href="#关联关系-association">关联关系 (Association)</a></li><li><a href="#依赖关系-dependency">依赖关系 (Dependency)</a></li></ul></li><li><a href="#三设计原则">三、设计原则</a><ul><li><a href="#solid">S.O.L.I.D</a></li><li><a href="#其他常见原则">其他常见原则</a></li></ul></li><li><a href="#参考资料">参考资料</a></li></ul><h1 id="一、三大特性" tabindex="-1">一、三大特性 <a class="header-anchor" href="#一、三大特性" aria-label="Permalink to &quot;一、三大特性&quot;">​</a></h1><h2 id="封装" tabindex="-1">封装 <a class="header-anchor" href="#封装" aria-label="Permalink to &quot;封装&quot;">​</a></h2><p>利用抽象数据类型将数据和基于数据的操作封装在一起，使其构成一个不可分割的独立实体。数据被保护在抽象数据类型的内部，尽可能地隐藏内部的细节，只保留一些对外的接口使其与外部发生联系。用户无需关心对象内部的细节，但可以通过对象对外提供的接口来访问该对象。</p><p>优点：</p><ul><li>减少耦合：可以独立地开发、测试、优化、使用、理解和修改</li><li>减轻维护的负担：可以更容易被程序员理解，并且在调试的时候可以不影响其他模块</li><li>有效地调节性能：可以通过剖析来确定哪些模块影响了系统的性能</li><li>提高软件的可重用性</li><li>降低了构建大型系统的风险：即使整个系统不可用，但是这些独立的模块却有可能是可用的</li></ul><p>以下 Person 类封装 name、gender、age 等属性，外界只能通过 get() 方法获取一个 Person 对象的 name 属性和 gender 属性，而无法获取 age 属性，但是 age 属性可以供 work() 方法使用。</p><p>注意到 gender 属性使用 int 数据类型进行存储，封装使得用户注意不到这种实现细节。并且在需要修改 gender 属性使用的数据类型时，也可以在不影响客户端代码的情况下进行。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Person</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> String name;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> gender;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> age;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> String </span><span style="color:#B392F0;">getName</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> name;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> String </span><span style="color:#B392F0;">getGender</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> gender </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;man&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;woman&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">work</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#79B8FF;">18</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&lt;=</span><span style="color:#E1E4E8;"> age </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> age </span><span style="color:#F97583;">&lt;=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">50</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(name </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot; is working very hard!&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(name </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot; can&#39;t work any more!&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> String name;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> gender;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> age;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> String </span><span style="color:#6F42C1;">getName</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> name;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> String </span><span style="color:#6F42C1;">getGender</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> gender </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;man&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;woman&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">work</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">18</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;=</span><span style="color:#24292E;"> age </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> age </span><span style="color:#D73A49;">&lt;=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">50</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(name </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot; is working very hard!&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(name </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot; can&#39;t work any more!&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="继承" tabindex="-1">继承 <a class="header-anchor" href="#继承" aria-label="Permalink to &quot;继承&quot;">​</a></h2><p>继承实现了 <strong>IS-A</strong> 关系，例如 Cat 和 Animal 就是一种 IS-A 关系，因此 Cat 可以继承自 Animal，从而获得 Animal 非 private 的属性和方法。</p><p>继承应该遵循里氏替换原则，子类对象必须能够替换掉所有父类对象。</p><p>Cat 可以当做 Animal 来使用，也就是说可以使用 Animal 引用 Cat 对象。父类引用指向子类对象称为 <strong>向上转型</strong> 。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">Animal animal </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Cat</span><span style="color:#E1E4E8;">();</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">Animal animal </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Cat</span><span style="color:#24292E;">();</span></span></code></pre></div><h2 id="多态" tabindex="-1">多态 <a class="header-anchor" href="#多态" aria-label="Permalink to &quot;多态&quot;">​</a></h2><p>多态分为编译时多态和运行时多态：</p><ul><li>编译时多态主要指方法的重载</li><li>运行时多态指程序中定义的对象引用所指向的具体类型在运行期间才确定</li></ul><p>运行时多态有三个条件：</p><ul><li>继承</li><li>覆盖（重写）</li><li>向上转型</li></ul><p>下面的代码中，乐器类（Instrument）有两个子类：Wind 和 Percussion，它们都覆盖了父类的 play() 方法，并且在 main() 方法中使用父类 Instrument 来引用 Wind 和 Percussion 对象。在 Instrument 引用调用 play() 方法时，会执行实际引用对象所在类的 play() 方法，而不是 Instrument 类的方法。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Instrument</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">play</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Instument is playing...&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Instrument</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">play</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Instument is playing...&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Wind</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">extends</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Instrument</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">play</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Wind is playing...&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Wind</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">extends</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Instrument</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">play</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Wind is playing...&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Percussion</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">extends</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Instrument</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">play</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Percussion is playing...&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Percussion</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">extends</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Instrument</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">play</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Percussion is playing...&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Music</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">main</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">String</span><span style="color:#E1E4E8;">[] </span><span style="color:#FFAB70;">args</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        List&lt;</span><span style="color:#F97583;">Instrument</span><span style="color:#E1E4E8;">&gt; instruments </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> ArrayList&lt;&gt;();</span></span>
<span class="line"><span style="color:#E1E4E8;">        instruments.</span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Wind</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"><span style="color:#E1E4E8;">        instruments.</span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Percussion</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;">(Instrument instrument </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> instruments) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            instrument.</span><span style="color:#B392F0;">play</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Music</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">String</span><span style="color:#24292E;">[] </span><span style="color:#E36209;">args</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        List&lt;</span><span style="color:#D73A49;">Instrument</span><span style="color:#24292E;">&gt; instruments </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> ArrayList&lt;&gt;();</span></span>
<span class="line"><span style="color:#24292E;">        instruments.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Wind</span><span style="color:#24292E;">());</span></span>
<span class="line"><span style="color:#24292E;">        instruments.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Percussion</span><span style="color:#24292E;">());</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(Instrument instrument </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> instruments) {</span></span>
<span class="line"><span style="color:#24292E;">            instrument.</span><span style="color:#6F42C1;">play</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">Wind is playing...</span></span>
<span class="line"><span style="color:#e1e4e8;">Percussion is playing...</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">Wind is playing...</span></span>
<span class="line"><span style="color:#24292e;">Percussion is playing...</span></span></code></pre></div><h1 id="二、类图" tabindex="-1">二、类图 <a class="header-anchor" href="#二、类图" aria-label="Permalink to &quot;二、类图&quot;">​</a></h1><p>以下类图使用 <a href="https://www.planttext.com/" target="_blank" rel="noreferrer">PlantUML</a> 绘制，更多语法及使用请参考：<a href="http://plantuml.com/" target="_blank" rel="noreferrer">http://plantuml.com/</a> 。</p><h2 id="泛化关系-generalization" tabindex="-1">泛化关系 (Generalization) <a class="header-anchor" href="#泛化关系-generalization" aria-label="Permalink to &quot;泛化关系 (Generalization)&quot;">​</a></h2><p>用来描述继承关系，在 Java 中使用 extends 关键字。</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">@startuml</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">title Generalization</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">class Vihical</span></span>
<span class="line"><span style="color:#e1e4e8;">class Car</span></span>
<span class="line"><span style="color:#e1e4e8;">class Trunck</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">Vihical &lt;|-- Car</span></span>
<span class="line"><span style="color:#e1e4e8;">Vihical &lt;|-- Trunck</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">@enduml</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">@startuml</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">title Generalization</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">class Vihical</span></span>
<span class="line"><span style="color:#24292e;">class Car</span></span>
<span class="line"><span style="color:#24292e;">class Trunck</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">Vihical &lt;|-- Car</span></span>
<span class="line"><span style="color:#24292e;">Vihical &lt;|-- Trunck</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">@enduml</span></span></code></pre></div><h2 id="实现关系-realization" tabindex="-1">实现关系 (Realization) <a class="header-anchor" href="#实现关系-realization" aria-label="Permalink to &quot;实现关系 (Realization)&quot;">​</a></h2><p>用来实现一个接口，在 Java 中使用 implements 关键字。</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">@startuml</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">title Realization</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">interface MoveBehavior</span></span>
<span class="line"><span style="color:#e1e4e8;">class Fly</span></span>
<span class="line"><span style="color:#e1e4e8;">class Run</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">MoveBehavior &lt;|.. Fly</span></span>
<span class="line"><span style="color:#e1e4e8;">MoveBehavior &lt;|.. Run</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">@enduml</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">@startuml</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">title Realization</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">interface MoveBehavior</span></span>
<span class="line"><span style="color:#24292e;">class Fly</span></span>
<span class="line"><span style="color:#24292e;">class Run</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">MoveBehavior &lt;|.. Fly</span></span>
<span class="line"><span style="color:#24292e;">MoveBehavior &lt;|.. Run</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">@enduml</span></span></code></pre></div><h2 id="聚合关系-aggregation" tabindex="-1">聚合关系 (Aggregation) <a class="header-anchor" href="#聚合关系-aggregation" aria-label="Permalink to &quot;聚合关系 (Aggregation)&quot;">​</a></h2><p>表示整体由部分组成，但是整体和部分不是强依赖的，整体不存在了部分还是会存在。</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">@startuml</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">title Aggregation</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">class Computer</span></span>
<span class="line"><span style="color:#e1e4e8;">class Keyboard</span></span>
<span class="line"><span style="color:#e1e4e8;">class Mouse</span></span>
<span class="line"><span style="color:#e1e4e8;">class Screen</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">Computer o-- Keyboard</span></span>
<span class="line"><span style="color:#e1e4e8;">Computer o-- Mouse</span></span>
<span class="line"><span style="color:#e1e4e8;">Computer o-- Screen</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">@enduml</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">@startuml</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">title Aggregation</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">class Computer</span></span>
<span class="line"><span style="color:#24292e;">class Keyboard</span></span>
<span class="line"><span style="color:#24292e;">class Mouse</span></span>
<span class="line"><span style="color:#24292e;">class Screen</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">Computer o-- Keyboard</span></span>
<span class="line"><span style="color:#24292e;">Computer o-- Mouse</span></span>
<span class="line"><span style="color:#24292e;">Computer o-- Screen</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">@enduml</span></span></code></pre></div><h2 id="组合关系-composition" tabindex="-1">组合关系 (Composition) <a class="header-anchor" href="#组合关系-composition" aria-label="Permalink to &quot;组合关系 (Composition)&quot;">​</a></h2><p>和聚合不同，组合中整体和部分是强依赖的，整体不存在了部分也不存在了。比如公司和部门，公司没了部门就不存在了。但是公司和员工就属于聚合关系了，因为公司没了员工还在。</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">@startuml</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">title Composition</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">class Company</span></span>
<span class="line"><span style="color:#e1e4e8;">class DepartmentA</span></span>
<span class="line"><span style="color:#e1e4e8;">class DepartmentB</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">Company *-- DepartmentA</span></span>
<span class="line"><span style="color:#e1e4e8;">Company *-- DepartmentB</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">@enduml</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">@startuml</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">title Composition</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">class Company</span></span>
<span class="line"><span style="color:#24292e;">class DepartmentA</span></span>
<span class="line"><span style="color:#24292e;">class DepartmentB</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">Company *-- DepartmentA</span></span>
<span class="line"><span style="color:#24292e;">Company *-- DepartmentB</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">@enduml</span></span></code></pre></div><h2 id="关联关系-association" tabindex="-1">关联关系 (Association) <a class="header-anchor" href="#关联关系-association" aria-label="Permalink to &quot;关联关系 (Association)&quot;">​</a></h2><p>表示不同类对象之间有关联，这是一种静态关系，与运行过程的状态无关，在最开始就可以确定。因此也可以用 1 对 1、多对 1、多对多这种关联关系来表示。比如学生和学校就是一种关联关系，一个学校可以有很多学生，但是一个学生只属于一个学校，因此这是一种多对一的关系，在运行开始之前就可以确定。</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">@startuml</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">title Association</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">class School</span></span>
<span class="line"><span style="color:#e1e4e8;">class Student</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">School &quot;1&quot; - &quot;n&quot; Student</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">@enduml</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">@startuml</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">title Association</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">class School</span></span>
<span class="line"><span style="color:#24292e;">class Student</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">School &quot;1&quot; - &quot;n&quot; Student</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">@enduml</span></span></code></pre></div><h2 id="依赖关系-dependency" tabindex="-1">依赖关系 (Dependency) <a class="header-anchor" href="#依赖关系-dependency" aria-label="Permalink to &quot;依赖关系 (Dependency)&quot;">​</a></h2><p>和关联关系不同的是，依赖关系是在运行过程中起作用的。A 类和 B 类是依赖关系主要有三种形式：</p><ul><li>A 类是 B 类方法的局部变量；</li><li>A 类是 B 类方法当中的一个参数；</li><li>A 类向 B 类发送消息，从而影响 B 类发生变化。</li></ul><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">@startuml</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">title Dependency</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">class Vihicle {</span></span>
<span class="line"><span style="color:#e1e4e8;">    move(MoveBehavior)</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">interface MoveBehavior {</span></span>
<span class="line"><span style="color:#e1e4e8;">    move()</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">note &quot;MoveBehavior.move()&quot; as N</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">Vihicle ..&gt; MoveBehavior</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">Vihicle .. N</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">@enduml</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">@startuml</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">title Dependency</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">class Vihicle {</span></span>
<span class="line"><span style="color:#24292e;">    move(MoveBehavior)</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">interface MoveBehavior {</span></span>
<span class="line"><span style="color:#24292e;">    move()</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">note &quot;MoveBehavior.move()&quot; as N</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">Vihicle ..&gt; MoveBehavior</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">Vihicle .. N</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">@enduml</span></span></code></pre></div><h1 id="三、设计原则" tabindex="-1">三、设计原则 <a class="header-anchor" href="#三、设计原则" aria-label="Permalink to &quot;三、设计原则&quot;">​</a></h1><h2 id="s-o-l-i-d" tabindex="-1">S.O.L.I.D <a class="header-anchor" href="#s-o-l-i-d" aria-label="Permalink to &quot;S.O.L.I.D&quot;">​</a></h2><table><thead><tr><th style="text-align:center;">简写</th><th style="text-align:center;">全拼</th><th style="text-align:center;">中文翻译</th></tr></thead><tbody><tr><td style="text-align:center;">SRP</td><td style="text-align:center;">The Single Responsibility Principle</td><td style="text-align:center;">单一责任原则</td></tr><tr><td style="text-align:center;">OCP</td><td style="text-align:center;">The Open Closed Principle</td><td style="text-align:center;">开放封闭原则</td></tr><tr><td style="text-align:center;">LSP</td><td style="text-align:center;">The Liskov Substitution Principle</td><td style="text-align:center;">里氏替换原则</td></tr><tr><td style="text-align:center;">ISP</td><td style="text-align:center;">The Interface Segregation Principle</td><td style="text-align:center;">接口分离原则</td></tr><tr><td style="text-align:center;">DIP</td><td style="text-align:center;">The Dependency Inversion Principle</td><td style="text-align:center;">依赖倒置原则</td></tr></tbody></table><h3 id="_1-单一责任原则" tabindex="-1">1. 单一责任原则 <a class="header-anchor" href="#_1-单一责任原则" aria-label="Permalink to &quot;1. 单一责任原则&quot;">​</a></h3><blockquote><p>修改一个类的原因应该只有一个。</p></blockquote><p>换句话说就是让一个类只负责一件事，当这个类需要做过多事情的时候，就需要分解这个类。</p><p>如果一个类承担的职责过多，就等于把这些职责耦合在了一起，一个职责的变化可能会削弱这个类完成其它职责的能力。</p><h3 id="_2-开放封闭原则" tabindex="-1">2. 开放封闭原则 <a class="header-anchor" href="#_2-开放封闭原则" aria-label="Permalink to &quot;2. 开放封闭原则&quot;">​</a></h3><blockquote><p>类应该对扩展开放，对修改关闭。</p></blockquote><p>扩展就是添加新功能的意思，因此该原则要求在添加新功能时不需要修改代码。</p><p>符合开闭原则最典型的设计模式是装饰者模式，它可以动态地将责任附加到对象上，而不用去修改类的代码。</p><h3 id="_3-里氏替换原则" tabindex="-1">3. 里氏替换原则 <a class="header-anchor" href="#_3-里氏替换原则" aria-label="Permalink to &quot;3. 里氏替换原则&quot;">​</a></h3><blockquote><p>子类对象必须能够替换掉所有父类对象。</p></blockquote><p>继承是一种 IS-A 关系，子类需要能够当成父类来使用，并且需要比父类更特殊。</p><p>如果不满足这个原则，那么各个子类的行为上就会有很大差异，增加继承体系的复杂度。</p><h3 id="_4-接口分离原则" tabindex="-1">4. 接口分离原则 <a class="header-anchor" href="#_4-接口分离原则" aria-label="Permalink to &quot;4. 接口分离原则&quot;">​</a></h3><blockquote><p>不应该强迫客户依赖于它们不用的方法。</p></blockquote><p>因此使用多个专门的接口比使用单一的总接口要好。</p><h3 id="_5-依赖倒置原则" tabindex="-1">5. 依赖倒置原则 <a class="header-anchor" href="#_5-依赖倒置原则" aria-label="Permalink to &quot;5. 依赖倒置原则&quot;">​</a></h3><blockquote><p>高层模块不应该依赖于低层模块，二者都应该依赖于抽象；抽象不应该依赖于细节，细节应该依赖于抽象。</p></blockquote><p>高层模块包含一个应用程序中重要的策略选择和业务模块，如果高层模块依赖于低层模块，那么低层模块的改动就会直接影响到高层模块，从而迫使高层模块也需要改动。</p><p>依赖于抽象意味着：</p><ul><li>任何变量都不应该持有一个指向具体类的指针或者引用；</li><li>任何类都不应该从具体类派生；</li><li>任何方法都不应该覆写它的任何基类中的已经实现的方法。</li></ul><h2 id="其他常见原则" tabindex="-1">其他常见原则 <a class="header-anchor" href="#其他常见原则" aria-label="Permalink to &quot;其他常见原则&quot;">​</a></h2><p>除了上述的经典原则，在实际开发中还有下面这些常见的设计原则。</p><table><thead><tr><th style="text-align:center;">简写</th><th style="text-align:center;">全拼</th><th style="text-align:center;">中文翻译</th></tr></thead><tbody><tr><td style="text-align:center;">LOD</td><td style="text-align:center;">The Law of Demeter</td><td style="text-align:center;">迪米特法则</td></tr><tr><td style="text-align:center;">CRP</td><td style="text-align:center;">The Composite Reuse Principle</td><td style="text-align:center;">合成复用原则</td></tr><tr><td style="text-align:center;">CCP</td><td style="text-align:center;">The Common Closure Principle</td><td style="text-align:center;">共同封闭原则</td></tr><tr><td style="text-align:center;">SAP</td><td style="text-align:center;">The Stable Abstractions Principle</td><td style="text-align:center;">稳定抽象原则</td></tr><tr><td style="text-align:center;">SDP</td><td style="text-align:center;">The Stable Dependencies Principle</td><td style="text-align:center;">稳定依赖原则</td></tr></tbody></table><h3 id="_1-迪米特法则" tabindex="-1">1. 迪米特法则 <a class="header-anchor" href="#_1-迪米特法则" aria-label="Permalink to &quot;1. 迪米特法则&quot;">​</a></h3><p>迪米特法则又叫作最少知识原则（Least Knowledge Principle，简写 LKP），就是说一个对象应当对其他对象有尽可能少的了解，不和陌生人说话。</p><h3 id="_2-合成复用原则" tabindex="-1">2. 合成复用原则 <a class="header-anchor" href="#_2-合成复用原则" aria-label="Permalink to &quot;2. 合成复用原则&quot;">​</a></h3><p>尽量使用对象组合，而不是通过继承来达到复用的目的。</p><h3 id="_3-共同封闭原则" tabindex="-1">3. 共同封闭原则 <a class="header-anchor" href="#_3-共同封闭原则" aria-label="Permalink to &quot;3. 共同封闭原则&quot;">​</a></h3><p>一起修改的类，应该组合在一起（同一个包里）。如果必须修改应用程序里的代码，我们希望所有的修改都发生在一个包里（修改关闭），而不是遍布在很多包里。</p><h3 id="_4-稳定抽象原则" tabindex="-1">4. 稳定抽象原则 <a class="header-anchor" href="#_4-稳定抽象原则" aria-label="Permalink to &quot;4. 稳定抽象原则&quot;">​</a></h3><p>最稳定的包应该是最抽象的包，不稳定的包应该是具体的包，即包的抽象程度跟它的稳定性成正比。</p><h3 id="_5-稳定依赖原则" tabindex="-1">5. 稳定依赖原则 <a class="header-anchor" href="#_5-稳定依赖原则" aria-label="Permalink to &quot;5. 稳定依赖原则&quot;">​</a></h3><p>包之间的依赖关系都应该是稳定方向依赖的，包要依赖的包要比自己更具有稳定性。</p><h1 id="参考资料" tabindex="-1">参考资料 <a class="header-anchor" href="#参考资料" aria-label="Permalink to &quot;参考资料&quot;">​</a></h1><ul><li>Java 编程思想</li><li>敏捷软件开发：原则、模式与实践</li><li><a href="http://www.cnblogs.com/shanyou/archive/2009/09/21/1570716.html" target="_blank" rel="noreferrer">面向对象设计的 SOLID 原则</a></li><li><a href="http://design-patterns.readthedocs.io/zh_CN/latest/read_uml.html#generalization" target="_blank" rel="noreferrer">看懂 UML 类图和时序图</a></li><li><a href="http://www.cnblogs.com/wolf-sun/p/UML-Sequence-diagram.html" target="_blank" rel="noreferrer">UML 系列——时序图（顺序图）sequence diagram</a></li><li><a href="http://blog.csdn.net/jianyuerensheng/article/details/51602015" target="_blank" rel="noreferrer">面向对象编程三大特性 ------ 封装、继承、多态</a></li></ul>`,84),o=[p];function t(c,r,i,y,E,d){return a(),n("div",null,o)}const g=s(e,[["render",t]]);export{h as __pageData,g as default};
