import{_ as a,o as e,c as r,R as l}from"./chunks/framework.7FlijoJG.js";const f=JSON.parse('{"title":"一、分布式锁","description":"","frontmatter":{},"headers":[],"relativePath":"系统设计/分布式系统.md","filePath":"系统设计/分布式系统.md","lastUpdated":1711296414000}'),i={name:"系统设计/分布式系统.md"},o=l('<ul><li><a href="#一分布式锁">一、分布式锁</a><ul><li><a href="#数据库的唯一索引">数据库的唯一索引</a></li><li><a href="#redis-的-setnx-指令">Redis 的 SETNX 指令</a></li><li><a href="#redis-的-redlock-算法">Redis 的 RedLock 算法</a></li><li><a href="#zookeeper-的有序节点">Zookeeper 的有序节点</a></li></ul></li><li><a href="#二分布式事务">二、分布式事务</a><ul><li><a href="#2pc">2PC</a></li><li><a href="#本地消息表">本地消息表</a></li></ul></li><li><a href="#三cap">三、CAP</a><ul><li><a href="#一致性">一致性</a></li><li><a href="#可用性">可用性</a></li><li><a href="#分区容忍性">分区容忍性</a></li><li><a href="#权衡">权衡</a></li></ul></li><li><a href="#四base">四、BASE</a><ul><li><a href="#基本可用">基本可用</a></li><li><a href="#软状态">软状态</a></li><li><a href="#最终一致性">最终一致性</a></li></ul></li><li><a href="#五paxos">五、Paxos</a><ul><li><a href="#执行过程">执行过程</a></li><li><a href="#约束条件">约束条件</a></li></ul></li><li><a href="#六raft">六、Raft</a><ul><li><a href="#单个-candidate-的竞选">单个 Candidate 的竞选</a></li><li><a href="#多个-candidate-竞选">多个 Candidate 竞选</a></li><li><a href="#数据同步">数据同步</a></li></ul></li><li><a href="#参考">参考</a></li></ul><h1 id="一、分布式锁" tabindex="-1">一、分布式锁 <a class="header-anchor" href="#一、分布式锁" aria-label="Permalink to &quot;一、分布式锁&quot;">​</a></h1><p>在单机场景下，可以使用语言的内置锁来实现进程同步。但是在分布式场景下，需要同步的进程可能位于不同的节点上，那么就需要使用分布式锁。</p><p>阻塞锁通常使用互斥量来实现：</p><ul><li>互斥量为 0 表示有其它进程在使用锁，此时处于锁定状态；</li><li>互斥量为 1 表示未锁定状态。</li></ul><p>1 和 0 可以用一个整型值表示，也可以用某个数据是否存在表示。</p><h2 id="数据库的唯一索引" tabindex="-1">数据库的唯一索引 <a class="header-anchor" href="#数据库的唯一索引" aria-label="Permalink to &quot;数据库的唯一索引&quot;">​</a></h2><p>获得锁时向表中插入一条记录，释放锁时删除这条记录。唯一索引可以保证该记录只被插入一次，那么就可以用这个记录是否存在来判断是否存于锁定状态。</p><p>存在以下几个问题：</p><ul><li>锁没有失效时间，解锁失败的话其它进程无法再获得该锁。</li><li>只能是非阻塞锁，插入失败直接就报错了，无法重试。</li><li>不可重入，已经获得锁的进程也必须重新获取锁。</li></ul><h2 id="redis-的-setnx-指令" tabindex="-1">Redis 的 SETNX 指令 <a class="header-anchor" href="#redis-的-setnx-指令" aria-label="Permalink to &quot;Redis 的 SETNX 指令&quot;">​</a></h2><p>使用 SETNX（set if not exist）指令插入一个键值对，如果 Key 已经存在，那么会返回 False，否则插入成功并返回 True。</p><p>SETNX 指令和数据库的唯一索引类似，保证了只存在一个 Key 的键值对，那么可以用一个 Key 的键值对是否存在来判断是否存于锁定状态。</p><p>EXPIRE 指令可以为一个键值对设置一个过期时间，从而避免了数据库唯一索引实现方式中释放锁失败的问题。</p><h2 id="redis-的-redlock-算法" tabindex="-1">Redis 的 RedLock 算法 <a class="header-anchor" href="#redis-的-redlock-算法" aria-label="Permalink to &quot;Redis 的 RedLock 算法&quot;">​</a></h2><p>使用了多个 Redis 实例来实现分布式锁，这是为了保证在发生单点故障时仍然可用。</p><ul><li>尝试从 N 个互相独立 Redis 实例获取锁；</li><li>计算获取锁消耗的时间，只有当这个时间小于锁的过期时间，并且从大多数（N / 2 + 1）实例上获取了锁，那么就认为锁获取成功了；</li><li>如果锁获取失败，就到每个实例上释放锁。</li></ul><h2 id="zookeeper-的有序节点" tabindex="-1">Zookeeper 的有序节点 <a class="header-anchor" href="#zookeeper-的有序节点" aria-label="Permalink to &quot;Zookeeper 的有序节点&quot;">​</a></h2><h3 id="_1-zookeeper-抽象模型" tabindex="-1">1. Zookeeper 抽象模型 <a class="header-anchor" href="#_1-zookeeper-抽象模型" aria-label="Permalink to &quot;1. Zookeeper 抽象模型&quot;">​</a></h3><p>Zookeeper 提供了一种树形结构的命名空间，/app1/p_1 节点的父节点为 /app1。</p><h3 id="_2-节点类型" tabindex="-1">2. 节点类型 <a class="header-anchor" href="#_2-节点类型" aria-label="Permalink to &quot;2. 节点类型&quot;">​</a></h3><ul><li>永久节点：不会因为会话结束或者超时而消失；</li><li>临时节点：如果会话结束或者超时就会消失；</li><li>有序节点：会在节点名的后面加一个数字后缀，并且是有序的，例如生成的有序节点为 /lock/node-0000000000，它的下一个有序节点则为 /lock/node-0000000001，以此类推。</li></ul><h3 id="_3-监听器" tabindex="-1">3. 监听器 <a class="header-anchor" href="#_3-监听器" aria-label="Permalink to &quot;3. 监听器&quot;">​</a></h3><p>为一个节点注册监听器，在节点状态发生改变时，会给客户端发送消息。</p><h3 id="_4-分布式锁实现" tabindex="-1">4. 分布式锁实现 <a class="header-anchor" href="#_4-分布式锁实现" aria-label="Permalink to &quot;4. 分布式锁实现&quot;">​</a></h3><ul><li>创建一个锁目录 /lock；</li><li>当一个客户端需要获取锁时，在 /lock 下创建临时的且有序的子节点；</li><li>客户端获取 /lock 下的子节点列表，判断自己创建的子节点是否为当前子节点列表中序号最小的子节点，如果是则认为获得锁；否则监听自己的前一个子节点，获得子节点的变更通知后重复此步骤直至获得锁；</li><li>执行业务代码，完成后，删除对应的子节点。</li></ul><h3 id="_5-会话超时" tabindex="-1">5. 会话超时 <a class="header-anchor" href="#_5-会话超时" aria-label="Permalink to &quot;5. 会话超时&quot;">​</a></h3><p>如果一个已经获得锁的会话超时了，因为创建的是临时节点，所以该会话对应的临时节点会被删除，其它会话就可以获得锁了。可以看到，Zookeeper 分布式锁不会出现数据库的唯一索引实现的分布式锁释放锁失败问题。</p><h3 id="_6-羊群效应" tabindex="-1">6. 羊群效应 <a class="header-anchor" href="#_6-羊群效应" aria-label="Permalink to &quot;6. 羊群效应&quot;">​</a></h3><p>一个节点未获得锁，只需要监听自己的前一个子节点，这是因为如果监听所有的子节点，那么任意一个子节点状态改变，其它所有子节点都会收到通知（羊群效应），而我们只希望它的后一个子节点收到通知。</p><h1 id="二、分布式事务" tabindex="-1">二、分布式事务 <a class="header-anchor" href="#二、分布式事务" aria-label="Permalink to &quot;二、分布式事务&quot;">​</a></h1><p>指事务的操作位于不同的节点上，需要保证事务的 ACID 特性。</p><p>例如在下单场景下，库存和订单如果不在同一个节点上，就涉及分布式事务。</p><h2 id="_2pc" tabindex="-1">2PC <a class="header-anchor" href="#_2pc" aria-label="Permalink to &quot;2PC&quot;">​</a></h2><p>两阶段提交（Two-phase Commit，2PC），通过引入协调者（Coordinator）来协调参与者的行为，并最终决定这些参与者是否要真正执行事务。</p><h3 id="_1-运行过程" tabindex="-1">1. 运行过程 <a class="header-anchor" href="#_1-运行过程" aria-label="Permalink to &quot;1. 运行过程&quot;">​</a></h3><h4 id="_1-1-准备阶段" tabindex="-1">1.1 准备阶段 <a class="header-anchor" href="#_1-1-准备阶段" aria-label="Permalink to &quot;1.1 准备阶段&quot;">​</a></h4><p>协调者询问参与者事务是否执行成功，参与者发回事务执行结果。</p><h4 id="_1-2-提交阶段" tabindex="-1">1.2 提交阶段 <a class="header-anchor" href="#_1-2-提交阶段" aria-label="Permalink to &quot;1.2 提交阶段&quot;">​</a></h4><p>如果事务在每个参与者上都执行成功，事务协调者发送通知让参与者提交事务；否则，协调者发送通知让参与者回滚事务。</p><p>需要注意的是，在准备阶段，参与者执行了事务，但是还未提交。只有在提交阶段接收到协调者发来的通知后，才进行提交或者回滚。</p><h3 id="_2-存在的问题" tabindex="-1">2. 存在的问题 <a class="header-anchor" href="#_2-存在的问题" aria-label="Permalink to &quot;2. 存在的问题&quot;">​</a></h3><h4 id="_2-1-同步阻塞" tabindex="-1">2.1 同步阻塞 <a class="header-anchor" href="#_2-1-同步阻塞" aria-label="Permalink to &quot;2.1 同步阻塞&quot;">​</a></h4><p>所有事务参与者在等待其它参与者响应的时候都处于同步阻塞状态，无法进行其它操作。</p><h4 id="_2-2-单点问题" tabindex="-1">2.2 单点问题 <a class="header-anchor" href="#_2-2-单点问题" aria-label="Permalink to &quot;2.2 单点问题&quot;">​</a></h4><p>协调者在 2PC 中起到非常大的作用，发生故障将会造成很大影响。特别是在阶段二发生故障，所有参与者会一直等待，无法完成其它操作。</p><h4 id="_2-3-数据不一致" tabindex="-1">2.3 数据不一致 <a class="header-anchor" href="#_2-3-数据不一致" aria-label="Permalink to &quot;2.3 数据不一致&quot;">​</a></h4><p>在阶段二，如果协调者只发送了部分 Commit 消息，此时网络发生异常，那么只有部分参与者接收到 Commit 消息，也就是说只有部分参与者提交了事务，使得系统数据不一致。</p><h4 id="_2-4-太过保守" tabindex="-1">2.4 太过保守 <a class="header-anchor" href="#_2-4-太过保守" aria-label="Permalink to &quot;2.4 太过保守&quot;">​</a></h4><p>任意一个节点失败就会导致整个事务失败，没有完善的容错机制。</p><h2 id="本地消息表" tabindex="-1">本地消息表 <a class="header-anchor" href="#本地消息表" aria-label="Permalink to &quot;本地消息表&quot;">​</a></h2><p>本地消息表与业务数据表处于同一个数据库中，这样就能利用本地事务来保证在对这两个表的操作满足事务特性，并且使用了消息队列来保证最终一致性。</p><ol><li>在分布式事务操作的一方完成写业务数据的操作之后向本地消息表发送一个消息，本地事务能保证这个消息一定会被写入本地消息表中。</li><li>之后将本地消息表中的消息转发到消息队列中，如果转发成功则将消息从本地消息表中删除，否则继续重新转发。</li><li>在分布式事务操作的另一方从消息队列中读取一个消息，并执行消息中的操作。</li></ol><h1 id="三、cap" tabindex="-1">三、CAP <a class="header-anchor" href="#三、cap" aria-label="Permalink to &quot;三、CAP&quot;">​</a></h1><p>分布式系统不可能同时满足一致性（C：Consistency）、可用性（A：Availability）和分区容忍性（P：Partition Tolerance），最多只能同时满足其中两项。</p><h2 id="一致性" tabindex="-1">一致性 <a class="header-anchor" href="#一致性" aria-label="Permalink to &quot;一致性&quot;">​</a></h2><p>一致性指的是多个数据副本是否能保持一致的特性，在一致性的条件下，系统在执行数据更新操作之后能够从一致性状态转移到另一个一致性状态。</p><p>对系统的一个数据更新成功之后，如果所有用户都能够读取到最新的值，该系统就被认为具有强一致性。</p><h2 id="可用性" tabindex="-1">可用性 <a class="header-anchor" href="#可用性" aria-label="Permalink to &quot;可用性&quot;">​</a></h2><p>可用性指分布式系统在面对各种异常时可以提供正常服务的能力，可以用系统可用时间占总时间的比值来衡量，4 个 9 的可用性表示系统 99.99% 的时间是可用的。</p><p>在可用性条件下，要求系统提供的服务一直处于可用的状态，对于用户的每一个操作请求总是能够在有限的时间内返回结果。</p><h2 id="分区容忍性" tabindex="-1">分区容忍性 <a class="header-anchor" href="#分区容忍性" aria-label="Permalink to &quot;分区容忍性&quot;">​</a></h2><p>网络分区指分布式系统中的节点被划分为多个区域，每个区域内部可以通信，但是区域之间无法通信。</p><p>在分区容忍性条件下，分布式系统在遇到任何网络分区故障的时候，仍然需要能对外提供一致性和可用性的服务，除非是整个网络环境都发生了故障。</p><h2 id="权衡" tabindex="-1">权衡 <a class="header-anchor" href="#权衡" aria-label="Permalink to &quot;权衡&quot;">​</a></h2><p>在分布式系统中，分区容忍性必不可少，因为需要总是假设网络是不可靠的。因此，CAP 理论实际上是要在可用性和一致性之间做权衡。</p><p>可用性和一致性往往是冲突的，很难使它们同时满足。在多个节点之间进行数据同步时，</p><ul><li>为了保证一致性（CP），不能访问未同步完成的节点，也就失去了部分可用性；</li><li>为了保证可用性（AP），允许读取所有节点的数据，但是数据可能不一致。</li></ul><h1 id="四、base" tabindex="-1">四、BASE <a class="header-anchor" href="#四、base" aria-label="Permalink to &quot;四、BASE&quot;">​</a></h1><p>BASE 是基本可用（Basically Available）、软状态（Soft State）和最终一致性（Eventually Consistent）三个短语的缩写。</p><p>BASE 理论是对 CAP 中一致性和可用性权衡的结果，它的核心思想是：即使无法做到强一致性，但每个应用都可以根据自身业务特点，采用适当的方式来使系统达到最终一致性。</p><h2 id="基本可用" tabindex="-1">基本可用 <a class="header-anchor" href="#基本可用" aria-label="Permalink to &quot;基本可用&quot;">​</a></h2><p>指分布式系统在出现故障的时候，保证核心可用，允许损失部分可用性。</p><p>例如，电商在做促销时，为了保证购物系统的稳定性，部分消费者可能会被引导到一个降级的页面。</p><h2 id="软状态" tabindex="-1">软状态 <a class="header-anchor" href="#软状态" aria-label="Permalink to &quot;软状态&quot;">​</a></h2><p>指允许系统中的数据存在中间状态，并认为该中间状态不会影响系统整体可用性，即允许系统不同节点的数据副本之间进行同步的过程存在时延。</p><h2 id="最终一致性" tabindex="-1">最终一致性 <a class="header-anchor" href="#最终一致性" aria-label="Permalink to &quot;最终一致性&quot;">​</a></h2><p>最终一致性强调的是系统中所有的数据副本，在经过一段时间的同步后，最终能达到一致的状态。</p><p>ACID 要求强一致性，通常运用在传统的数据库系统上。而 BASE 要求最终一致性，通过牺牲强一致性来达到可用性，通常运用在大型分布式系统中。</p><p>在实际的分布式场景中，不同业务单元和组件对一致性的要求是不同的，因此 ACID 和 BASE 往往会结合在一起使用。</p><h1 id="五、paxos" tabindex="-1">五、Paxos <a class="header-anchor" href="#五、paxos" aria-label="Permalink to &quot;五、Paxos&quot;">​</a></h1><p>用于达成共识性问题，即对多个节点产生的值，该算法能保证只选出唯一一个值。</p><p>主要有三类节点：</p><ul><li>提议者（Proposer）：提议一个值；</li><li>接受者（Acceptor）：对每个提议进行投票；</li><li>告知者（Learner）：被告知投票的结果，不参与投票过程。</li></ul><h2 id="执行过程" tabindex="-1">执行过程 <a class="header-anchor" href="#执行过程" aria-label="Permalink to &quot;执行过程&quot;">​</a></h2><p>规定一个提议包含两个字段：[n, v]，其中 n 为序号（具有唯一性），v 为提议值。</p><h3 id="_1-prepare-阶段" tabindex="-1">1. Prepare 阶段 <a class="header-anchor" href="#_1-prepare-阶段" aria-label="Permalink to &quot;1. Prepare 阶段&quot;">​</a></h3><p>下图演示了两个 Proposer 和三个 Acceptor 的系统中运行该算法的初始过程，每个 Proposer 都会向所有 Acceptor 发送 Prepare 请求。</p><p>当 Acceptor 接收到一个 Prepare 请求，包含的提议为 [n1, v1]，并且之前还未接收过 Prepare 请求，那么发送一个 Prepare 响应，设置当前接收到的提议为 [n1, v1]，并且保证以后不会再接受序号小于 n1 的提议。</p><p>如下图，Acceptor X 在收到 [n=2, v=8] 的 Prepare 请求时，由于之前没有接收过提议，因此就发送一个 [no previous] 的 Prepare 响应，设置当前接收到的提议为 [n=2, v=8]，并且保证以后不会再接受序号小于 2 的提议。其它的 Acceptor 类似。</p><p>如果 Acceptor 接收到一个 Prepare 请求，包含的提议为 [n2, v2]，并且之前已经接收过提议 [n1, v1]。如果 n1 &gt; n2，那么就丢弃该提议请求；否则，发送 Prepare 响应，该 Prepare 响应包含之前已经接收过的提议 [n1, v1]，设置当前接收到的提议为 [n2, v2]，并且保证以后不会再接受序号小于 n2 的提议。</p><p>如下图，Acceptor Z 收到 Proposer A 发来的 [n=2, v=8] 的 Prepare 请求，由于之前已经接收过 [n=4, v=5] 的提议，并且 n &gt; 2，因此就抛弃该提议请求；Acceptor X 收到 Proposer B 发来的 [n=4, v=5] 的 Prepare 请求，因为之前接收到的提议为 [n=2, v=8]，并且 2 &lt;= 4，因此就发送 [n=2, v=8] 的 Prepare 响应，设置当前接收到的提议为 [n=4, v=5]，并且保证以后不会再接受序号小于 4 的提议。Acceptor Y 类似。</p><h3 id="_2-accept-阶段" tabindex="-1">2. Accept 阶段 <a class="header-anchor" href="#_2-accept-阶段" aria-label="Permalink to &quot;2. Accept 阶段&quot;">​</a></h3><p>当一个 Proposer 接收到超过一半 Acceptor 的 Prepare 响应时，就可以发送 Accept 请求。</p><p>Proposer A 接收到两个 Prepare 响应之后，就发送 [n=2, v=8] Accept 请求。该 Accept 请求会被所有 Acceptor 丢弃，因为此时所有 Acceptor 都保证不接受序号小于 4 的提议。</p><p>Proposer B 过后也收到了两个 Prepare 响应，因此也开始发送 Accept 请求。需要注意的是，Accept 请求的 v 需要取它收到的最大提议编号对应的 v 值，也就是 8。因此它发送 [n=4, v=8] 的 Accept 请求。</p><h3 id="_3-learn-阶段" tabindex="-1">3. Learn 阶段 <a class="header-anchor" href="#_3-learn-阶段" aria-label="Permalink to &quot;3. Learn 阶段&quot;">​</a></h3><p>Acceptor 接收到 Accept 请求时，如果序号大于等于该 Acceptor 承诺的最小序号，那么就发送 Learn 提议给所有的 Learner。当 Learner 发现有大多数的 Acceptor 接收了某个提议，那么该提议的提议值就被 Paxos 选择出来。</p><h2 id="约束条件" tabindex="-1">约束条件 <a class="header-anchor" href="#约束条件" aria-label="Permalink to &quot;约束条件&quot;">​</a></h2><h3 id="_1-正确性" tabindex="-1">1. 正确性 <a class="header-anchor" href="#_1-正确性" aria-label="Permalink to &quot;1\\. 正确性&quot;">​</a></h3><p>指只有一个提议值会生效。</p><p>因为 Paxos 协议要求每个生效的提议被多数 Acceptor 接收，并且 Acceptor 不会接受两个不同的提议，因此可以保证正确性。</p><h3 id="_2-可终止性" tabindex="-1">2. 可终止性 <a class="header-anchor" href="#_2-可终止性" aria-label="Permalink to &quot;2\\. 可终止性&quot;">​</a></h3><p>指最后总会有一个提议生效。</p><p>Paxos 协议能够让 Proposer 发送的提议朝着能被大多数 Acceptor 接受的那个提议靠拢，因此能够保证可终止性。</p><h1 id="六、raft" tabindex="-1">六、Raft <a class="header-anchor" href="#六、raft" aria-label="Permalink to &quot;六、Raft&quot;">​</a></h1><p>Raft 也是分布式一致性协议，主要是用来竞选主节点。</p><h2 id="单个-candidate-的竞选" tabindex="-1">单个 Candidate 的竞选 <a class="header-anchor" href="#单个-candidate-的竞选" aria-label="Permalink to &quot;单个 Candidate 的竞选&quot;">​</a></h2><p>有三种节点：Follower、Candidate 和 Leader。Leader 会周期性的发送心跳包给 Follower。每个 Follower 都设置了一个随机的竞选超时时间，一般为 150ms~300ms，如果在这个时间内没有收到 Leader 的心跳包，就会变成 Candidate，进入竞选阶段。</p><ul><li><p>下图展示一个分布式系统的最初阶段，此时只有 Follower 没有 Leader。Node A 等待一个随机的竞选超时时间之后，没收到 Leader 发来的心跳包，因此进入竞选阶段。</p></li><li><p>此时 Node A 发送投票请求给其它所有节点。</p></li><li><p>其它节点会对请求进行回复，如果超过一半的节点回复了，那么该 Candidate 就会变成 Leader。</p></li><li><p>之后 Leader 会周期性地发送心跳包给 Follower，Follower 接收到心跳包，会重新开始计时。</p></li></ul><h2 id="多个-candidate-竞选" tabindex="-1">多个 Candidate 竞选 <a class="header-anchor" href="#多个-candidate-竞选" aria-label="Permalink to &quot;多个 Candidate 竞选&quot;">​</a></h2><ul><li><p>如果有多个 Follower 成为 Candidate，并且所获得票数相同，那么就需要重新开始投票。例如下图中 Node B 和 Node D 都获得两票，需要重新开始投票。</p></li><li><p>由于每个节点设置的随机竞选超时时间不同，因此下一次再次出现多个 Candidate 并获得同样票数的概率很低。</p></li></ul><h2 id="数据同步" tabindex="-1">数据同步 <a class="header-anchor" href="#数据同步" aria-label="Permalink to &quot;数据同步&quot;">​</a></h2><ul><li><p>来自客户端的修改都会被传入 Leader。注意该修改还未被提交，只是写入日志中。</p></li><li><p>Leader 会把修改复制到所有 Follower。</p></li><li><p>Leader 会等待大多数的 Follower 也进行了修改，然后才将修改提交。</p></li><li><p>此时 Leader 会通知的所有 Follower 让它们也提交修改，此时所有节点的值达成一致。</p></li></ul><h1 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h1><ul><li>倪超. 从 Paxos 到 ZooKeeper : 分布式一致性原理与实践 [M]. 电子工业出版社, 2015.</li><li><a href="https://redis.io/tohttps://docsify-1258928558.cos.ap-guangzhou.myqcloud.com/distribution/distlock" target="_blank" rel="noreferrer">Distributed locks with Redis</a></li><li><a href="http://www.linkedkeeper.com/detail/blog.action?bid=1023" target="_blank" rel="noreferrer">浅谈分布式锁</a></li><li><a href="http://www.dengshenyu.com/java/%E5%88%86%E5%B8%83%E5%BC%8F%E7%B3%BB%E7%BB%9F/2017/10/23/zookeeper-distributed-lock.html" target="_blank" rel="noreferrer">基于 Zookeeper 的分布式锁</a></li><li><a href="http://thesecretlivesofdata.com/raft" target="_blank" rel="noreferrer">Raft: Understandable Distributed Consensus</a></li><li><a href="https://www.cnblogs.com/savorboard/p/distributed-system-transaction-consistency.html" target="_blank" rel="noreferrer">聊聊分布式事务，再说说解决方案</a></li><li><a href="https://coolshell.cn/articles/10910.html" target="_blank" rel="noreferrer">分布式系统的事务处理</a></li><li><a href="https://juejin.im/entry/577c6f220a2b5800573492be" target="_blank" rel="noreferrer">深入理解分布式事务</a></li><li><a href="http://www.colooshiki.com/index.php/2017/04/20/what-is-cap-theorem-in-distributed-database-system/" target="_blank" rel="noreferrer">What is CAP theorem in distributed database system?</a></li><li><a href="http://harry.me/blog/2014/12/27/neat-algorithms-paxos/" target="_blank" rel="noreferrer">NEAT ALGORITHMS - PAXOS</a></li><li><a href="https://angus.nyc/2012/paxos-by-example/" target="_blank" rel="noreferrer">Paxos By Example</a></li></ul>',116),t=[o];function h(p,n,d,c,s,u){return e(),r("div",null,t)}const P=a(i,[["render",h]]);export{f as __pageData,P as default};
