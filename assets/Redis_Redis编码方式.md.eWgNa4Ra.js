import{_ as s,o as n,c as e,R as a}from"./chunks/framework.7FlijoJG.js";const u=JSON.parse('{"title":"Redis编码方式","description":"","frontmatter":{"title":"Redis编码方式","date":"2024-01-10T11:47:14.000Z","Tags":["Tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"Redis/Redis编码方式.md","filePath":"Redis/Redis编码方式.md","lastUpdated":1711296414000}'),l={name:"Redis/Redis编码方式.md"},p=a(`<h1 id="redis-提供的编码方式" tabindex="-1">Redis 提供的编码方式 <a class="header-anchor" href="#redis-提供的编码方式" aria-label="Permalink to &quot;Redis 提供的编码方式&quot;">​</a></h1><p>Redis 提供了八种编码方式，每种编码方式都有其特定的数据结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">redis_encoding_int // 整数字符串</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">redis_encoding_embstr // 短字符串</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">redis_encoding_row // 长字符串</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">redis_encoding_ziplist // 压缩列表</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">redis_encoding_linkedlist // 链表</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">redis_encoding_intset // 整数集合</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">redis_encoding_hashtable // hashTable</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">redis_encoding_skiplist // 跳跃表</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">redis_encoding_int // 整数字符串</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">redis_encoding_embstr // 短字符串</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">redis_encoding_row // 长字符串</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">redis_encoding_ziplist // 压缩列表</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">redis_encoding_linkedlist // 链表</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">redis_encoding_intset // 整数集合</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">redis_encoding_hashtable // hashTable</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">redis_encoding_skiplist // 跳跃表</span></span></code></pre></div><h2 id="_1-int-编码方式" tabindex="-1">1.INT 编码方式 <a class="header-anchor" href="#_1-int-编码方式" aria-label="Permalink to &quot;1.INT 编码方式&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131626.png" alt=""></p><p>INT 编码方式会将 RedisObject 中的 ptr 指针直接改写成 long ptr，ptr 属性直接存储字面量。</p><h2 id="_2-embstr-编码方式" tabindex="-1">2.EMBSTR 编码方式 <a class="header-anchor" href="#_2-embstr-编码方式" aria-label="Permalink to &quot;2.EMBSTR 编码方式&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131627.png" alt=""></p><h2 id="_3-row-编码方式" tabindex="-1">3.ROW 编码方式 <a class="header-anchor" href="#_3-row-编码方式" aria-label="Permalink to &quot;3.ROW 编码方式&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131628.png" alt=""></p><p>EMBSTR 和 ROW 编码方式在内存中都会创建字符串对象（SDS），区别在于 EMBSTR 编码方式中 RedisObject 和 SDS 共同使用同一块内存单元，Redis 内存分配器只需要分配一次内存，而 ROW 编码方式中需要单独的为 RedisObject 和 SDS 分配内存单元。</p><h2 id="_4-ziplist-编码方式" tabindex="-1">4.ZIPLIST 编码方式 <a class="header-anchor" href="#_4-ziplist-编码方式" aria-label="Permalink to &quot;4.ZIPLIST 编码方式&quot;">​</a></h2><p>压缩列表是 Redis 为了节约内存而开发的，它是一块顺序表（顺序存储结构，内存空间连续），一个压缩列表中可以包含多个 entry 节点，每个 entry 节点可以保存一个整数值或者字符串。</p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131629.png" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">zlbytes：记录了压缩列表的大小（占 4 个字节）</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">zltail：记录了压缩列表最后一个节点距离起始位置的大小（占 4 个字节）</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">zllen：记录了压缩列节点的个数（占 2 个字节）</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">entry：压缩列表中的节点（大小由节点中存储的内容所决定）</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">zlend：压缩列表的结束标志（占 1 个字节）</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">zlbytes：记录了压缩列表的大小（占 4 个字节）</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">zltail：记录了压缩列表最后一个节点距离起始位置的大小（占 4 个字节）</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">zllen：记录了压缩列节点的个数（占 2 个字节）</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">entry：压缩列表中的节点（大小由节点中存储的内容所决定）</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">zlend：压缩列表的结束标志（占 1 个字节）</span></span></code></pre></div><p>如果存在一个指针 P 指向压缩列表的起始位置，就可以根据 P+zltail 得到最后一个节点的地址。</p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131630.png" alt=""></p><h2 id="_5-linkedlist-编码方式" tabindex="-1">5.LINKEDLIST 编码方式 <a class="header-anchor" href="#_5-linkedlist-编码方式" aria-label="Permalink to &quot;5.LINKEDLIST 编码方式&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131631.png" alt=""></p><p>Redis 使用 listNode 结构来表示链表中的节点。</p><p>typedef struct listNode { struct listNode prev; struct listNode next; void value; }listNode;</p><p>每个 listNode 节点分别包含指向前驱和后继节点的指针以及指向元素的指针。</p><p>Redis 使用 list 结构来持有 listNode</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">typedef struct list {</span></span>
<span class="line"><span style="color:#e1e4e8;">listNode head;</span></span>
<span class="line"><span style="color:#e1e4e8;">listNode tail;</span></span>
<span class="line"><span style="color:#e1e4e8;">unsigned long len;</span></span>
<span class="line"><span style="color:#e1e4e8;">void dup(void ptr); // 节点复制函数</span></span>
<span class="line"><span style="color:#e1e4e8;">void free(void ptr); // 节点值释放函数</span></span>
<span class="line"><span style="color:#e1e4e8;">int match(void ptr , void key); // 节点值比对函数</span></span>
<span class="line"><span style="color:#e1e4e8;">}list;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">typedef struct list {</span></span>
<span class="line"><span style="color:#24292e;">listNode head;</span></span>
<span class="line"><span style="color:#24292e;">listNode tail;</span></span>
<span class="line"><span style="color:#24292e;">unsigned long len;</span></span>
<span class="line"><span style="color:#24292e;">void dup(void ptr); // 节点复制函数</span></span>
<span class="line"><span style="color:#24292e;">void free(void ptr); // 节点值释放函数</span></span>
<span class="line"><span style="color:#24292e;">int match(void ptr , void key); // 节点值比对函数</span></span>
<span class="line"><span style="color:#24292e;">}list;</span></span></code></pre></div><p>head 指针：指向链表的头节点。</p><p>tail 指针：指向链表的最后一个节点。</p><p>len 属性：存储链表中节点的个数。</p><h2 id="_6-intset-编码方式" tabindex="-1">6.INTSET 编码方式 <a class="header-anchor" href="#_6-intset-编码方式" aria-label="Permalink to &quot;6.INTSET 编码方式&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131632.png" alt=""></p><p>Redis 使用 intset 结构来表示整数集合。</p><p>typedef struct inset { uint32_t encoding; uint32_t length; int8_t contents[]; }intset;</p><p>encoding 属性：标识 contents 数组的类型，支持 INTESET_ENC_INT16、INTESET_ENC_INT32、INTESET_ENC_INT64。</p><p>length 属性：存储整数集合中元素的个数。</p><p>contents 数组：存储整数集合中的元素（从小到大进行排序，并且保证元素不会重复）</p><h3 id="contents-升级" tabindex="-1">Contents 升级 <a class="header-anchor" href="#contents-升级" aria-label="Permalink to &quot;Contents 升级&quot;">​</a></h3><p>当往整数集合中添加一个比当前 Contents 数组类型还要大的元素时，将要进行 Contents 的升级。</p><p>1.对 Contents 数组进行扩容( (length + 1) 新类型的大小）</p><p>2.将原有的元素转换成与新元素相同的类型，然后移动到正确的位置上。</p><p>3.将新元素添加到数组当中。</p><p>4.将 encoding 属性修改为新元素的类型。</p><p>contents 数组不支持降级，一旦对 contents 数组进行了升级那么就要一直保持升级后的状态。</p><h2 id="_7-hashtable-编码方式" tabindex="-1">7.HASHTABLE 编码方式 <a class="header-anchor" href="#_7-hashtable-编码方式" aria-label="Permalink to &quot;7.HASHTABLE 编码方式&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131625.png" alt=""></p><h2 id="_8-skiplist-编码方式" tabindex="-1">8.SKIPLIST 编码方式 <a class="header-anchor" href="#_8-skiplist-编码方式" aria-label="Permalink to &quot;8.SKIPLIST 编码方式&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131634.png" alt=""></p><p>通过在每个节点中维护多个指向其他节点的指针，从而达到快速访问的目的。</p><p>Redis 使用 zskiplistNode 结构来表示跳跃表中的节点.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">typedef struct zskiplistNode {</span></span>
<span class="line"><span style="color:#e1e4e8;">struct zskiplistLevel {</span></span>
<span class="line"><span style="color:#e1e4e8;">struct zskiplistNode forward;</span></span>
<span class="line"><span style="color:#e1e4e8;">unsigned int span;</span></span>
<span class="line"><span style="color:#e1e4e8;">}level\\[\\];</span></span>
<span class="line"><span style="color:#e1e4e8;">struct zskiplistNode backward;</span></span>
<span class="line"><span style="color:#e1e4e8;">double score;</span></span>
<span class="line"><span style="color:#e1e4e8;">robj obj;</span></span>
<span class="line"><span style="color:#e1e4e8;">}zskiplistNode</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">typedef struct zskiplistNode {</span></span>
<span class="line"><span style="color:#24292e;">struct zskiplistLevel {</span></span>
<span class="line"><span style="color:#24292e;">struct zskiplistNode forward;</span></span>
<span class="line"><span style="color:#24292e;">unsigned int span;</span></span>
<span class="line"><span style="color:#24292e;">}level\\[\\];</span></span>
<span class="line"><span style="color:#24292e;">struct zskiplistNode backward;</span></span>
<span class="line"><span style="color:#24292e;">double score;</span></span>
<span class="line"><span style="color:#24292e;">robj obj;</span></span>
<span class="line"><span style="color:#24292e;">}zskiplistNode</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">level\\[\\]数组：用于存储 zskiplistLevel，每个 zskiplistLevel 都包含 forward 和 span 属性，其中 forward 属性用于指向表尾方向的其他节点，而 span 属性则记录了 forward 指针所指向的节点距离当前节点的跨度（forward 指针遵循同层连接的原则）</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">backward 属性：指向上一个节点的指针。</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">score 属性：存储元素的分数。</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">obj 指针：指向元素的地址（字符串对象）</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">level\\[\\]数组：用于存储 zskiplistLevel，每个 zskiplistLevel 都包含 forward 和 span 属性，其中 forward 属性用于指向表尾方向的其他节点，而 span 属性则记录了 forward 指针所指向的节点距离当前节点的跨度（forward 指针遵循同层连接的原则）</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">backward 属性：指向上一个节点的指针。</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">score 属性：存储元素的分数。</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">obj 指针：指向元素的地址（字符串对象）</span></span></code></pre></div><p>每次创建一个新的跳跃表节点时，会随机生成一个介于 1 到 32 之间的值作为 level 数组的大小。</p><p>Redis 使用 zskiplist 结构来持有 zskiplistNode</p><p>typedef struct zskiplist { struct zskiplistNode header,tail; unsigned long length; int level; }zskiplist;</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">header 指针：指向跳跃表的头节点。</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">tail 指针：指向跳跃表的最后一个节点。</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">length 属性：存储跳跃表中节点的个数（不包括表头节点）</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">level 属性：跳跃表中节点 level 的最大值（不包括表头节点）</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">header 指针：指向跳跃表的头节点。</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">tail 指针：指向跳跃表的最后一个节点。</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">length 属性：存储跳跃表中节点的个数（不包括表头节点）</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">level 属性：跳跃表中节点 level 的最大值（不包括表头节点）</span></span></code></pre></div><p>跳跃表中存在表头节点，表头节点一共有 32 个 level，即数组的大小为 32。</p><h3 id="遍历-zskiplist-的流程" tabindex="-1">遍历 zskiplist 的流程 <a class="header-anchor" href="#遍历-zskiplist-的流程" aria-label="Permalink to &quot;遍历 zskiplist 的流程&quot;">​</a></h3><p>1.通过 zskiplist 的 header 指针访问跳跃表中的头节点。</p><p>2.从下一个节点最高的 level 开始往下遍历，若下一个节点的最高 level 比当前节点的最高 level 要大，则从当前节点的最高 level 开始往下遍历。</p><p>3.当不存在下一个节点时，遍历结束。</p>`,58),t=[p];function o(i,c,r,d,y,h){return n(),e("div",null,t)}const _=s(l,[["render",o]]);export{u as __pageData,_ as default};
