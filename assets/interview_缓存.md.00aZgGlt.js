import{_ as s,o as n,c as a,R as l}from"./chunks/framework.7FlijoJG.js";const F=JSON.parse('{"title":"一、缓存特征","description":"","frontmatter":{},"headers":[],"relativePath":"interview/缓存.md","filePath":"interview/缓存.md","lastUpdated":1700618398000}'),p={name:"interview/缓存.md"},o=l(`<ul><li><a href="#一缓存特征">一、缓存特征</a></li><li><a href="#二lru">二、LRU</a></li><li><a href="#三缓存位置">三、缓存位置</a></li><li><a href="#四cdn">四、CDN</a></li><li><a href="#五缓存问题">五、缓存问题</a></li><li><a href="#六数据分布">六、数据分布</a></li><li><a href="#七一致性哈希">七、一致性哈希</a></li><li><a href="#参考资料">参考资料</a></li></ul><h1 id="一、缓存特征" tabindex="-1">一、缓存特征 <a class="header-anchor" href="#一、缓存特征" aria-label="Permalink to &quot;一、缓存特征&quot;">​</a></h1><h2 id="命中率" tabindex="-1">命中率 <a class="header-anchor" href="#命中率" aria-label="Permalink to &quot;命中率&quot;">​</a></h2><p>当某个请求能够通过访问缓存而得到响应时，称为缓存命中。</p><p>缓存命中率越高，缓存的利用率也就越高。</p><h2 id="最大空间" tabindex="-1">最大空间 <a class="header-anchor" href="#最大空间" aria-label="Permalink to &quot;最大空间&quot;">​</a></h2><p>缓存通常位于内存中，内存的空间通常比磁盘空间小的多，因此缓存的最大空间不可能非常大。</p><p>当缓存存放的数据量超过最大空间时，就需要淘汰部分数据来存放新到达的数据。</p><h2 id="淘汰策略" tabindex="-1">淘汰策略 <a class="header-anchor" href="#淘汰策略" aria-label="Permalink to &quot;淘汰策略&quot;">​</a></h2><ul><li><p>FIFO（First In First Out）：先进先出策略，在实时性的场景下，需要经常访问最新的数据，那么就可以使用 FIFO，使得最先进入的数据（最晚的数据）被淘汰。</p></li><li><p>LRU（Least Recently Used）：最近最久未使用策略，优先淘汰最久未使用的数据，也就是上次被访问时间距离现在最久的数据。该策略可以保证内存中的数据都是热点数据，也就是经常被访问的数据，从而保证缓存命中率。</p></li><li><p>LFU（Least Frequently Used）：最不经常使用策略，优先淘汰一段时间内使用次数最少的数据。</p></li></ul><h1 id="二、lru" tabindex="-1">二、LRU <a class="header-anchor" href="#二、lru" aria-label="Permalink to &quot;二、LRU&quot;">​</a></h1><p>以下是基于 双向链表 + HashMap 的 LRU 算法实现，对算法的解释如下：</p><ul><li>访问某个节点时，将其从原来的位置删除，并重新插入到链表头部。这样就能保证链表尾部存储的就是最近最久未使用的节点，当节点数量大于缓存最大空间时就淘汰链表尾部的节点。</li><li>为了使删除操作时间复杂度为 O(1)，就不能采用遍历的方式找到某个节点。HashMap 存储着 Key 到节点的映射，通过 Key 就能以 O(1) 的时间得到节点，然后再以 O(1) 的时间将其从双向队列中删除。</li></ul><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">LRU</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#F97583;">K</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">V</span><span style="color:#E1E4E8;">&gt; </span><span style="color:#F97583;">implements</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Iterable</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#F97583;">K</span><span style="color:#E1E4E8;">&gt; {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> Node head;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> Node tail;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> HashMap&lt;</span><span style="color:#F97583;">K</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">Node</span><span style="color:#E1E4E8;">&gt; map;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> maxSize;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Node</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        Node pre;</span></span>
<span class="line"><span style="color:#E1E4E8;">        Node next;</span></span>
<span class="line"><span style="color:#E1E4E8;">        K k;</span></span>
<span class="line"><span style="color:#E1E4E8;">        V v;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Node</span><span style="color:#E1E4E8;">(K </span><span style="color:#FFAB70;">k</span><span style="color:#E1E4E8;">, V </span><span style="color:#FFAB70;">v</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.k </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> k;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.v </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> v;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">LRU</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#FFAB70;">maxSize</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.maxSize </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> maxSize;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.map </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> HashMap&lt;&gt;(maxSize </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">4</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">3</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        head </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Node</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        tail </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Node</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        head.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> tail;</span></span>
<span class="line"><span style="color:#E1E4E8;">        tail.pre </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> head;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> V </span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">(K </span><span style="color:#FFAB70;">key</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">map.</span><span style="color:#B392F0;">containsKey</span><span style="color:#E1E4E8;">(key)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        Node node </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> map.</span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">(key);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">unlink</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">appendHead</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> node.v;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">put</span><span style="color:#E1E4E8;">(K </span><span style="color:#FFAB70;">key</span><span style="color:#E1E4E8;">, V </span><span style="color:#FFAB70;">value</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (map.</span><span style="color:#B392F0;">containsKey</span><span style="color:#E1E4E8;">(key)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            Node node </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> map.</span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">(key);</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">unlink</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        Node node </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Node</span><span style="color:#E1E4E8;">(key, value);</span></span>
<span class="line"><span style="color:#E1E4E8;">        map.</span><span style="color:#B392F0;">put</span><span style="color:#E1E4E8;">(key, node);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">appendHead</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (map.</span><span style="color:#B392F0;">size</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> maxSize) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            Node toRemove </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">removeTail</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">            map.</span><span style="color:#B392F0;">remove</span><span style="color:#E1E4E8;">(toRemove.k);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">unlink</span><span style="color:#E1E4E8;">(Node </span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        Node pre </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node.pre;</span></span>
<span class="line"><span style="color:#E1E4E8;">        Node next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node.next;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        pre.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> next;</span></span>
<span class="line"><span style="color:#E1E4E8;">        next.pre </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        node.pre </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        node.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">appendHead</span><span style="color:#E1E4E8;">(Node </span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        Node next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> head.next;</span></span>
<span class="line"><span style="color:#E1E4E8;">        node.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> next;</span></span>
<span class="line"><span style="color:#E1E4E8;">        next.pre </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">        node.pre </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> head;</span></span>
<span class="line"><span style="color:#E1E4E8;">        head.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> Node </span><span style="color:#B392F0;">removeTail</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        Node node </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> tail.pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        Node pre </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node.pre;</span></span>
<span class="line"><span style="color:#E1E4E8;">        tail.pre </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> pre;</span></span>
<span class="line"><span style="color:#E1E4E8;">        pre.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> tail;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        node.pre </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        node.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    @</span><span style="color:#F97583;">Override</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> Iterator&lt;</span><span style="color:#F97583;">K</span><span style="color:#E1E4E8;">&gt; </span><span style="color:#B392F0;">iterator</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> Iterator&lt;</span><span style="color:#F97583;">K</span><span style="color:#E1E4E8;">&gt;() {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> Node cur </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> head.next;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            @</span><span style="color:#F97583;">Override</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">hasNext</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> cur </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> tail;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            @</span><span style="color:#F97583;">Override</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> K </span><span style="color:#B392F0;">next</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">                Node node </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> cur;</span></span>
<span class="line"><span style="color:#E1E4E8;">                cur </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> cur.next;</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> node.k;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">        };</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">LRU</span><span style="color:#24292E;">&lt;</span><span style="color:#D73A49;">K</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">V</span><span style="color:#24292E;">&gt; </span><span style="color:#D73A49;">implements</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Iterable</span><span style="color:#24292E;">&lt;</span><span style="color:#D73A49;">K</span><span style="color:#24292E;">&gt; {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> Node head;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> Node tail;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> HashMap&lt;</span><span style="color:#D73A49;">K</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">Node</span><span style="color:#24292E;">&gt; map;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> maxSize;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Node</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        Node pre;</span></span>
<span class="line"><span style="color:#24292E;">        Node next;</span></span>
<span class="line"><span style="color:#24292E;">        K k;</span></span>
<span class="line"><span style="color:#24292E;">        V v;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Node</span><span style="color:#24292E;">(K </span><span style="color:#E36209;">k</span><span style="color:#24292E;">, V </span><span style="color:#E36209;">v</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.k </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> k;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.v </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> v;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">LRU</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">maxSize</span><span style="color:#24292E;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.maxSize </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> maxSize;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.map </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> HashMap&lt;&gt;(maxSize </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">4</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">/</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Node</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">null</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        tail </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Node</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">null</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        head.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tail;</span></span>
<span class="line"><span style="color:#24292E;">        tail.pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> V </span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(K </span><span style="color:#E36209;">key</span><span style="color:#24292E;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">map.</span><span style="color:#6F42C1;">containsKey</span><span style="color:#24292E;">(key)) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        Node node </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> map.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(key);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">unlink</span><span style="color:#24292E;">(node);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">appendHead</span><span style="color:#24292E;">(node);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> node.v;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">put</span><span style="color:#24292E;">(K </span><span style="color:#E36209;">key</span><span style="color:#24292E;">, V </span><span style="color:#E36209;">value</span><span style="color:#24292E;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (map.</span><span style="color:#6F42C1;">containsKey</span><span style="color:#24292E;">(key)) {</span></span>
<span class="line"><span style="color:#24292E;">            Node node </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> map.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(key);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">unlink</span><span style="color:#24292E;">(node);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        Node node </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Node</span><span style="color:#24292E;">(key, value);</span></span>
<span class="line"><span style="color:#24292E;">        map.</span><span style="color:#6F42C1;">put</span><span style="color:#24292E;">(key, node);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">appendHead</span><span style="color:#24292E;">(node);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (map.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> maxSize) {</span></span>
<span class="line"><span style="color:#24292E;">            Node toRemove </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">removeTail</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">            map.</span><span style="color:#6F42C1;">remove</span><span style="color:#24292E;">(toRemove.k);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">unlink</span><span style="color:#24292E;">(Node </span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        Node pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node.pre;</span></span>
<span class="line"><span style="color:#24292E;">        Node next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node.next;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        pre.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> next;</span></span>
<span class="line"><span style="color:#24292E;">        next.pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        node.pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        node.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">appendHead</span><span style="color:#24292E;">(Node </span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        Node next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head.next;</span></span>
<span class="line"><span style="color:#24292E;">        node.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> next;</span></span>
<span class="line"><span style="color:#24292E;">        next.pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">        node.pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        head.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> Node </span><span style="color:#6F42C1;">removeTail</span><span style="color:#24292E;">() {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        Node node </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tail.pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        Node pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node.pre;</span></span>
<span class="line"><span style="color:#24292E;">        tail.pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pre;</span></span>
<span class="line"><span style="color:#24292E;">        pre.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tail;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        node.pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        node.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Override</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> Iterator&lt;</span><span style="color:#D73A49;">K</span><span style="color:#24292E;">&gt; </span><span style="color:#6F42C1;">iterator</span><span style="color:#24292E;">() {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Iterator&lt;</span><span style="color:#D73A49;">K</span><span style="color:#24292E;">&gt;() {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> Node cur </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head.next;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            @</span><span style="color:#D73A49;">Override</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">hasNext</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> cur </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> tail;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            @</span><span style="color:#D73A49;">Override</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> K </span><span style="color:#6F42C1;">next</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">                Node node </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> cur;</span></span>
<span class="line"><span style="color:#24292E;">                cur </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> cur.next;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> node.k;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        };</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h1 id="三、缓存位置" tabindex="-1">三、缓存位置 <a class="header-anchor" href="#三、缓存位置" aria-label="Permalink to &quot;三、缓存位置&quot;">​</a></h1><h2 id="浏览器" tabindex="-1">浏览器 <a class="header-anchor" href="#浏览器" aria-label="Permalink to &quot;浏览器&quot;">​</a></h2><p>当 HTTP 响应允许进行缓存时，浏览器会将 HTML、CSS、JavaScript、图片等静态资源进行缓存。</p><h2 id="isp" tabindex="-1">ISP <a class="header-anchor" href="#isp" aria-label="Permalink to &quot;ISP&quot;">​</a></h2><p>网络服务提供商（ISP）是网络访问的第一跳，通过将数据缓存在 ISP 中能够大大提高用户的访问速度。</p><h2 id="反向代理" tabindex="-1">反向代理 <a class="header-anchor" href="#反向代理" aria-label="Permalink to &quot;反向代理&quot;">​</a></h2><p>反向代理位于服务器之前，请求与响应都需要经过反向代理。通过将数据缓存在反向代理，在用户请求反向代理时就可以直接使用缓存进行响应。</p><h2 id="本地缓存" tabindex="-1">本地缓存 <a class="header-anchor" href="#本地缓存" aria-label="Permalink to &quot;本地缓存&quot;">​</a></h2><p>使用 Guava Cache 将数据缓存在服务器本地内存中，服务器代码可以直接读取本地内存中的缓存，速度非常快。</p><h2 id="分布式缓存" tabindex="-1">分布式缓存 <a class="header-anchor" href="#分布式缓存" aria-label="Permalink to &quot;分布式缓存&quot;">​</a></h2><p>使用 Redis、Memcache 等分布式缓存将数据缓存在分布式缓存系统中。</p><p>相对于本地缓存来说，分布式缓存单独部署，可以根据需求分配硬件资源。不仅如此，服务器集群都可以访问分布式缓存，而本地缓存需要在服务器集群之间进行同步，实现难度和性能开销上都非常大。</p><h2 id="数据库缓存" tabindex="-1">数据库缓存 <a class="header-anchor" href="#数据库缓存" aria-label="Permalink to &quot;数据库缓存&quot;">​</a></h2><p>MySQL 等数据库管理系统具有自己的查询缓存机制来提高查询效率。</p><h2 id="java-内部的缓存" tabindex="-1">Java 内部的缓存 <a class="header-anchor" href="#java-内部的缓存" aria-label="Permalink to &quot;Java 内部的缓存&quot;">​</a></h2><p>Java 为了优化空间，提高字符串、基本数据类型包装类的创建效率，设计了字符串常量池及 Byte、Short、Character、Integer、Long、Boolean 这六种包装类缓冲池。</p><h2 id="cpu-多级缓存" tabindex="-1">CPU 多级缓存 <a class="header-anchor" href="#cpu-多级缓存" aria-label="Permalink to &quot;CPU 多级缓存&quot;">​</a></h2><p>CPU 为了解决运算速度与主存 IO 速度不匹配的问题，引入了多级缓存结构，同时使用 MESI 等缓存一致性协议来解决多核 CPU 缓存数据一致性的问题。</p><h1 id="四、cdn" tabindex="-1">四、CDN <a class="header-anchor" href="#四、cdn" aria-label="Permalink to &quot;四、CDN&quot;">​</a></h1><p>内容分发网络（Content distribution network，CDN）是一种互连的网络系统，它利用更靠近用户的服务器从而更快更可靠地将 HTML、CSS、JavaScript、音乐、图片、视频等静态资源分发给用户。</p><p>CDN 主要有以下优点：</p><ul><li>更快地将数据分发给用户；</li><li>通过部署多台服务器，从而提高系统整体的带宽性能；</li><li>多台服务器可以看成是一种冗余机制，从而具有高可用性。</li></ul><h1 id="五、缓存问题" tabindex="-1">五、缓存问题 <a class="header-anchor" href="#五、缓存问题" aria-label="Permalink to &quot;五、缓存问题&quot;">​</a></h1><h2 id="缓存穿透" tabindex="-1">缓存穿透 <a class="header-anchor" href="#缓存穿透" aria-label="Permalink to &quot;缓存穿透&quot;">​</a></h2><p>指的是对某个一定不存在的数据进行请求，该请求将会穿透缓存到达数据库。</p><p>解决方案：</p><ul><li>对这些不存在的数据缓存一个空数据；</li><li>对这类请求进行过滤。</li></ul><h2 id="缓存雪崩" tabindex="-1">缓存雪崩 <a class="header-anchor" href="#缓存雪崩" aria-label="Permalink to &quot;缓存雪崩&quot;">​</a></h2><p>指的是由于数据没有被加载到缓存中，或者缓存数据在同一时间大面积失效（过期），又或者缓存服务器宕机，导致大量的请求都到达数据库。</p><p>在有缓存的系统中，系统非常依赖于缓存，缓存分担了很大一部分的数据请求。当发生缓存雪崩时，数据库无法处理这么大的请求，导致数据库崩溃。</p><p>解决方案：</p><ul><li>为了防止缓存在同一时间大面积过期导致的缓存雪崩，可以通过观察用户行为，合理设置缓存过期时间来实现；</li><li>为了防止缓存服务器宕机出现的缓存雪崩，可以使用分布式缓存，分布式缓存中每一个节点只缓存部分的数据，当某个节点宕机时可以保证其它节点的缓存仍然可用。</li><li>也可以进行缓存预热，避免在系统刚启动不久由于还未将大量数据进行缓存而导致缓存雪崩。</li></ul><h2 id="缓存一致性" tabindex="-1">缓存一致性 <a class="header-anchor" href="#缓存一致性" aria-label="Permalink to &quot;缓存一致性&quot;">​</a></h2><p>缓存一致性要求数据更新的同时缓存数据也能够实时更新。</p><p>解决方案：</p><ul><li>在数据更新的同时立即去更新缓存；</li><li>在读缓存之前先判断缓存是否是最新的，如果不是最新的先进行更新。</li></ul><p>要保证缓存一致性需要付出很大的代价，缓存数据最好是那些对一致性要求不高的数据，允许缓存数据存在一些脏数据。</p><h2 id="缓存-无底洞-现象" tabindex="-1">缓存 “无底洞” 现象 <a class="header-anchor" href="#缓存-无底洞-现象" aria-label="Permalink to &quot;缓存 “无底洞” 现象&quot;">​</a></h2><p>指的是为了满足业务要求添加了大量缓存节点，但是性能不但没有好转反而下降了的现象。</p><p>产生原因：缓存系统通常采用 hash 函数将 key 映射到对应的缓存节点，随着缓存节点数目的增加，键值分布到更多的节点上，导致客户端一次批量操作会涉及多次网络操作，这意味着批量操作的耗时会随着节点数目的增加而不断增大。此外，网络连接数变多，对节点的性能也有一定影响。</p><p>解决方案：</p><ul><li>优化批量数据操作命令；</li><li>减少网络通信次数；</li><li>降低接入成本，使用长连接 / 连接池，NIO 等。</li></ul><h1 id="六、数据分布" tabindex="-1">六、数据分布 <a class="header-anchor" href="#六、数据分布" aria-label="Permalink to &quot;六、数据分布&quot;">​</a></h1><h2 id="哈希分布" tabindex="-1">哈希分布 <a class="header-anchor" href="#哈希分布" aria-label="Permalink to &quot;哈希分布&quot;">​</a></h2><p>哈希分布就是将数据计算哈希值之后，按照哈希值分配到不同的节点上。例如有 N 个节点，数据的主键为 key，则将该数据分配的节点序号为：hash(key)%N。</p><p>传统的哈希分布算法存在一个问题：当节点数量变化时，也就是 N 值变化，那么几乎所有的数据都需要重新分布，将导致大量的数据迁移。</p><h2 id="顺序分布" tabindex="-1">顺序分布 <a class="header-anchor" href="#顺序分布" aria-label="Permalink to &quot;顺序分布&quot;">​</a></h2><p>将数据划分为多个连续的部分，按数据的 ID 或者时间分布到不同节点上。例如 User 表的 ID 范围为 1 ~ 7000，使用顺序分布可以将其划分成多个子表，对应的主键范围为 1 ~ 1000，1001 ~ 2000，...，6001 ~ 7000。</p><p>顺序分布相比于哈希分布的主要优点如下：</p><ul><li>能保持数据原有的顺序；</li><li>并且能够准确控制每台服务器存储的数据量，从而使得存储空间的利用率最大。</li></ul><h1 id="七、一致性哈希" tabindex="-1">七、一致性哈希 <a class="header-anchor" href="#七、一致性哈希" aria-label="Permalink to &quot;七、一致性哈希&quot;">​</a></h1><p>Distributed Hash Table（DHT） 是一种哈希分布方式，其目的是为了克服传统哈希分布在服务器节点数量变化时大量数据迁移的问题。</p><h2 id="基本原理" tabindex="-1">基本原理 <a class="header-anchor" href="#基本原理" aria-label="Permalink to &quot;基本原理&quot;">​</a></h2><p>将哈希空间 [0, 2<sup>n</sup>-1] 看成一个哈希环，每个服务器节点都配置到哈希环上。每个数据对象通过哈希取模得到哈希值之后，存放到哈希环中顺时针方向第一个大于等于该哈希值的节点上。</p><p>一致性哈希在增加或者删除节点时只会影响到哈希环中相邻的节点，例如下图中新增节点 X，只需要将它前一个节点 C 上的数据重新进行分布即可，对于节点 A、B、D 都没有影响。</p><h2 id="虚拟节点" tabindex="-1">虚拟节点 <a class="header-anchor" href="#虚拟节点" aria-label="Permalink to &quot;虚拟节点&quot;">​</a></h2><p>上面描述的一致性哈希存在数据分布不均匀的问题，节点存储的数据量有可能会存在很大的不同。</p><p>数据不均匀主要是因为节点在哈希环上分布的不均匀，这种情况在节点数量很少的情况下尤其明显。</p><p>解决方式是通过增加虚拟节点，然后将虚拟节点映射到真实节点上。虚拟节点的数量比真实节点来得多，那么虚拟节点在哈希环上分布的均匀性就会比原来的真实节点好，从而使得数据分布也更加均匀。</p><h1 id="参考资料" tabindex="-1">参考资料 <a class="header-anchor" href="#参考资料" aria-label="Permalink to &quot;参考资料&quot;">​</a></h1><ul><li>大规模分布式存储系统</li><li><a href="https://tech.meituan.com/cache_about.html" target="_blank" rel="noreferrer">缓存那些事</a></li><li><a href="https://my.oschina.net/jayhu/blog/732849" target="_blank" rel="noreferrer">一致性哈希算法</a></li><li><a href="https://zh.wikipedia.org/wiki/%E5%85%A7%E5%AE%B9%E5%82%B3%E9%81%9E%E7%B6%B2%E8%B7%AF" target="_blank" rel="noreferrer">内容分发网络</a></li><li><a href="https://www.aspirationhosting.com/aspiration-cdn/" target="_blank" rel="noreferrer">How Aspiration CDN helps to improve your website loading speed?</a></li></ul>`,75),e=[o];function c(t,r,E,y,i,d){return n(),a("div",null,e)}const u=s(p,[["render",c]]);export{F as __pageData,u as default};
