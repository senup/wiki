import{_ as s,o as n,c as a,R as p}from"./chunks/framework.7FlijoJG.js";const u=JSON.parse('{"title":"值传递","description":"","frontmatter":{"title":"值传递","date":"2024-01-05T21:09:47.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"Java相关/值传递.md","filePath":"Java相关/值传递.md","lastUpdated":1711296414000}'),l={name:"Java相关/值传递.md"},o=p(`<h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><p>Java 中只有值传递，值传递就是传递副本。</p><p>如果是基础类型就传递形参（副本），如果是对象类型就传递引用（副本，但指向原来的对象）。因为加载进赋值的方法，相当于是把方法压进栈，然后我们修改的数据随着方法出栈，这个修改也就变得无效了。</p><p>如果是基础类型，就是形参拷贝一份，形参不影响原来的实参； 如果是引用类型，就是引用地址拷贝一份，所以对内部进行更改是可以影响到原来的实参的，比如对象类型、集合类型。</p><h2 id="举例" tabindex="-1">举例 <a class="header-anchor" href="#举例" aria-label="Permalink to &quot;举例&quot;">​</a></h2><p>首先，我们要清楚一个概念，Java 是传值的，而不是传引用的，所以上述的交换方法不能改变主函数中 i 和 j 的结构。即使我们在 <code>swap</code> 方法中对 <code>i</code> 和 <code>j</code> 进行了交换，但此时交换的只是 <code>i</code> 和 <code>j</code> 的拷贝，不会影响 main 方法中的 <code>i</code> 和 <code>j</code>。调用 swap 之后，i，j 的赋值也并没有变。</p><p>另一方面，转向 Object 类型的参数，Java 传入方法的是 Object 的地址的拷贝（内存地址本质上也是参数啦，所以 Java 虽然不是“忠诚的”传引用，但也算个半豪士）。在<code>swapInstance</code>方法中，i，j 的地址进行了交换，但是仅限于<code>swapInstance</code>方法内部，方法结束，影响也就“随风而去”了。所以主函数 main 中的 ii 和 jj 的值也没法被改变。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Test</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> num;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Test</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#FFAB70;">num</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.num </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> num;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    @</span><span style="color:#F97583;">Override</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> String </span><span style="color:#B392F0;">toString</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;Test{&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#9ECBFF;">&quot;num=&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> num </span><span style="color:#F97583;">+</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#9ECBFF;">&#39;}&#39;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">main</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">String</span><span style="color:#E1E4E8;">[] </span><span style="color:#FFAB70;">args</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> i </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">10</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> j </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">20</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">swap</span><span style="color:#E1E4E8;">(i,j);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">//10</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(i);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">//20</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(j);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        Test ii </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Test</span><span style="color:#E1E4E8;">(i);</span></span>
<span class="line"><span style="color:#E1E4E8;">        Test jj </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Test</span><span style="color:#E1E4E8;">(j);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">swapInstance</span><span style="color:#E1E4E8;">(ii, jj);</span></span>
<span class="line"><span style="color:#E1E4E8;">    	</span><span style="color:#6A737D;">//Test{num=10}</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(ii);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">//Test{num=20}</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(jj);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">swap</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#FFAB70;">i</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#FFAB70;">j</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> temp </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> i;</span></span>
<span class="line"><span style="color:#E1E4E8;">        i </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> j;</span></span>
<span class="line"><span style="color:#E1E4E8;">        j </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> temp;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#6A737D;">//因为子方法里面的变量是基础类型，因此更改不生效</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">swapInstance</span><span style="color:#E1E4E8;">(Test </span><span style="color:#FFAB70;">i</span><span style="color:#E1E4E8;">, Test </span><span style="color:#FFAB70;">j</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        Test temp </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> i;</span></span>
<span class="line"><span style="color:#E1E4E8;">        i </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> j;</span></span>
<span class="line"><span style="color:#E1E4E8;">        j </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> temp;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Test</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Test</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">num</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> num;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Override</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> String </span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;Test{&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;num=&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">+</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&#39;}&#39;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">String</span><span style="color:#24292E;">[] </span><span style="color:#E36209;">args</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> j </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">20</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">swap</span><span style="color:#24292E;">(i,j);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//10</span></span>
<span class="line"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(i);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//20</span></span>
<span class="line"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(j);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        Test ii </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Test</span><span style="color:#24292E;">(i);</span></span>
<span class="line"><span style="color:#24292E;">        Test jj </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Test</span><span style="color:#24292E;">(j);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">swapInstance</span><span style="color:#24292E;">(ii, jj);</span></span>
<span class="line"><span style="color:#24292E;">    	</span><span style="color:#6A737D;">//Test{num=10}</span></span>
<span class="line"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(ii);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//Test{num=20}</span></span>
<span class="line"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(jj);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">swap</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">i</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">j</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> temp </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> i;</span></span>
<span class="line"><span style="color:#24292E;">        i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> j;</span></span>
<span class="line"><span style="color:#24292E;">        j </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> temp;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#6A737D;">//因为子方法里面的变量是基础类型，因此更改不生效</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">swapInstance</span><span style="color:#24292E;">(Test </span><span style="color:#E36209;">i</span><span style="color:#24292E;">, Test </span><span style="color:#E36209;">j</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        Test temp </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> i;</span></span>
<span class="line"><span style="color:#24292E;">        i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> j;</span></span>
<span class="line"><span style="color:#24292E;">        j </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> temp;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>在 Java 的方法里面，如果你改变传入的参数变量本身，那仅仅是改变了复制的一份，原来的值不会变。但是，如果你改变的是该参数变量所指向的对象的内部状态，那么在方法外面看到的那个对象也会发生改变，因为无论是方法内部的变量，还是方法外部的变量，他们的值都是同一个内存地址。</p>`,9),e=[o];function t(c,E,r,y,i,F){return n(),a("div",null,e)}const A=s(l,[["render",t]]);export{u as __pageData,A as default};
