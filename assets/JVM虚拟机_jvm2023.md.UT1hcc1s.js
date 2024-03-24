import{_ as o,o as a,c as t,R as r}from"./chunks/framework.7FlijoJG.js";const q=JSON.parse('{"title":"jvm","description":"","frontmatter":{"title":"jvm","date":"2023-12-22T14:36:27.000Z","tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"JVM虚拟机/jvm2023.md","filePath":"JVM虚拟机/jvm2023.md","lastUpdated":1711296414000}'),l={name:"JVM虚拟机/jvm2023.md"},e=r('<h2 id="jvm" tabindex="-1">JVM <a class="header-anchor" href="#jvm" aria-label="Permalink to &quot;JVM&quot;">​</a></h2><p>JVM，也就是 Java 虚拟机，可以说是 Java 程序的执行引擎。它负责将 Java 源代码编译成能在特定平台上运行的字节码，这样就能在不同的设备上无缝运行。</p><p>JVM 也有自己的内存管理系统，负责内存的分配和回收，确保程序运行的高效性和稳定性。</p><p>简单来说，JVM 就像是 Java 程序和计算机硬件之间的桥梁，让 Java 代码能够在各种环境中运行。</p><h2 id="jvm、jre、jdk-分别是什么关系" tabindex="-1">JVM、JRE、JDK 分别是什么关系？ <a class="header-anchor" href="#jvm、jre、jdk-分别是什么关系" aria-label="Permalink to &quot;JVM、JRE、JDK 分别是什么关系？&quot;">​</a></h2><p>JVM 是 Java 虚拟机，是 Java 程序的执行引擎； JRE 是 Java 运行时环境，包含了 JVM 和 Java 程序运行所需的核心类库；而 JDK 则是 Java 开发工具包，里面集成了 JRE，也包含了开发 Java 程序所需的编译器、调试器等开发工具。</p><p>想象成房子吧，JVM 就是房子的框架，JRE 是房子的基础和结构，而 JDK 则是整个房子，包括了框架、基础和装修。</p><p>在开发 Java 程序时，需要 JDK 来编写代码、编译和运行程序； 而在运行 Java 程序时，只需要 JRE，因为它包含了程序运行所需的环境和库。</p><h2 id="jvm-的内存模型" tabindex="-1">JVM 的内存模型 <a class="header-anchor" href="#jvm-的内存模型" aria-label="Permalink to &quot;JVM 的内存模型&quot;">​</a></h2><p>JVM 的内存模型描述了在运行 Java 程序时，JVM 如何组织和管理内存。它包括了不同的内存区域，每个区域都有自己的作用和特点。</p><h3 id="_1-内存模型的内容和作用" tabindex="-1">1. 内存模型的内容和作用 <a class="header-anchor" href="#_1-内存模型的内容和作用" aria-label="Permalink to &quot;1. 内存模型的内容和作用&quot;">​</a></h3><ul><li><strong>方法区（Method Area）</strong>：用来存储类结构信息、常量、静态变量等。在 Java 8 之前，这里还有永久代（PermGen），但在 Java 8 后被元空间（Metaspace）所取代。</li><li><strong>堆（Heap）</strong>：存放对象实例，是被所有线程共享的内存区域。通过垃圾回收来管理，主要分为新生代（Young Generation）和老年代（Old Generation）等不同区域。</li><li><strong>栈（Stack）</strong>：每个线程都有自己的栈，存储局部变量、方法调用、部分结果等。栈分为<strong>虚拟机栈</strong>和<strong>本地方法栈</strong>。虚拟机栈用于存储方法调用和局部变量，而本地方法栈是针对 Native 方法服务的。</li><li><strong>程序计数器（Program Counter Register）</strong>：存储当前线程执行的字节码指令地址，也就是当前线程所执行的位置。</li></ul><h3 id="_2-两种栈" tabindex="-1">2. 两种栈 <a class="header-anchor" href="#_2-两种栈" aria-label="Permalink to &quot;2. 两种栈&quot;">​</a></h3><ul><li><strong>虚拟机栈（Java Virtual Machine Stack）</strong>：用于存储方法执行过程中的局部变量、操作数栈、动态链接、方法出口等信息。</li><li><strong>本地方法栈（Native Method Stack）</strong>：与虚拟机栈类似，但是服务于 Native 方法。</li></ul><h3 id="_3-堆和栈的区别" tabindex="-1">3. 堆和栈的区别 <a class="header-anchor" href="#_3-堆和栈的区别" aria-label="Permalink to &quot;3. 堆和栈的区别&quot;">​</a></h3><ul><li><strong>堆</strong>是用于存放对象实例的区域，通过垃圾回收机制进行管理，是所有线程共享的内存区域。</li><li><strong>栈</strong>是为每个线程分配的内存区域，用于存放线程私有的局部变量、方法调用等信息。</li></ul><h3 id="_4-1-6-到-1-8-的区域变化" tabindex="-1">4. 1.6 到 1.8 的区域变化 <a class="header-anchor" href="#_4-1-6-到-1-8-的区域变化" aria-label="Permalink to &quot;4. 1.6 到 1.8 的区域变化&quot;">​</a></h3><p>在 Java 1.6 到 1.8 中，最大的变化是元空间（Metaspace）取代了永久代（PermGen）。永久代存放类的元数据信息、字符串常量池等，在大量使用动态生成类的场景下容易出现 PermGen Space 内存溢出。元空间使用的是本地内存，解决了永久代的一些限制，但需要注意控制元空间的大小，以防止系统内存被耗尽。</p><h2 id="内存的两种分配方式-以及如何保证分配内存是线程安全" tabindex="-1">内存的两种分配方式，以及如何保证分配内存是线程安全 <a class="header-anchor" href="#内存的两种分配方式-以及如何保证分配内存是线程安全" aria-label="Permalink to &quot;内存的两种分配方式，以及如何保证分配内存是线程安全&quot;">​</a></h2><p>在内存管理中，有两种主要的分配方式：指针碰撞（Bump Pointer）和空闲列表（Free List）。</p><ol><li><strong>指针碰撞（Bump Pointer）</strong>：在内存中，堆空间被划分为已使用和未使用的部分。当使用指针碰撞方式时，内存中有一个指针（称为“分配指针”），用于标记未使用内存的起始位置。当需要分配内存时，JVM 通过移动这个分配指针来分配内存，把分配指针后移相应大小的空间，指向分配后的内存起始位置。这种方式要求堆内存空间的分配是连续的，因为分配指针需要持续移动。</li><li><strong>空闲列表（Free List）</strong>：与指针碰撞不同，空闲列表方式不要求内存空间必须是连续的。它将空闲的内存空间以链表的形式组织起来，记录每块内存的大小和是否可用。当需要分配内存时，JVM 会在空闲列表中寻找合适大小的空闲块，然后标记为已分配。当内存释放时，将被释放的内存块加入到空闲列表中，以便后续分配使用。</li></ol><p>为了保证内存分配的线程安全性，通常采取以下策略：</p><ul><li><strong>线程封闭（Thread Confinement）</strong>：每个线程分配独立的内存区域，避免多线程之间的竞争。</li><li><strong>加锁（Locking）</strong>：使用锁机制来保证在分配或释放内存时只有一个线程可以操作，保证操作的原子性和互斥性。</li><li><strong>CAS（Compare and Swap）</strong>：使用 CAS 操作确保对内存的原子性操作，避免并发冲突。</li><li><strong>空闲列表的并发处理</strong>：在多线程环境中，对空闲列表的操作需要考虑并发性，使用适当的同步机制来保证线程安全。</li></ul><p>这些方法可以帮助确保内存分配的线程安全性，以防止不同线程之间出现竞争条件或数据不一致的情况。</p><hr><p>当我们写程序时，计算机需要地方来存储数据。就像是一个房子要安置家具一样，计算机要存放程序需要的数据。有两种主要的方式来安排这个存储空间：</p><ol><li><strong>指针碰撞（Bump Pointer）</strong>：就像是有一块空地，我们用一个箭头指着可以放家具的地方。每当需要放一个新的东西，箭头就会指向下一个空地，这样就能一个一个地放进去。</li><li><strong>空闲列表（Free List）</strong>：这个方式像是一张列表，上面记录了哪些地方有空地可放家具。当需要放东西时，就找到列表上一个空地，然后把东西放进去，同时在列表上做标记说这个地方已经有东西了。</li></ol><p>为了确保多个人同时放东西不乱套，我们有几个办法：</p><ul><li><strong>每个人有自己的地盘</strong>：就像是每个人有自己的房间一样，不会和别人抢一个地方放东西。</li><li><strong>有人指挥大家放东西</strong>：就像有一个管理者，大家想放东西的时候得先问问他，这样不会乱成一团。</li><li><strong>大家轮流来放东西</strong>：每次只有一个人能放东西，其他人得等着，这样不会同时抢着放东西。</li></ul><p>这些方法保证了放置家具时不会出现混乱，每个家具都能被安排到合适的地方。就像是大家有规矩和秩序一样，保证了数据存储的顺利进行。</p><h2 id="类和对象加载" tabindex="-1">类和对象加载 <a class="header-anchor" href="#类和对象加载" aria-label="Permalink to &quot;类和对象加载&quot;">​</a></h2><h3 id="类加载和对象创建的关系" tabindex="-1">类加载和对象创建的关系 <a class="header-anchor" href="#类加载和对象创建的关系" aria-label="Permalink to &quot;类加载和对象创建的关系&quot;">​</a></h3><p>类加载和对象创建的关系，是个很奇妙的话题。我喜欢将类加载看作是建立蓝图，而创建对象就像使用这个蓝图建造房子。</p><p>首先，类加载器负责找到你的蓝图（也就是类的字节码文件），然后解析它，然后准备好相关的材料，最后生产出一份可以用来建造房子的蓝图。这个过程就是“加载”、“链接”和“初始化”。</p><p>然后，每当你实例化一个新对象（也就是 new 一个对象）时，Java 就会根据这个蓝图在内存中划出一块空间，再按照蓝图上的设计进行建造，也就是给这个对象的各个属性赋值，完成了你房子的建造，得到了一个新的对象。</p><h3 id="有几种类加载噐" tabindex="-1">有几种类加载噐 <a class="header-anchor" href="#有几种类加载噐" aria-label="Permalink to &quot;有几种类加载噐&quot;">​</a></h3><p>类加载器主要有以下几种：</p><ol><li>引导类加载器（Bootstrap）</li><li>扩展类加载器（Extension）</li><li>系统类加载器或应用类加载器（System 或 Application）</li><li>自定义类加载器（Custom）</li></ol><h3 id="类的加载过程" tabindex="-1">类的加载过程 <a class="header-anchor" href="#类的加载过程" aria-label="Permalink to &quot;类的加载过程&quot;">​</a></h3><p>加载类的过程包括：</p><ol><li><p>加载：找到并加载字节码文件，生成一个 Class 对象。</p></li><li><p>链接：包括验证、准备和解析</p><ul><li>验证确保类文件的正确性。</li><li>准备阶段为静态变量分配内存。</li><li>解析将符号引用替换为直接引用。</li></ul></li><li><p>初始化：为静态变量赋值并执行静态块。</p></li></ol><p>总的来说，类加载和对象创建就像是一场精心的建筑大赛，类加载器是设计师，负责设计并提供蓝图，然后在需要的时候根据蓝图建造出对象，就像一堆堆房子一样，并且用一种巧妙的方法保证了每个蓝图和房子加载的正确性和安全性。</p><h3 id="什么是双亲委派模式" tabindex="-1">什么是双亲委派模式 <a class="header-anchor" href="#什么是双亲委派模式" aria-label="Permalink to &quot;什么是双亲委派模式&quot;">​</a></h3><p>双亲委派模型是一种类加载机制：如果一个类加载器接受了一个加载类的请求，它会先将这个请求委托给父类加载器。这个过程一直向上递归，如果父类加载器可以完成类加载任务，就成功返回；否则，子类加载器尝试自己去加载。</p><h3 id="对象的创建方式" tabindex="-1">对象的创建方式 <a class="header-anchor" href="#对象的创建方式" aria-label="Permalink to &quot;对象的创建方式&quot;">​</a></h3><p>创建对象，就好像在烹饪一道美味的菜肴。你需要选好食材，研究做法，然后一步一步“炖烧”出来。</p><p>在 Java 中，创建对象主要有以下几种方式:</p><ol><li>使用<code>new</code>关键字：这是我们最常用的一种方式，<code>new</code>后面紧跟类的构造函数。</li><li>使用<code>clone</code>方法：这种方式是从一个已经存在的对象中创建一个一模一样的新对象。</li><li>使用反射<code>Class</code>类的<code>newInstance</code>方法：这种方式可以动态地创建对象。</li><li>使用<code>ObjectInputStream</code>类的<code>readObject</code>方法，即反序列化方式。</li></ol><h3 id="对象的构造过程" tabindex="-1">对象的构造过程 <a class="header-anchor" href="#对象的构造过程" aria-label="Permalink to &quot;对象的构造过程&quot;">​</a></h3><p>那么，对象的构造过程是食材烹饪的过程：首先，调用父类的构造函数，就像在准备食材。然后，初始化成员变量，就像在烹饪中炖烧。最后，在构造函数中做一些后续的处理，就像在炖烧后调整味道。</p><blockquote><p>对象的创建方式+对象的构造过程</p><p>判断类文件是否加载进来</p><p>对象生成：线程生成引用变量-＞堆内存开辟空间-&gt;元空间定义复制到内存空间-&gt;属性赋值、构造方法执行-&gt;堆引用交给线程</p></blockquote><h3 id="对象的内部构造" tabindex="-1">对象的内部构造 <a class="header-anchor" href="#对象的内部构造" aria-label="Permalink to &quot;对象的内部构造&quot;">​</a></h3><p>说到对象的内部构造，这就好比一道菜的内在风味。一个对象的内部主要由对象头、实例数据和对齐填充部分构成。</p><h3 id="对象头里面有什么" tabindex="-1">对象头里面有什么 <a class="header-anchor" href="#对象头里面有什么" aria-label="Permalink to &quot;对象头里面有什么&quot;">​</a></h3><p>对象头包含了对象的哈希码、GC 分代年龄、锁状态标志、线程持有的锁、偏向线程 ID、偏向时间戳等信息。实例数据则是我们定义的各种类型的字段内容。对齐填充部分不存在特定的数据，主要是为了满足某些内存对齐的需求。</p><h3 id="对象的两种访问方式" tabindex="-1">对象的两种访问方式 <a class="header-anchor" href="#对象的两种访问方式" aria-label="Permalink to &quot;对象的两种访问方式&quot;">​</a></h3><p>对象的访问方式，有两种：句柄访问和直接指针访问。</p><p>句柄访问就像我们请人代购食材，我们给这个人（句柄）食材的清单，这个人去仓库（堆内存）找到食材并交给我们。</p><p>而直接指针访问，则是我们直接拿着食材清单去仓库找到食材。</p><p>两种方式各有优缺点，但主要的区别在于是否需要找这个“代购”的人。</p><hr><p><strong>句柄访问：</strong><br> 优点：安全性高，如果你想要找到一道菜（一个对象），需要句柄（代理人）的帮忙，就像你需要找到那个掌管所有菜肴的厨师。即使你的菜肴位置发生变化（类似于 GC 的内存整理），句柄（代理人）仍能找到正确的位置，因为句柄和对象的链接始终不变。所以，句柄访问无需关心对象的地址变换，它永远保持与对象的连接。</p><p>缺点：访问速度慢，你得先找到这个厨师（句柄），然后再通过厨师找到你的菜肴（对象）。这就相当于你需要做两次跳转，首先找到句柄，再由句柄找到对象，这会比直接找到对象更慢一些。</p><p><strong>直接指针访问：</strong><br> 优点：访问速度快，因为你直接知道菜肴（对象）在哪里，你可以直接去拿，无需经过厨师（句柄）。</p><p>缺点：安全性较低，如果你的菜肴被移动到其他地方了（比如在内存压缩时），你需要自己去找新的位置，因为你直接持有的是那道菜肴（对象）的地址。</p><hr><p>在 Java 中，所有的对象引用都是通过句柄或者直接指针的方式进行访问的。这两种方式的选择，其实主要是由 Java 虚拟机的实现决定的，对于 Java 程序员来说是透明的。也就是说，你写的 Java 代码并不会直接受影响。但是，了解这些机制可以帮助你更好地理解程序的运行原理，比如内存管理和垃圾回收等。</p><p>实际上，大多数商业级别的 Java 虚拟机（比如 HotSpot），由于考虑到性能因素，选择了直接指针访问的方式。但在处理垃圾回收时，需要对这些对象地址进行更新，以保证引用的有效性。</p><hr><h2 id="垃圾回收" tabindex="-1">垃圾回收 <a class="header-anchor" href="#垃圾回收" aria-label="Permalink to &quot;垃圾回收&quot;">​</a></h2><h3 id="几种垃圾回收算法" tabindex="-1">几种垃圾回收算法 <a class="header-anchor" href="#几种垃圾回收算法" aria-label="Permalink to &quot;几种垃圾回收算法&quot;">​</a></h3><p><strong>1. 标记-清理（Mark-Sweep）算法</strong><br> 这个算法的过程就像一家清洁公司，先由员工（垃圾回收器）标记哪些是垃圾，然后清理这些标记过的垃圾。</p><p>优点：能回收大部分垃圾，避免了内存的浪费。</p><p>缺点：标记和清理过程效率较低，清理后会产生不连续的内存碎片。</p><p><strong>2. 标记-复制（Mark-Copy）算法</strong><br> 这个算法像是在两个房间之间移动物品，首先标记出哪些是有用的，然后将这些有用的物品复制到另一个空房间，最后清空原房间的所有物品。</p><p>优点：没有内存碎片，因为有用的对象都被复制到另一边。</p><p>缺点：需要额外的内存空间，来存储复制过来的对象。</p><p><strong>3. 标记-整理（Mark-Compact）算法</strong><br> 这个是标记-清理算法的升级版，类似于清洁公司改进后的操作，标记垃圾后，会将所有的有用物品向一边移动，然后清除剩余的垃圾。</p><p>优点：既可以回收垃圾，又避免了内存碎片。</p><p>缺点：移动对象需要更多的时间。</p><p><strong>4. 分代（Generational）收集算法</strong><br> 这个算法就像将垃圾分为易腐垃圾和干垃圾一样，分别处理。将对象根据生命周期分为新生代和老年代，使用不同的算法进行回收。</p><p>优点：节省时间，针对不同类型的垃圾采用最合适的方式清理。</p><h3 id="jvm-有哪些垃圾收集器-分别有什么特点" tabindex="-1">JVM 有哪些垃圾收集器，分别有什么特点 <a class="header-anchor" href="#jvm-有哪些垃圾收集器-分别有什么特点" aria-label="Permalink to &quot;JVM 有哪些垃圾收集器，分别有什么特点&quot;">​</a></h3><p><strong>1. Serial 收集器（串行收集器）</strong><br> 这个收集器就像是一位厨师，一点一点地做着所有的事情，因此它是单线程的。它使用&quot;复制&quot;算法清理新生代，使用&quot;标记-整理&quot;算法清理老年代。由于其单线程的原因，这个收集器适用于内存较小的情况。</p><p><strong>2. Parallel 收集器（并行收集器）</strong><br> Parallel 收集器如同一个团队的厨师一起清理垃圾，因此它是多线程的。同时也使用“复制“算法清理新生代，使用&quot;标记-整理&quot;算法清理老年代。这个收集器适用于多核服务器环境。</p><p><strong>3. CMS (Concurrent Mark Sweep) 收集器</strong><br> CMS 收集器就像一个熟练的厨师，边烹饪边清理垃圾，也就是它尽量减少停顿时间，主要适用于老年代的回收。基于“标记-清理“算法，它的主要过程包括&quot;初始标记&quot;，&quot;并发标记&quot;，&quot;重新标记&quot;，&quot;并发清理&quot;。</p><p>优点：并发收集、低停顿</p><p>缺点：对 CPU 资源非常敏感，可能会产生大量内存碎片。</p><p><strong>4. G1 (Garbage-First) 收集器</strong><br> G1 是一位更先进的厨师，他将内存划分为多个独立的小块，然后优先处理那些”垃圾“最多的小块。这就是 G1 名称的由来：Garbage-First。它使用了“标记-整理&quot;算法，采用并行与并发的方式，整体上看是基于&quot;标记-整理&quot;算法，但局部（两个 Region 之间）上又是基于&quot;复制&quot;算法。</p><p>优点：并行并发收集，分区回收，预测停顿模型。</p><hr><p><strong>5. ZGC，全名 Z Garbage Collector，是从 JDK 11 开始引入的一种全新的垃圾收集器。</strong></p><p>ZGC 的设计目标是在 TB 级别甚至 PB 级别的内存中提供低延迟。因此，ZGC 适合需要处理大量数据和需要低停顿时间的应用，如实时系统或大型机器学习应用。</p><p>ZGC 就像一个掌握了高阶技巧的大厨，采用了分区并行、并发、压缩的垃圾回收机制。它将 Java 堆划分为许多小的固定大小的区域，每个区域能被单独地管理和回收。这样，只需要部分停顿来回收垃圾，可以实现预期不到 10ms 的暂停时间，即使是在几 TB 的堆内存中也可以实现这个目标。并且，它能对空闲的分区进行压缩，从而更有效地利用内存。</p><p>ZGC 的工作过程包括以下步骤：</p><ol><li><strong>并发标记</strong>：ZGC 开始标记根对象，然后再并发地标记其他从根对象可达的对象。</li><li><strong>并发预处理</strong>：为后续的步骤做准备，比如为存活对象的重定位更新指针等。</li><li><strong>并发标记与重定位</strong>：ZGC 进一步标记对象，为存活的对象构建新的位置。</li><li><strong>并发重定位</strong>：最后，ZGC 会移动对象到新位置，并清理掉不再需要的空间。</li></ol><p>ZGC 用这种新颖的方法来处理内存中的垃圾，正如一位擅长创新的大厨用独特的方法去调制美食一样，使其成为 Java 世界中一颗新的、闪耀的明星。</p><hr><h3 id="强引用、软应用、弱引用" tabindex="-1">强引用、软应用、弱引用 <a class="header-anchor" href="#强引用、软应用、弱引用" aria-label="Permalink to &quot;强引用、软应用、弱引用&quot;">​</a></h3><p>在垃圾回收时的表现？</p><blockquote><p>让我们像在一个影院看四场连续电影一样，一起探讨一下强引用、软引用、弱引用和虚引用在 Java 中的表现吧！</p></blockquote><p><strong>1. 强引用</strong>：强引用就像是一部精彩的大片，观众们（垃圾回收器）从来不会在中途离场。只要强引用还存在，垃圾收集器永远不会回收掉被引用的对象。它就像一条坚不可摧的链子，将对象紧紧锁在内存当中。</p><p><strong>2. 软引用</strong>：软引用像是一部获奖电影。虽然有一些人可能会在中途离席，但大多数人会留至最后。只有在内存不足的时候，垃圾回收器才会在必要的时候回收掉软引用的对象。但在下一次判断时，只要内存还足，软引用依旧能保留其对应的对象。</p><p><strong>3. 弱引用</strong>：弱引用就像一部被批评家评价为“口碑平平”的电影。观众们大都不愿看完全场，很可能在中途离开。垃圾回收器在进行任何一次垃圾回收操作时都会立刻回收掉只被弱引用关联的对象。</p><p><strong>4. 虚引用</strong>：虚引用就像是一部还未上映的电影预告片。除了告诉你它即将上映，你什么也看不到。虚引用的存在，不会影响对象的生命周期。主要用来在被回收时收到一个系统通知。</p><p>这就是 Java 中的四种引用类型，每种引用类型在垃圾回收时都有不同的表现。就像选择看电影一样，你可以根据需要选择最合适的引用类型用于你的程序中。</p><h3 id="什么情况下触发-full-gc-什么是担保机制" tabindex="-1">什么情况下触发 Full GC？什么是担保机制 <a class="header-anchor" href="#什么情况下触发-full-gc-什么是担保机制" aria-label="Permalink to &quot;什么情况下触发 Full GC？什么是担保机制&quot;">​</a></h3><p>Full GC 是一个超级清洁工人的电调，当具有以下情况出现时，这个电调就会响起：</p><ol><li><strong>系统调用</strong>：当你的程序调用了 System.gc()时，系统会尝试执行 Full GC。但是，注意一点，这只是&quot;尝试&quot;，并不一定会立即生效，具体还要看 JVM。</li><li><strong>老年代空间不足</strong>：如果老年代空间不足以放入新的对象，也将触发 Full GC。</li><li><strong>方法区空间不足</strong>：当方法区空间不足时，也会触发 Full GC。</li><li><strong>CMS GC 时的 Concurrent Mode Failure 和 CMS GC 后预测到 Old 区域无法放下所有 Survivor</strong>：也就是说，假设出现了并发模式失败，或者 CMS 预测到 Old 区无法放置所有的年轻代对象，也会影响 Full GC。</li></ol><p>现在说说<strong>担保机制</strong>，它好比是一个飞行员的降落伞，出现了问题时能保证程序安全降落。当 Minor GC 无法找到足够的空间来存放新生代中存活的对象时，JVM 会启动担保机制，将新生代中存活的对象直接放入老年代，从而避免程序的出错。</p><hr><p>当 Minor GC 后新生代的 Survivor 空间不足以放下所有存活的对象时，我们该如何处理呢？直接报错吗？当然不是，这就是 Java 担保机制出场的时刻!</p><p>具体来说，担保机制的工作原理如下：</p><ol><li><strong>首先</strong>，在每次进行 Minor GC 前，虚拟机都会先检查老年代最大可用的连续空间是否大于新生代所有对象总空间，如果是，那么 Minor GC 可以确保是安全的。这个检查的过程就是担保机制的一部分。</li><li><strong>其次</strong>，如果老年代最大可用的连续空间小于新生代所有对象总空间，那么虚拟机会查看 HandlePromotionFailure 设置是否允许担保失败。如果允许，那么将只会进行 Minor GC；如果不允许，那么会进行一次 Full GC。</li><li><strong>最后</strong>，如果在 Minor GC 中有大量对象需要移动到老年代中，而老年代无法接纳的话，那么也需要启动 Full GC 操作。</li></ol><p>如此便保障了在新生代空间不足时，不会引起应用程序的错误，让程序得以“安全降落”。</p><hr><h3 id="对象什么时候会进入老年代" tabindex="-1">对象什么时候会进入老年代？ <a class="header-anchor" href="#对象什么时候会进入老年代" aria-label="Permalink to &quot;对象什么时候会进入老年代？&quot;">​</a></h3><p>对象进入老年代的情况，就像我们决定什么时候搬家一样，要取决于具体的情况：</p><ol><li><strong>年龄达到门槛</strong>：首先，每当新生代中的对象经过一次 Minor GC, 它的年龄就会加 1. 当对象的年龄达到一定值（默认是 15，这个值可以通过-XX:MaxTenuringThreshold 来设置）时，它就会被移动到老年代。 这就好比，当我们在某个地方住够了一定的年份，就可能会想搬家到别的地方去。</li><li><strong>动态年龄判断</strong>：为了更好地适应不同程序的需要，HotSpot 虚拟机并不是永远等到-XX:MaxTenuringThreshold 设置的值才将对象移至老年代。如果 Survivor 空间中相同年龄所有对象大小总和大于 Survivor 空间的一半，年龄大于或等于该年龄的对象就可以直接进入老年代，无须等到-XX:MaxTenuringThreshold 中设定的年龄。 简单来说，如果你的东西太多，即使你租的公寓还能住，你也可能会选择搬家。</li><li><strong>Survivor 空间不足</strong>：如果 Survivor 空间没有足够的空间来保存一次 Minor GC 后存活的对象时，那些无法放入 Survivor 的对象将直接进入老年代，无论它们的年龄。也就是说，当你家里已经没有足够的空间来储存你的东西，那你就不得不选择搬家了。</li></ol><p>以上就是对象进入老年代的几种情况。无论在何时，争取确定一个家的位置总是件挺开心的事！</p><h3 id="可达性判断" tabindex="-1">可达性判断 <a class="header-anchor" href="#可达性判断" aria-label="Permalink to &quot;可达性判断&quot;">​</a></h3><p>可达性判断，就像森林里的导航系统，帮你找出从起点（GC Roots）到目标点（需要判断的对象）的道路。</p><p>在 Java 中，可达性判断的算法是怎么工作的呢？其实主要是通过一系列的称为&quot;GC Roots&quot;的对象来作为起始点，从这些节点开始进行向下搜索，搜索所走过的路径称为引用链，通过这个引用链就能找到所有从 GC Roots 开始可达的对象。</p><p>那么，什么是不可达的对象呢？就是从 GC Roots 出发，没有任何引用链可以连接到这个对象，那么这个对象就被判断为不可达，也就被认为是可以被清理的垃圾对象。</p><p>所以说，如果一个对象到 GC Roots 没有任何引用链相连（用图论的话说，就是从 GC Roots 到这个对象不可达）时，则证明此对象是不可用的。</p><p>看起来像是一场宝藏寻找游戏，其实是帮助我们找出不再使用的对象，从而达到内存管理的目的。这就是 Java 垃圾收集器的视角：从 GC Roots 开始，找出所有被用到的对象，剩下的就是垃圾了。</p><h3 id="如何判断对象是否存活-gc-root-的对象有哪些" tabindex="-1">如何判断对象是否存活，GC root 的对象有哪些？ <a class="header-anchor" href="#如何判断对象是否存活-gc-root-的对象有哪些" aria-label="Permalink to &quot;如何判断对象是否存活，GC root 的对象有哪些？&quot;">​</a></h3><p>如何判断对象是否存活，就像淘宝上的商品，被收藏的越多，就越受欢迎。在 Java 的垃圾回收中，主要采用的是可达性分析算法。这个算法的基本理念就是通过一系列的称为&quot;GC Roots&quot;的对象作为起始点，从这些节点开始向下搜索，搜索所走过的路径称为引用链，如果当一个对象到 GC Roots 没有任何引用链相连（用图论的话说，就是从 GC Roots 到这个对象不可达）时，则证明此对象是不可用的。</p><p>&quot;GC Roots&quot;的对象包括：</p><ol><li><strong>虚拟机栈（栈帧中的本地变量表）中引用的对象</strong>。 玩过乐高积木的话，你应该知道，如果把乐高积木当作对象，那么放在桌子上（虚拟机栈）的乐高积木就是栈中引用的对象，它们都是 GC Roots。</li><li><strong>方法区中类静态属性引用的对象</strong>。 这就好比是你家的家具，它们不会被随便动，所以他们也就是 GC Roots。</li><li><strong>方法区中常量引用的对象</strong>。 就像一些家庭传统一样，他们是如此的重要，以至于你不会轻易改变的，它们当然也是 GC Roots。</li><li><strong>本地方法栈中 JNI（即一般说的 Native 方法）引用的对象</strong>。 这就好比是大楼的基础，一切都建立在上面，所以他们肯定是 GC Roots。</li></ol><p>总结一下，就是判断对象是否存活，其实就看这个对象是否在 GC Roots 路径上。那些在 GC Roots 路径上的对象就想淘宝上被收藏的商品，是活跃的，不可回收的，那些不在的，就是要被清理出去的。</p><h3 id="如何回答线上用的是什么垃圾收集器-为什么要用它" tabindex="-1">如何回答线上用的是什么垃圾收集器？为什么要用它？ <a class="header-anchor" href="#如何回答线上用的是什么垃圾收集器-为什么要用它" aria-label="Permalink to &quot;如何回答线上用的是什么垃圾收集器？为什么要用它？&quot;">​</a></h3><blockquote><p>面试官问这个问题，就像问你选择了哪款最新的手机，而你选择它的理由是什么。回答这个问题的关键在于，你需要明白你们项目所使用的垃圾收集器具有哪些特性，以及为何这些特性符合你们的应用需求。</p><p>例如，如果线上用的是 G1 收集器，你可以这样回答：</p><p>&quot;线上我们使用的是 G1（Garbage-First）垃圾收集器，选择它的原因主要有以下几点：</p><ol><li><strong>并发与并行</strong>：G1 垃圾收集器在执行过程中，可以实现 GC 线程和应用线程的并发执行，减少了应用的停顿时间。这适合我们应用对延迟敏感，需要更快响应的需求。</li><li><strong>分代收集</strong>：G1 依然采用分代的思想，但不再是物理级别的分割，而是将整个堆划分为多个小块，每个小块可以是新生代也可以是老年代，这使得 G1 获得了更高的堆内存利用率。</li><li><strong>预测停顿</strong>：G1 收集器有个很特别的设计，就是能建立可预测的停顿时间模型，能明确指定在一个长度为 M 毫秒的时间片段内，消耗在垃圾收集上的时间不超过 N 毫秒，这在要求确切的系统响应时间和拥有较大堆内存的场景下十分有用，而我们的应用恰恰满足这个特性。</li></ol><p>总的来说，选择 G1 垃圾收集器是因为它能够满足我们高并发、大内存和低延迟的需求。&quot;</p><p>当然，这只是一个例子，如果你线上用的是 CMS 或 ZGC 等其它垃圾收集器，理由都会不同。所以还需要你结合自己实际场景，以及对垃圾收集器的理解去回答。</p></blockquote><hr><blockquote><p>给一些案例，为什么使用这些 GC</p></blockquote><p>&quot;线上我们使用的是 ZGC（Z Garbage Collector）垃圾回收器。选择它的原因主要有以下几点：</p><ol><li><strong>低停顿</strong>：ZGC 设计目标是将停顿时间控制在 10ms 以内，在进行垃圾收集的时候，使用了多线程并发处理，并且读写操作都不会被 block，这对于我们的服务来说，可以提供更快更稳定的响应。</li><li><strong>高吞吐量</strong>：ZGC 使用了并行度来提高吞吐量，这对于提高我们服务的交付能力十分重要。</li><li><strong>可伸缩性</strong>：ZGC 的另一个好处是可伸缩性，它支持的堆大小可以从几个 G 到几个 T，这使得它可以适应不同的使用场景需求，对我们以后系统的扩展非常友好。</li><li><strong>并发处理</strong>：ZGC 可以并发地处理标记、重定位和回收，这使得垃圾回收的并发阶段的效率大大提高，也进一步减小了停顿时间。</li><li><strong>走在技术前沿</strong>：ZGC 是最新的垃圾回收器之一，选择它代表我们团队一直走在技术前沿。</li></ol><p>总的来说，选择 ZGC 垃圾回收器是因为它能满足我们的低停顿、高吞吐量的需求，而且能够支持非常大的堆内存。&quot;</p><hr><p>1、 parallel scavenge + parallel old：标记复制算法，强调吞吐量；业务并发不高，不需要及时的相应，追求充分利用机器资源；离线处理程序； jdk 1.8 默认的垃圾回收髒</p><p>2、 paraNew +CMS：标记复制算法+标记清除算法，关注服务的相应速度，低停顿低延迟，尽量不要 stw； 直接面向用户的业务</p><p>3、G 1：同样低延迟，追求响应。不会有内存碎片的问题。</p><p>4、Seral：简单，demo，内存比较小的应用效果可能比并发垃圾回收器更好。</p><hr><h2 id="常见命令与问题排查" tabindex="-1">常见命令与问题排查 <a class="header-anchor" href="#常见命令与问题排查" aria-label="Permalink to &quot;常见命令与问题排查&quot;">​</a></h2><h3 id="常用的-jvm-调优参数" tabindex="-1">常用的 JVM 调优参数 <a class="header-anchor" href="#常用的-jvm-调优参数" aria-label="Permalink to &quot;常用的 JVM 调优参数&quot;">​</a></h3><blockquote><p>配置参数，分别有哪些，有什么用</p><p>-Xms 和-Xmx：堆内存初始大小/堆内存的最大大小 -Xmn：新生代的内存大小 -XX:SurvivorRatio=6 假设新生代 100 m, eden: 60 m s1:20m $2:20 -XsS 256 k/512 k -XX：+UseSerialGC -XX：+UseParNewGC -XX：+UseConcMarkSweepGC</p></blockquote><ol><li><strong>-Xms</strong>：设置堆内存的初始大小。也就是在 JVM 启动时分配的内存大小，比如-Xms256m 就表示分配 256MB 的内存。</li><li><strong>-Xmx</strong>：设置堆内存的最大大小。列入-Xmx1024m 就表示最大分配 1024MB 的内存。一般来说，我们会设置 Xms 和 Xmx 为相同的数值，以避免程序在运行期间频繁的进行内存的回收和分配，这样可以提高效率。</li><li><strong>-XX:NewRatio</strong>：设置新生代（Young Generation）和老年代（Old Generation）的比例。比如设置-XX:NewRatio = 2 表示新生代是老年代的 1/2。</li><li><strong>-XX:SurvivorRatio</strong>：设置新生代中 Eden 区与 Survivor 区的大小比例。例如 -XX:SurvivorRatio=8 就是表示 Eden:S0:S1 = 8:1:1</li><li><strong>-XX:MaxPermSize</strong>：设置永久代的最大值。这个参数在 JDK 8 之后就没有了，因为 JDK 8 开始移除了传统的永久代，使用元空间(Metaspace)代替。</li><li><strong>-XX:+UseConcMarkSweepGC</strong>：启用 CMS 垃圾收集器。这个收集器基于&quot;标记-清除&quot;算法，适用于优先保证系统响应能力的场合。（JDK9 被弃用）</li><li><strong>-XX:+UseParallelGC</strong>：启用 Parallel GC。这个收集器适用于多核服务器，主要使用多线程复制算法。</li><li><strong>-XX:+UseG 1 GC</strong>：启用 G 1 收集器。它在 JDK 7 u 4 后被引进，适用于停顿时间尽量短且可预期、物理内存堆可以超过 4 G 的场合。</li></ol><h3 id="关于-jvm-的调优工具" tabindex="-1">关于 JVM 的调优工具 <a class="header-anchor" href="#关于-jvm-的调优工具" aria-label="Permalink to &quot;关于 JVM 的调优工具&quot;">​</a></h3><p>Jvisualvm 这个工具提供了一系列的功能，包括监控 JVM 性能、线程分析、内存泄漏检测等。让我们来看看 jvisualvm 的几个主要界面：</p><ol><li><strong>概述（Overview）</strong>：这里可以看到进程的基本信息，例如：PID、JVM 版本、JVM 参数、Java 版本等等。</li><li><strong>监视器（Monitor）</strong>：这里可以实时监控 JVM 的 CPU、堆内存、类加载、线程等情况，这样可以让你了解虚拟机当前的运行情况。</li><li><strong>线程（Threads）</strong>：在这里可以看到当前 JVM 运行的所有线程的详细信息、状态，还可以用于线程的 CPU 使用情况分析，对于排查线程问题比较有帮助。</li><li><strong>采样器（Sampler）</strong>：采样器可以用来抽样查看 CPU 和内存的使用情况，帮助我们找出程序中的热点。</li><li><strong>性能分析器（Profiler）</strong>：它提供了一个在应用运行过程中对 CPU、内存进行深度分析的工具，可以用来找出程序中的性能瓶颈。</li></ol><h3 id="jstack-jmap-jstat-jutil-几个命令" tabindex="-1">Jstack, jmap, jstat, jutil 几个命令 <a class="header-anchor" href="#jstack-jmap-jstat-jutil-几个命令" aria-label="Permalink to &quot;Jstack, jmap, jstat, jutil 几个命令&quot;">​</a></h3><p>这几个命令分别什么作用？</p><ol><li><strong>jstack</strong>：这个命令可以用于生成当前时刻的线程快照。线程快照是当前 java 进程中活动线程的一种调试工具，它会显式出每一个线程的执行堆栈，对于发现线程死锁、查找线程长时间占用 CPU 原因等都十分有帮助。</li><li><strong>jmap</strong>：这是一个 JVM 内存映射工具，允许你生成堆转储快照（heap dump snapshot）、计算对象大小、查看类加载器信息等。这个工具对于分析 Java 内存泄漏问题很有价值。</li><li><strong>jstat</strong>：jstat 是一个 JVM 统计信息工具，可以显示出 JVM 进程的类装载、内存、垃圾收集、JIT 编译等方面的运行数据。在没有 GUI 界面，只有命令行环境的服务器上，这个工具尤其实用。</li><li><strong>jhat</strong>：jhat 可以与 jmap 配合使用，用于分析 jmap 生成的堆转储快照。它会启动一个 web 服务器，你可以在浏览器中分析堆内存的使用情况。</li></ol><h3 id="cpu-高如何进行线程排查" tabindex="-1">CPU 高如何进行线程排查 <a class="header-anchor" href="#cpu-高如何进行线程排查" aria-label="Permalink to &quot;CPU 高如何进行线程排查&quot;">​</a></h3><p>当服务器的 CPU 使用率高的时候，我们往往需要发现在运行的那些线程占用的资源最多，接着我们要做的事情就是找出这些线程并分析问题所在。 现在，就让我来教你一套 CPU 占用过高的线程排查的秘籍：</p><ol><li><strong>找出出问题的 Java 进程</strong>：可以使用<code>top</code>命令来查看那个 Java 进程的 CPU 使用率最高。</li><li><strong>查看进程中各线程的 CPU 占用情况</strong>：使用这条命令<code>ps -mp 进程ID -o THREAD,tid,time</code>，可以查看该进程下的各个线程的运行情况，这样可以知道是哪个线程在占用 CPU。</li><li><strong>将需要的线程 ID 转换为 16 进制格式</strong>：这一步的目的是因为，在后面使用 jstack 来查看线程堆栈信息的时候需要用到 16 进制格式的线程 ID。使用<code>printf &quot;%x\\n&quot; 线程ID</code>，就可以把线程 ID 转为 16 进制的格式。</li><li><strong>获取线程的堆栈信息</strong>：接下来，我们使用<code>jstack 进程ID | grep 线程ID -A 30</code>，可以得到该线程的堆栈信息。有了堆栈信息，我们就可以查看线程的执行情况，从而找出问题所在。</li></ol><p>以上的步骤就像是一个宝藏寻找的地图，按图索骥，就可以找出&quot;宝藏&quot;所在——也就是问题的线程。</p><h3 id="jvm-调优步骤" tabindex="-1">JVM 调优步骤 <a class="header-anchor" href="#jvm-调优步骤" aria-label="Permalink to &quot;JVM 调优步骤&quot;">​</a></h3><blockquote><p>画图，监控部分如何实现，大概流程就行</p></blockquote><p>需要明确的步骤和辛苦的准备。下面是一种常用的 JVM 调优的步骤：</p><ol><li><strong>明确优化目标</strong>：首先，我们需要明确优化的目标，例如：降低响应时间、提高吞吐量、减少 [[OOM]] 出现的频率等等。</li><li><strong>资源了解与监控</strong>：对运行的系统进行资源的监控和了解，这包括 CPU、内存、磁盘 IO 以及网络 IO 等方面。</li><li><strong>性能测试</strong>：对系统进行性能测试，包括压力测试、并发测试和稳定性测试等，以发现系统在性能上的短板。</li><li><strong>问题定位与分析</strong>：通过分析监控数据和测试结果，找出影响系统性能的主要因素，然后对其进行深入分析。</li><li><strong>调整配置</strong>：根据上一步的分析结果，调整 JVM 相关配置参数。可能包括堆大小（-Xmx、-Xms）、新生代和老年代的比例（-XX:NewRatio）、垃圾回收器选择（-XX:+UseConcMarkSweepGC、-XX:+UseG1GC、-XX:+UseParallelGC）等。</li><li><strong>再次测试</strong>：调整配置之后，需要再次进行性能测试，以确认调整效果。</li><li><strong>结果对比与分析</strong>：分析优化前后的性能测试结果，如果满足优化目标，那么优化就算完成；如果没有满足优化目标，那么就需要再次进行问题定位和分析，然后调整配置，如此反复，直到满足优化目标为止。</li></ol><h3 id="内存飙高问题怎么排查" tabindex="-1">内存飙高问题怎么排查 <a class="header-anchor" href="#内存飙高问题怎么排查" aria-label="Permalink to &quot;内存飙高问题怎么排查&quot;">​</a></h3><p>出现内存飙高问题时，你可能会想，&quot;我到底做了什么让内存如此高涨呢？&quot;。实际上，内存飙高一般有两种情况：一种是正常的高内存使用，另一种是内存泄漏。</p><ol><li><strong>正常的高内存使用</strong>：如果你的程序需要处理大量的数据，或者使用了需要大量内存的数据结构或算法，那么内存占用高可能是正常的。这种情况下，你可以通过优化你的程序或增加 JVM 的最大堆内存来解决问题。</li><li><strong>[[内存泄漏]]</strong>：如果你的程序长时间运行后，内存占用持续增加，且无法被垃圾收集器释放，那可能是内存泄漏。这种情况下，你需要找出泄漏的源头。一般可以使用内存分析工具（如 MAT、jvisualVM 等）对 dump 出的堆内存进行分析，找出内存占用最多的对象，以及其引用链，进而找出可能的内存泄漏处。 内存泄露的写法：对于静态变量的对象没有回收，threadlocal 也会内存泄露，因为里面的 map 被回收之后，</li></ol><hr><p>关于排查步骤，一般来说有以下几步：</p><ol><li><strong>找出异常现象</strong>：通过监控工具查看系统资源使用情况，发现内存使用率过高的问题。</li><li><strong>定位问题区域</strong>：找出内存占用较多的区域，这通常通过内存分析工具来完成。</li><li><strong>诊断问题原因</strong>：分析内存占用高的原因，例如是代码问题还是配置问题，或者是正常情况下的高内存需求。</li><li><strong>解决问题</strong>：对于内存泄露，根据前一步诊断出的问题原因，修复代码或者优化配置。对于正常高内存使用，评估是否需要增加堆内存，或者需要优化算法。</li></ol><p>这个问题就像一个迷宫，你需要用适当的工具和方法，一步步找到出口。希望你在解决问题的同时，也能积累更多的经验和智慧。</p><hr><p>内存飙高的问题，使用 <code>jstat</code> 和 <code>jmap</code> 可以获取非常有价值的信息。就像是在一片混乱的地图上，我们有了指南针和卫星定位，让我们了解到具体的情况：</p><ol><li><strong>使用 <code>jstat</code> 观察</strong>：<code>jstat</code> 这个命令可以用来实时监控 JVM 的各个区域的内存使用状况（新生代、老年代、永久代等）。通过使用 <code>jstat -gc &lt;pid&gt; [interval] [count]</code> 命令，我们可以查看 GC 的情况和堆的使用情况。当我们发现内存飙高的时候，可以通过这个命令观察是否有频繁的 Full GC，是否老年代的内存使用接近最大值，以便于我们定位问题。</li><li><strong>使用<code>jmap</code>查看对象情况</strong>：<code>jmap</code>是一个非常强大的命令，它可以用来生成堆转储快照（heap dump）和计算对象的大小。例如，我们可以使用<code>jmap -dump:format=b,file=heap.bin &lt;pid&gt;</code>命令，生成堆的快照，然后使用 MAT 工具打开这个快照，通过 MAT 工具，我们可以查看哪些对象占用的内存最多，以便于我们找出问题。</li></ol><p>这就像是问题排查的野外求生指南，只要按照指南指示，我们就可以在疑难问题的丛林中找到出路。</p><hr><h3 id="mat-怎么分析-dump-排查内存溢出" tabindex="-1">MAT 怎么分析 dump 排查内存溢出 <a class="header-anchor" href="#mat-怎么分析-dump-排查内存溢出" aria-label="Permalink to &quot;MAT 怎么分析 dump 排查内存溢出&quot;">​</a></h3><p>使用 MAT 排查内存溢出的一般步骤：</p><ol><li><strong>导入堆转储快照</strong>：首先，我们需要在 JVM 产生 OOM 之前，使用 <code>jmap</code> 导出堆转储快照。然后在 MAT 中导入这个快照。</li><li><strong>分析内存占用</strong>：导入快照后，MAT 会自动执行一次内存分析，生成报告。我们可以根据报告查看内存占用情况。在&quot;Overview&quot;视图中，我们可以看到内存的总占用情况，以及 Top10 的内存消耗对象。</li><li><strong>查看泄漏疑似报告</strong>：在&quot;Leak Suspects&quot;视图中，MAT 会给出可能的内存泄漏点，点击每一个疑似点，MAT 会显示更详细的信息，包括哪些对象引用了这个对象。</li><li><strong>查看内存分布</strong>：在&quot;Dominator Tree&quot;视图中，我们可以看到各个对象占用内存的情况，其中的利器是&quot;Path To GC Roots&quot;菜单项，它可以显示出当前对象到 GC Roots 的引用链，这有助于我们找出为什么这个对象没有被垃圾回收。</li><li><strong>解决问题</strong>：根据 MAT 给出的内存泄漏报告和我们自己的分析结果，进行代码的修改或者配置的修改，解决问题。</li></ol><h3 id="cpu-飙高和内存飙高有什么关系" tabindex="-1">cpu 飙高和内存飙高有什么关系 <a class="header-anchor" href="#cpu-飙高和内存飙高有什么关系" aria-label="Permalink to &quot;cpu 飙高和内存飙高有什么关系&quot;">​</a></h3><p>CPU 飙高和内存飙高，它们之间就像是一队舞蹈团队中的两位舞者，虽然各自有各自的动作，但它们之间可能存在着某种联系。</p><ol><li><strong>垃圾收集造成 CPU 飙高</strong>：当内存使用越来越高时，JVM 的垃圾收集器将更频繁地工作，这可能导致 CPU 使用率飙升。因为垃圾收集是一个计算密集型的过程，需要 CPU 投入大量的时间和资源。所以有时候，你会发现 CPU 和内存飙高是同时发生的。</li><li><strong>过度的对象创建和销毁引起的内存和 CPU 压力</strong>：如果一个程序过度地创建对象，特别是短生命周期的，这不仅会增加内存压力，还会影响 CPU 使用率。因为，对象的创建和销毁需要消耗 CPU 资源，尤其是垃圾收集过程。</li></ol><p>然而，它们并不总是关联的。有可能内存占用持续高涨是因为数据量大或者内存泄漏，而 CPU 占用高可能是由于程序处于长时间的计算或者进入了死循环。</p><p>解决这两个问题的策略都需要从源头找起——查明是什么导致了内存或者 CPU 的飙高，然后针对性地进行优化。</p>',182),i=[e];function n(s,p,g,h,u,d){return a(),t("div",null,i)}const m=o(l,[["render",n]]);export{q as __pageData,m as default};
