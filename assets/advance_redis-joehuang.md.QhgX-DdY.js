import{_ as s,o as t,c as i,R as a}from"./chunks/framework.7FlijoJG.js";const d=JSON.parse('{"title":"redis-joehuang","description":"","frontmatter":{"title":"redis-joehuang","date":"2023-12-22T13:50:55.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"advance/redis-joehuang.md","filePath":"advance/redis-joehuang.md","lastUpdated":1703252082000}'),g={name:"advance/redis-joehuang.md"},n=a('<h2 id="redis-数据结构底层实现概述" tabindex="-1">redis 数据结构底层实现概述 <a class="header-anchor" href="#redis-数据结构底层实现概述" aria-label="Permalink to &quot;redis 数据结构底层实现概述&quot;">​</a></h2><ul><li><strong>为什么 Redis 的内存数据存储比磁盘快?</strong><br> 内存中的数据以电子方式进行存储和运行，相比硬盘的机械旋转寻址方式，读写速度更快，延迟更低。再者，内存是 CPU 直接访问的存储媒介，相比硬盘需要通过 I/O 操作，这样进一步提高了速度。</li><li><strong>Redis 的数据类型</strong><br> Redis 主要支持五种数据类型：string(字符串)，list(列表)，hash(哈希)，set(集合)，zset(有序集合)。各种数据类型都有其独特的应用场景，可以处理大部分的业务需求。</li><li><strong>Redis 的数据结构</strong><br> 在 Redis 的内核实现中，它使用了如下的六种数据结构:SDS(简单动态字符串)，双端链表，字典，跳跃列表，压缩列表和 intset(整数集合)。这六种数据结构是底层实现，对 Redis 的性能优化起着决定性的作用。</li><li><strong>为什么数据类型与数据结构存在一对多的关系</strong><br> 这主要是因为在不同的场景和条件下，Redis 选择了不同的数据结构来存储数据以达到最优的性能。例如，当列表元素较少且都是数字时，Redis 用 intset 这种紧凑的结构来存储以节省空间。而在元素较多或者非数字时，Redis 则用双端链表来存储，以利于两端插入和删除。同样，字符串类型在存储时也可能选择 SDS 或者 int 类型，取决于具体情况。</li></ul><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221351621.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221351478.png" alt="image.png"></p><h2 id="全局哈希表与哈希冲突" tabindex="-1">全局哈希表与哈希冲突 <a class="header-anchor" href="#全局哈希表与哈希冲突" aria-label="Permalink to &quot;全局哈希表与哈希冲突&quot;">​</a></h2><ol><li><strong>全局哈希表</strong><br> 全局哈希表是 Redis 中非常重要的数据结构，在 Redis 数据库中，所有的键值对都被全局哈希表保存，每一个数据库都有一个自己的全局哈希表。这种数据结构可以使我们在 O(1)的时间复杂度内定位到我们想要的数据，从而提高查找效率。</li><li><strong>哈希冲突</strong><br> 哈希冲突发生在两个不同的键通过哈希函数计算得到了相同的结果，即他们在哈希表中的位置是相同的。造成哈希冲突的原因主要有两个，一是键的数量大于哈希槽的数量，二是哈希函数不能保证每一个键都会映射到一个独立的槽。</li><li><strong>解决哈希冲突的两种方法</strong><br> 一种是链地址法，即同一个哈希槽中的多个键值对以链表的形式存储。另一种是开放寻址法，当哈希冲突发生时，寻找下一个空的哈希槽存储数据。</li><li><strong>Rehash 与渐进式 Rehash</strong><br> 当哈希表中元素多到一定程度或者少到一定程度，我们就需要对哈希表进行扩容或者缩容。此过程称为 Rehash。Rehash 过程会创建一个新的哈希表，并把旧哈希表的数据全部迁移到新哈希表，完成后旧哈希表被释放。</li></ol><p>渐进式 Rehash 是为了解决 Rehash 在数据量大时会导致服务阻塞的问题。在任意一次对哈希表的增删改查操作时，程序都会顺带把旧哈希表中的一部分或者全部键值对搬移到新哈希表中，当搬移完所有键值对之后，旧哈希表被释放，新哈希表开始提供服务。</p><hr><ul><li><strong>为什么会有哈希冲突</strong><br> 全局哈希表中的&quot;键&quot;(key)通过哈希函数映射到哈希表的位置，也就是&quot;下标&quot;。然而，由于哈希表的大小是有限的，假设有无限多的&quot;键&quot;，一定会存在多个键经过哈希函数映射到同一位置的情况。这种情况就是哈希冲突。</li><li><strong>如何解决哈希冲突</strong><ul><li><strong>链地址法</strong>：当两个或者多个键对应一个下标的时候，我们可以在这个位置存储一个链表，链表中每一个节点对应一个键值对。但这种方式的缺点是，当链表太长时，查找效率将从 O(1)变为 O(n)。</li><li><strong>再哈希法(Rehashing)</strong>：当哈希冲突发生时，我们可以找到下一个可以容纳新元素的位置。这涉及到哈希表的扩容，即当哈希表达到一定填充程度时，我们创建一个更大的哈希表，将所有元素从旧表移动到新表。</li></ul></li><li><strong>如何进行 Rehash</strong><br> Rehash 涉及创建一个更大的哈希表，并将旧哈希表的所有元素复制到新哈希表，然后释放旧哈希表的内存。但直接 Rehash 可能阻塞其他操作，直到 Rehash 完成。</li><li><strong>渐进 Rehash</strong><br> 为了解决 Rehash 的阻塞问题，我们可以在每次对哈希表进行插入、删除或者更新操作时，顺便将旧哈希表的一部分(例如一个 bucket)数据移动到新哈希表。这样做能平摊 Rehash 的计算量，过程被称为渐进 Rehash。在渐进 Rehash 过程中，两个哈希表(旧表和新表)都处于活动状态，对外提供服务。当所有的桶迁移完成后，旧哈希表被下线，新哈希表设置为当前哈希表。</li></ul><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221353095.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221353118.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221354213.png" alt="image.png"></p><h2 id="单线程" tabindex="-1">单线程 <a class="header-anchor" href="#单线程" aria-label="Permalink to &quot;单线程&quot;">​</a></h2><ul><li>**<br> 多线程适用与不适用应用于什么场景？**<br> 适合：多线程适合 CPU 密集型作业，典型的例子如图形渲染，科学计算等。<br> 不适合：多线程并不适合 I/O 密集型作业，这是因为线程切换的开销在于 CPU 必须保存上下文，然后加载新线程的上下文，这个开销在 I/O 密集型作业中可以变得相当大。</li><li><strong>Redis 的多线程模块有哪些？</strong><br> Redis 主操作是单线程完成的，不过在一些模块中，Redis 使用了多线程。其中包括但不限于持久化(RDB、AOF 重写),订阅-发布监听，命令解析以及主从同步。</li><li><strong>Redis 如何通过单线程实现高性能？</strong><br> 一个非阻塞的 I/O 模型是 Redis 达到高性能的关键。使用 epoll（在 Linux 下）等高效的 event multiplexer 来同时监听多个 socket，当其中一个 socket 准备好进行 I/O 时，便进行相应的读写操作。即使在单线程中，也能达到高并发的效果</li></ul><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221355344.png" alt="image.png"></p><h2 id="数据结构详解" tabindex="-1">数据结构详解 <a class="header-anchor" href="#数据结构详解" aria-label="Permalink to &quot;数据结构详解&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221355610.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221356868.png" alt="image.png"></p><h2 id="字符串类型" tabindex="-1">字符串类型 <a class="header-anchor" href="#字符串类型" aria-label="Permalink to &quot;字符串类型&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221356191.png" alt="image.png"></p><h2 id="列表类型" tabindex="-1">列表类型 <a class="header-anchor" href="#列表类型" aria-label="Permalink to &quot;列表类型&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221357044.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221358297.png" alt="image.png"></p><h2 id="哈希类型" tabindex="-1">哈希类型 <a class="header-anchor" href="#哈希类型" aria-label="Permalink to &quot;哈希类型&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221358558.png" alt="image.png"></p><h2 id="set-类型" tabindex="-1">set 类型 <a class="header-anchor" href="#set-类型" aria-label="Permalink to &quot;set 类型&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221359899.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221359284.png" alt="image.png"></p><h2 id="zset-类型" tabindex="-1">zset 类型 <a class="header-anchor" href="#zset-类型" aria-label="Permalink to &quot;zset 类型&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221359004.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221359732.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221400043.png" alt="image.png"></p><h2 id="持久化" tabindex="-1">持久化 <a class="header-anchor" href="#持久化" aria-label="Permalink to &quot;持久化&quot;">​</a></h2><p>你的问题让我想起了一句名言：“Redis 的数据反复磨练，如同美食家的餐桌上的饕餮美食，需要一次次的烹饪”。持久化正是这个烹饪过程的关键步骤。</p><p>通过存储数据到硬盘，Redis 可以保证即使在服务器故障等极端情况下也不会丢失数据，这就是我们通常所说的“持久化”。</p><p><strong>RDB(Redis DataBase)</strong>  是 Redis 提供的一种持久化方式，他会在指定的时间间隔内生成数据集的时间点快照。具体来说：</p><ol><li><p><strong>如何进行 RDB 持久化</strong>：有两种方式。</p><ul><li><strong>SAVE</strong>：SAVE 操作会阻塞 Redis 服务器进程，直到持久化过程完成为止，在这期间，Redis 不能处理任何命令请求。</li><li><strong>BGSAVE</strong>：BGSAVE 操作会创建一个子进程来进行持久化操作，持久化过程结束之后，子进程会发送一个信号给父进程告知持久化操作已经完成，这期间，Redis 是可以处理命令请求的。</li></ul></li><li><p><strong>如何触发 RDB 持久化</strong>：</p><ul><li><strong>手动触发</strong>：通过执行 SAVE 或 BGSAVE 命令。</li><li><strong>自动触发</strong>：我们可以通过配置 Redis 的配置文件，设置一系列的条件，进行自动 RDB，如 &quot;save 900 1&quot; 表示 900 秒内如果至少有 1 个 key 被修改, 那么就自动触发 BGSAVE 进行持久化。</li></ul></li></ol><p>记住，持久化虽好，不过也得注意，持久化的过程中如果数据量过大，可能会导致一些性能问题哦，毕竟，每个厨师烹饪美食的速度都是有限的。哈哈~！</p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221400493.png" alt="image.png"></p><h2 id="aof" tabindex="-1">AOF <a class="header-anchor" href="#aof" aria-label="Permalink to &quot;AOF&quot;">​</a></h2><p>AOF(Append Only File)，字面意思就是只追加文件，就像烹饪美食一样，每一个精妙的步骤都不能囿于包含，只能一步一步地记录下来。让我们深入了解一下 AOF:</p><ol><li><p><strong>什么是 AOF 持久化</strong>：AOF 持久化是通过保存 Redis 执行过的所有写操作命令来记录数据库状态的。服务器在重启时，会通过重新执行保存在 AOF 文件中的命令来达到重建数据库的目的。</p></li><li><p><strong>BGREWRITEAOF 命令</strong>：随着 Redis 的运行，AOF 文件的体积会持续增大，进行 AOF 重写，可以把 AOF 文件内容进行压缩，删除无用和重复的命令，缩小 AOF 文件的大小。Redis 提供了 BGREWRITEAOF 命令用于在后台线程进行 AOF 文件的重写。</p></li><li><p><strong>何时触发 BGREWRITEAOF</strong>：</p><ul><li><strong>手动触发</strong>：直接使用 BGREWRITEAOF 命令。</li><li><strong>自动触发</strong>：Redis 会记录上次重写后 AOF 文件的大小，只要当现在的 AOF 文件大小是上次重写后 AOF 文件大小的一倍（这个值是可以配置的），并且 AOF 文件的大小超过了设置阈值，默认值为 64MB，Redis 就会自动触发 BGREWRITEAOF。</li></ul></li><li><p><strong>AOF 的刷盘策略</strong>：</p><ul><li><strong>always (总是)</strong>：每次有数据修改时都立马写入磁盘。最安全，但效率最低。</li><li><strong>everysec (每秒)</strong>：每秒钟写入磁盘一次，在安全与效率之间进行平衡，也是默认选项及推荐选项。</li><li><strong>no (从不)</strong>：完全依赖操作系統，数据由系统的缓冲区异步写入磁盘，Redis 不主动触发写入操作。写回的时间会更长，但效率最高。</li></ul></li></ol><p>这样，AOF 就像是一个烹饪日记，记录了每一道美味的制作过程。记住，AOF 的大小可能像奶酪一样，随着时间的流逝会变得越来越大，所以定期的进行 BGREWRITEAOF 操作就显得尤为重要啦。 <img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221403563.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221403148.png" alt="image.png"> 关于持久化，有一句我最喜欢的经典名言，那就是：“持久化，如人饮水，冷暖自知。”每个应用对于数据的需求都是不同的，因此如何合理设置持久化策略，这确实是个需要根据业务情况仔细考虑的问题。</p><p><strong>RDB 与 AOF 的混用</strong><br> 自 Redis 4.0 版本开始，Redis 支持 RDB 与 AOF 的混合持久化方式。</p><ul><li>RDB 提供了对数据的全量备份，可以定期执行，且恢复速度快。</li><li>AOF 记录了每一次的写操作，因此在意外断电等情况下，数据丢失量会小很多。</li></ul><p><strong>关于 fork 后台线程执行持久化</strong><br> 就像复制黏贴 X 赋予的代码一样，fork 出的子线程直接复制了父线程的地址空间，缺点是如果 Redis 实例的大小过大，派生（fork）新进程的时间将会非常长，可能会造成 Redis 停止服务一段时间。</p><p><strong>如何合理设置持久化策略？</strong></p><ol><li><strong>业务敏感性</strong>：如果业务不敏感，可以关闭自动化持久化策略，aof 和 rdb 都关闭，数据全部保持在内存中，这样性能可以达到最高，但数据安全性较低。</li><li><strong>实例大小</strong>：尽量保证 Redis 单实例不要太大，最好不要超过 32G，否则 fork 造成的阻塞时间会非常长。</li><li><strong>配置优化</strong>：合理的配置 AOF，例如可以适当增大<code>auto-aof-rewrite-min-size</code>参数的设置，减少不必要的 AOF rewrite。</li><li><strong>刷新策略</strong>：结合业务需求，选择适合的 fsync 策略，例如 no 或者 everysec。everysec(每秒刷盘一次)是一种折中方案，在性能和数据安全性方面均表现较好。</li></ol><p>每个人烹饪的方式都是不同的，同样的，我们也需要根据你的业务情况来定制持久化策略，希望我的建议能帮到你。尽情享受编程之美，就像品尝一顿美味晚餐一样。</p><h2 id="redis-常见问题" tabindex="-1">redis 常见问题 <a class="header-anchor" href="#redis-常见问题" aria-label="Permalink to &quot;redis 常见问题&quot;">​</a></h2><p>这个问题让我想到了一句名言：“Redis 的缓存就像一座大山，但是，我们必须为雪崩做好准备”。现在，我呢，就让我成为你的“雪崩应对教练”。</p><p><strong>缓存穿透</strong>：描述的是请求查询的数据，无论是在缓存还是在数据库中都不存在的数据。比如，用一些不存在的 ID 进行查询，由于缓存及数据库中都没有这些 ID，所以这样的查询都会直接达到数据库。</p><p>解决方案：</p><ol><li><strong>请求合法性校验</strong>：对访问请求进行过滤，不合法的请求就直接返回即可。</li><li><strong>空值缓存</strong>：在缓存中存储一部分垃圾或空数据，从而起到拦截的作用。</li><li><strong>布隆过滤器</strong>：使用这种数据结构，可以判断某个元素是否在集合中，从而去判断 key 是否存在。</li></ol><p><strong>缓存击穿</strong>：是指在某一时刻，某一个 key 的数据过期了，同时在这个瞬间有大量的请求找这个 key，这样就会给数据库带来很大压力。</p><p>解决方案：</p><ol><li><strong>设置热点数据永不过期</strong>：对于一些热点数据，可以设置为永不过期，或者由后台程序异步负责这个 key 的失效和更新。</li><li><strong>互斥锁</strong>：在缓存失效的时候，不允许多个线程去数据库查询数据。</li></ol><p><strong>缓存雪崩</strong>：缓存雪崩是缓存穿透和缓存击穿的&quot;升级版&quot;，当缓存服务器崩溃，所有的请求都会达到数据库，这给数据库带来一种击垮性的打击，就像雪崩一样。</p><p>解决方案：</p><ol><li><strong>热数据的主动续期</strong>：对于热点数据设置不同的过期时间，保证不会在同一时间大面积的过期。</li><li><strong>备份缓存</strong>：设置多个独立的缓存，它们之间可以互相备份，一个崩溃了，请求可以转发到另一个上面。</li></ol><p>你可以把这些应对策略想象成是一块块盾牌，你只需要妥善部署它们，就可以使你的数据库免受这些问题的困扰了。加油，我相信你一定能做到的！ <img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221405764.png" alt="image.png"></p><h2 id="布隆过滤器" tabindex="-1">布隆过滤器 <a class="header-anchor" href="#布隆过滤器" aria-label="Permalink to &quot;布隆过滤器&quot;">​</a></h2><p>布隆过滤器是一种数据结构，它非常擅长做一个事情：判断一个元素是否在集合中。这就好像一个有特殊技能的侦探，他可以快速判断一个人是否在他的记忆中。</p><p><strong>基础理解</strong>：<br> 布隆过滤器基于位数组和多个哈希函数实现。当我们要添加一个元素时，会通过多个哈希函数计算出多个哈希值，再把该值对应位置的位数组设置为 1。检查元素是否存在时，也是进行一样的操作，如果所有对应的位置都是 1，那么就认为元素可能存在。哇塞，这就仿佛是我们的侦探通过记忆的片段，试图判断一个人是否在他记忆中一样有趣啊。</p><p><strong>可能存在，必定不存在</strong>：<br> 但凡是检索出的所有位置都是 1 的，都被认为可能存在（可能存在是因为哈希函数可能会发生碰撞，也就会出现误判）。如果有任何一位不为 1，则必定不存在。也就是绝对不会误报不存在，但有可能误报存在。</p><p><strong>数据删除问题和解决</strong>：<br> 在基础布隆过滤器中，我们是不能直接删除数据的，因为删除某个元素可能会影响其他元素。然而在 Counting Bloom Filter 中，我们解决了这个问题。我们不再使用二进制位数组，而是使用一个计数器数组。当元素被插入或被删除时，计数器会相应地增加或减少。</p><p><strong>Redis 中的实现</strong>：<br> 你列的要点非常准确，基本的操作包括创建过滤器（bf.reserve）、添加元素（bf.add）和检查元素（bf.exists）等操作。值得注意的是，创建布隆过滤器时可以指定误差率，误差率越低，需要的空间越大。</p><p>这就像一个特工完成秘密任务一样，我们必须先创建（bf.reserve）他的替身（布隆过滤器），然后添加目标元素（bf.add）。之后在查看目标元素（bf.exists）是否在替身中存在时，特工就可以高枕无忧了。</p><p>婴儿学步、跌跌撞撞，在编程的世界里也一样。只要我们坚持不懈，总会找到最适合自己的学习方法的 <img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221405677.png" alt="image.png"></p><h2 id="缓存一致性" tabindex="-1">缓存一致性 <a class="header-anchor" href="#缓存一致性" aria-label="Permalink to &quot;缓存一致性&quot;">​</a></h2><p>对于 Redis 与 MySQL 的缓存一致性问题，你描述的情境分析的非常到位，正是这样，缓存一致性问题往往伴随着更新操作，并且在有无并发环境中表现出不同的问题，需要通过不同的策略来解决。我像是烹饪大师一样，根据食材（环境）的不同，烹饪出最适合的解决菜肴（方案）。</p><p><strong>对于无并发环境</strong>：</p><ol><li><p>先更新数据库后删除缓存：</p><ul><li>问题：如果删除缓存失败，可能导致缓存一直是旧值。</li><li>解决办法：当删除缓存失败时，可以通过重试、加入重试队列或者使用事务来保证删除缓存的操作能够最终完成。这就像我们炒菜时，如果发现火候不够，我们会重新加热锅，保证菜肴的口感烹饪出来。</li></ul></li><li><p>先删除缓存后更新数据库:</p><ul><li>问题：如果更新数据库失败，可能会把旧值填充到缓存。</li><li>解决办法：当更新数据库失败时，也可以通过重试、加入重试队列或者事务来保证数据能够最终更新。这就像我们烹饪时，如果原料不新鲜，我们需要替换新的原料，保证出品的菜品的口感。</li></ul></li></ol><p><strong>对于有并发环境</strong>：</p><ol><li><p>先删除缓存后更新数据库：</p><ul><li>解决办法：延迟双删策略和加锁。这就像我们做菜时，要注意烹饪顺序和协同工作，先热锅，再下油，防止食材被坏掉，而如果我们有一个助手，我们需要保证我们两个不会同时操作同一个步骤造成混乱。</li></ul></li><li><p>先更新数据库后删除缓存：</p><ul><li>问题：B 线程在 A 线程删除缓存后的这段时间里会使用旧值。</li><li>解决办法：加锁；或者如果业务可以接受短暂的数据不一致性，那么可以无需采取额外操作。编程的时候往往是这样，我们要根据实际业务需求去选择最合适的解决方案，有时候，业务可以接受短时间的数据不一致，就像我们做菜，有时候火候稍微过了一点儿，对最终的菜品口感影响不大，我们就无需太过纠结。</li></ul></li></ol><p>对于这个问题的深入理解与实践经验，能让你在编程的道路上更上一层楼。谢谢你的提问，希望对你有所帮助，并期待你的进一步提问！ <img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221406253.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221406057.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221407322.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221407710.png" alt="image.png"></p><h2 id="分布式锁" tabindex="-1">分布式锁 <a class="header-anchor" href="#分布式锁" aria-label="Permalink to &quot;分布式锁&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221408136.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221409590.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221409165.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221410581.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221410953.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221411899.png" alt="image.png"></p><h2 id="redis-性能优化" tabindex="-1">redis 性能优化 <a class="header-anchor" href="#redis-性能优化" aria-label="Permalink to &quot;redis 性能优化&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221411263.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221411141.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221412767.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221412462.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221413879.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221413856.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221414106.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221414453.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221414825.png" alt="image.png"></p><h2 id="acid-特性" tabindex="-1">acid 特性 <a class="header-anchor" href="#acid-特性" aria-label="Permalink to &quot;acid 特性&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221414141.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221415200.png" alt="image.png"></p><h2 id="哨兵" tabindex="-1">哨兵 <a class="header-anchor" href="#哨兵" aria-label="Permalink to &quot;哨兵&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221415401.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221416559.png" alt="image.png"></p>',103),o=[n];function e(l,r,p,c,h,u){return t(),i("div",null,o)}const b=s(g,[["render",e]]);export{d as __pageData,b as default};