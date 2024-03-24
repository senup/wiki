import{_ as s,o as n,c as a,R as l}from"./chunks/framework.7FlijoJG.js";const D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"多线程/AQS-1.md","filePath":"多线程/AQS-1.md","lastUpdated":1711296414000}'),p={name:"多线程/AQS-1.md"},o=l(`<p>在分析 Java 并发包 java.util.concurrent 源码的时候，少不了需要了解 AbstractQueuedSynchronizer（以下简写AQS）这个抽象类，因为它是 Java 并发包的基础工具类，是实现 ReentrantLock、CountDownLatch、Semaphore、FutureTask 等类的基础。</p><p>Google 一下 AbstractQueuedSynchronizer，我们可以找到很多关于 AQS 的介绍，但是很多都没有介绍清楚，因为大部分文章没有把其中的一些关键的细节说清楚。</p><p>本文将从 ReentrantLock 的公平锁源码出发，分析下 AbstractQueuedSynchronizer 这个类是怎么工作的，希望能给大家提供一些简单的帮助。</p><p>申明以下几点：</p><ol><li>本文有点长，但还是挺简单，主要面向读者对象为并发编程的初学者，或者想要阅读 Java 并发包源码的开发者。对于新手来说，可能需要花好几个小时才能完全看懂，但是这时间肯定是值得的。</li><li>源码环境 JDK1.7（1.8没啥变化），看到不懂或有疑惑的部分，最好能自己打开源码看看。Doug Lea 大神的代码写得真心不错。</li><li>本文不分析共享模式，这样可以给读者减少很多负担，<a href="/wiki/AQS-3.html">第三篇文章</a>对共享模式进行了分析。而且也不分析 condition 部分，所以应该说很容易就可以看懂了。</li><li>本文大量使用我们平时用得最多的 ReentrantLock 的概念，本质上来说是不正确的，读者应该清楚，AQS 不仅仅用来实现可重入锁，只是希望读者可以用锁来联想 AQS 的使用场景，降低阅读压力。</li><li>ReentrantLock 的公平锁和非公平锁只有一点点区别，<a href="/wiki/AQS-2.html">第二篇文章</a>做了介绍。</li></ol><h2 id="aqs-结构" tabindex="-1">AQS 结构 <a class="header-anchor" href="#aqs-结构" aria-label="Permalink to &quot;AQS 结构&quot;">​</a></h2><p>先来看看 AQS 有哪些属性，搞清楚这些基本就知道 AQS 是什么套路了，毕竟可以猜嘛！</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// 头结点，你直接把它当做 当前持有锁的线程 可能是最好理解的</span></span>
<span class="line"><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">transient</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">volatile</span><span style="color:#E1E4E8;"> Node head;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 阻塞的尾节点，每个新的节点进来，都插入到最后，也就形成了一个链表</span></span>
<span class="line"><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">transient</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">volatile</span><span style="color:#E1E4E8;"> Node tail;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 这个是最重要的，代表当前锁的状态，0代表没有被占用，大于 0 代表有线程持有当前锁</span></span>
<span class="line"><span style="color:#6A737D;">// 这个值可以大于 1，是因为锁可以重入，每次重入都加上 1</span></span>
<span class="line"><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">volatile</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> state;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 代表当前持有独占锁的线程，举个最重要的使用例子，因为锁可以重入</span></span>
<span class="line"><span style="color:#6A737D;">// reentrantLock.lock()可以嵌套调用多次，所以每次用这个来判断当前线程是否已经拥有了锁</span></span>
<span class="line"><span style="color:#6A737D;">// if (currentThread == getExclusiveOwnerThread()) {state++}</span></span>
<span class="line"><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">transient</span><span style="color:#E1E4E8;"> Thread exclusiveOwnerThread; </span><span style="color:#6A737D;">//继承自AbstractOwnableSynchronizer</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// 头结点，你直接把它当做 当前持有锁的线程 可能是最好理解的</span></span>
<span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">transient</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">volatile</span><span style="color:#24292E;"> Node head;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 阻塞的尾节点，每个新的节点进来，都插入到最后，也就形成了一个链表</span></span>
<span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">transient</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">volatile</span><span style="color:#24292E;"> Node tail;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 这个是最重要的，代表当前锁的状态，0代表没有被占用，大于 0 代表有线程持有当前锁</span></span>
<span class="line"><span style="color:#6A737D;">// 这个值可以大于 1，是因为锁可以重入，每次重入都加上 1</span></span>
<span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">volatile</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> state;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 代表当前持有独占锁的线程，举个最重要的使用例子，因为锁可以重入</span></span>
<span class="line"><span style="color:#6A737D;">// reentrantLock.lock()可以嵌套调用多次，所以每次用这个来判断当前线程是否已经拥有了锁</span></span>
<span class="line"><span style="color:#6A737D;">// if (currentThread == getExclusiveOwnerThread()) {state++}</span></span>
<span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">transient</span><span style="color:#24292E;"> Thread exclusiveOwnerThread; </span><span style="color:#6A737D;">//继承自AbstractOwnableSynchronizer</span></span></code></pre></div><p>怎么样，看样子应该是很简单的吧，毕竟也就四个属性啊。</p><p>AbstractQueuedSynchronizer 的等待队列示意如下所示，注意了，之后分析过程中所说的 queue，也就是阻塞队列<strong>不包含 head，不包含 head，不包含 head</strong>。</p><p><img src="https://www.javadoop.com/blogimages/AbstractQueuedSynchronizer/aqs-0.png" alt="aqs-0"></p><p>等待队列中每个线程被包装成一个 Node 实例，数据结构是链表，一起看看源码吧：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Node</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 标识节点当前在共享模式下</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> Node SHARED </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Node</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 标识节点当前在独占模式下</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> Node EXCLUSIVE </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// ======== 下面的几个int常量是给waitStatus用的 ===========</span></span>
<span class="line"><span style="color:#6A737D;">    /** waitStatus value to indicate thread has cancelled */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 代码此线程取消了争抢这个锁</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> CANCELLED </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /** waitStatus value to indicate successor&#39;s thread needs unparking */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 官方的描述是，其表示当前node的后继节点对应的线程需要被唤醒</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> SIGNAL    </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">-</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /** waitStatus value to indicate thread is waiting on condition */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 本文不分析condition，所以略过吧，下一篇文章会介绍这个</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> CONDITION </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">-</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * waitStatus value to indicate the next acquireShared should</span></span>
<span class="line"><span style="color:#6A737D;">     * unconditionally propagate</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 同样的不分析，略过吧</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> PROPAGATE </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">-</span><span style="color:#79B8FF;">3</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// =====================================================</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 取值为上面的1、-1、-2、-3，或者0(以后会讲到)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 这么理解，暂时只需要知道如果这个值 大于0 代表此线程取消了等待，</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">//    ps: 半天抢不到锁，不抢了，ReentrantLock是可以指定timeouot的。。。</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">volatile</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> waitStatus;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 前驱节点的引用</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">volatile</span><span style="color:#E1E4E8;"> Node prev;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 后继节点的引用</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">volatile</span><span style="color:#E1E4E8;"> Node next;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 这个就是线程本尊</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">volatile</span><span style="color:#E1E4E8;"> Thread thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Node</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 标识节点当前在共享模式下</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> Node SHARED </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Node</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 标识节点当前在独占模式下</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> Node EXCLUSIVE </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// ======== 下面的几个int常量是给waitStatus用的 ===========</span></span>
<span class="line"><span style="color:#6A737D;">    /** waitStatus value to indicate thread has cancelled */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 代码此线程取消了争抢这个锁</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> CANCELLED </span><span style="color:#D73A49;">=</span><span style="color:#24292E;">  </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /** waitStatus value to indicate successor&#39;s thread needs unparking */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 官方的描述是，其表示当前node的后继节点对应的线程需要被唤醒</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> SIGNAL    </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /** waitStatus value to indicate thread is waiting on condition */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 本文不分析condition，所以略过吧，下一篇文章会介绍这个</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> CONDITION </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * waitStatus value to indicate the next acquireShared should</span></span>
<span class="line"><span style="color:#6A737D;">     * unconditionally propagate</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 同样的不分析，略过吧</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> PROPAGATE </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// =====================================================</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 取值为上面的1、-1、-2、-3，或者0(以后会讲到)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 这么理解，暂时只需要知道如果这个值 大于0 代表此线程取消了等待，</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//    ps: 半天抢不到锁，不抢了，ReentrantLock是可以指定timeouot的。。。</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">volatile</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> waitStatus;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 前驱节点的引用</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">volatile</span><span style="color:#24292E;"> Node prev;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 后继节点的引用</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">volatile</span><span style="color:#24292E;"> Node next;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 这个就是线程本尊</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">volatile</span><span style="color:#24292E;"> Thread thread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Node 的数据结构其实也挺简单的，就是 thread + waitStatus + pre + next 四个属性而已，大家先要有这个概念在心里。</p><p>上面的是基础知识，后面会多次用到，心里要时刻记着它们，心里想着这个结构图就可以了。下面，我们开始说 ReentrantLock 的公平锁。再次强调，我说的阻塞队列不包含 head 节点。</p><p><img src="https://www.javadoop.com/blogimages/AbstractQueuedSynchronizer/aqs-0.png" alt="aqs-0"></p><p>首先，我们先看下 ReentrantLock 的使用方式。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// 我用个web开发中的service概念吧</span></span>
<span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">OrderService</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 使用static，这样每个线程拿到的是同一把锁，当然，spring mvc中service默认就是单例，别纠结这个</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> ReentrantLock reentrantLock </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ReentrantLock</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">createOrder</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 比如我们同一时间，只允许一个线程创建订单</span></span>
<span class="line"><span style="color:#E1E4E8;">        reentrantLock.</span><span style="color:#B392F0;">lock</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 通常，lock 之后紧跟着 try 语句</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">try</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 这块代码同一时间只能有一个线程进来(获取到锁的线程)，</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 其他的线程在lock()方法上阻塞，等待获取到锁，再进来</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 执行代码...</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 执行代码...</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 执行代码...</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">finally</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 释放锁</span></span>
<span class="line"><span style="color:#E1E4E8;">            reentrantLock.</span><span style="color:#B392F0;">unlock</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// 我用个web开发中的service概念吧</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OrderService</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 使用static，这样每个线程拿到的是同一把锁，当然，spring mvc中service默认就是单例，别纠结这个</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> ReentrantLock reentrantLock </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ReentrantLock</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">createOrder</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 比如我们同一时间，只允许一个线程创建订单</span></span>
<span class="line"><span style="color:#24292E;">        reentrantLock.</span><span style="color:#6F42C1;">lock</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 通常，lock 之后紧跟着 try 语句</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">try</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 这块代码同一时间只能有一个线程进来(获取到锁的线程)，</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 其他的线程在lock()方法上阻塞，等待获取到锁，再进来</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 执行代码...</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 执行代码...</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 执行代码...</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">finally</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 释放锁</span></span>
<span class="line"><span style="color:#24292E;">            reentrantLock.</span><span style="color:#6F42C1;">unlock</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>ReentrantLock 在内部用了内部类 Sync 来管理锁，所以真正的获取锁和释放锁是由 Sync 的实现类来控制的。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">abstract</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Sync</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">extends</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">AbstractQueuedSynchronizer</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">abstract</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Sync</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">extends</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AbstractQueuedSynchronizer</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Sync 有两个实现，分别为 NonfairSync（非公平锁）和 FairSync（公平锁），我们看 FairSync 部分。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ReentrantLock</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> fair) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    sync </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> fair </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">FairSync</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">NonfairSync</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ReentrantLock</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> fair) {</span></span>
<span class="line"><span style="color:#24292E;">    sync </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> fair </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">FairSync</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">NonfairSync</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="线程抢锁" tabindex="-1">线程抢锁 <a class="header-anchor" href="#线程抢锁" aria-label="Permalink to &quot;线程抢锁&quot;">​</a></h2><p>很多人肯定开始嫌弃上面废话太多了，下面跟着代码走，我就不废话了。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">FairSync</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">extends</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Sync</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">long</span><span style="color:#E1E4E8;"> serialVersionUID </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">-</span><span style="color:#79B8FF;">3000897897090466540L</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  	</span><span style="color:#6A737D;">// 争锁</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">lock</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">acquire</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  	</span><span style="color:#6A737D;">// 来自父类AQS，我直接贴过来这边，下面分析的时候同样会这样做，不会给读者带来阅读压力</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 我们看到，这个方法，如果tryAcquire(arg) 返回true, 也就结束了。</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 否则，acquireQueued方法会将线程压到队列中</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">acquire</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#FFAB70;">arg</span><span style="color:#E1E4E8;">) { </span><span style="color:#6A737D;">// 此时 arg == 1</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 首先调用tryAcquire(1)一下，名字上就知道，这个只是试一试</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 因为有可能直接就成功了呢，也就不需要进队列排队了，</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 对于公平锁的语义就是：本来就没人持有锁，根本没必要进队列等待(又是挂起，又是等待被唤醒的)</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#B392F0;">tryAcquire</span><span style="color:#E1E4E8;">(arg) </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// tryAcquire(arg)没有成功，这个时候需要把当前线程挂起，放到阻塞队列中。</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">acquireQueued</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">addWaiter</span><span style="color:#E1E4E8;">(Node.EXCLUSIVE), arg)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">selfInterrupt</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * Fair version of tryAcquire.  Don&#39;t grant access unless</span></span>
<span class="line"><span style="color:#6A737D;">     * recursive call or no waiters or is first.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 尝试直接获取锁，返回值是boolean，代表是否获取到锁</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 返回true：1.没有线程在等待锁；2.重入锁，线程本来就持有锁，也就可以理所当然可以直接获取</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">protected</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">tryAcquire</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#FFAB70;">acquires</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> Thread current </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> Thread.</span><span style="color:#B392F0;">currentThread</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> c </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getState</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// state == 0 此时此刻没有线程持有锁</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (c </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 虽然此时此刻锁是可以用的，但是这是公平锁，既然是公平，就得讲究先来后到，</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 看看有没有别人在队列中等了半天了</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#B392F0;">hasQueuedPredecessors</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 如果没有线程在等待，那就用CAS尝试一下，成功了就获取到锁了，</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 不成功的话，只能说明一个问题，就在刚刚几乎同一时刻有个线程抢先了 =_=</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 因为刚刚还没人的，我判断过了</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#B392F0;">compareAndSetState</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">, acquires)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 到这里就是获取到锁了，标记一下，告诉大家，现在是我占用了锁</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#B392F0;">setExclusiveOwnerThread</span><span style="color:#E1E4E8;">(current);</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">      	</span><span style="color:#6A737D;">// 会进入这个else if分支，说明是重入了，需要操作：state=state+1</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 这里不存在并发问题</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (current </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getExclusiveOwnerThread</span><span style="color:#E1E4E8;">()) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> nextc </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> c </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> acquires;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (nextc </span><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Error</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Maximum lock count exceeded&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">setState</span><span style="color:#E1E4E8;">(nextc);</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 如果到这里，说明前面的if和else if都没有返回true，说明没有获取到锁</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 回到上面一个外层调用方法继续看:</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// if (!tryAcquire(arg) </span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">//        &amp;&amp; acquireQueued(addWaiter(Node.EXCLUSIVE), arg)) </span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">//     selfInterrupt();</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 假设tryAcquire(arg) 返回false，那么代码将执行：</span></span>
<span class="line"><span style="color:#E1E4E8;">  	</span><span style="color:#6A737D;">//		acquireQueued(addWaiter(Node.EXCLUSIVE), arg)，</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 这个方法，首先需要执行：addWaiter(Node.EXCLUSIVE)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * Creates and enqueues node for current thread and given mode.</span></span>
<span class="line"><span style="color:#6A737D;">     *</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#FFAB70;">mode</span><span style="color:#6A737D;"> Node.EXCLUSIVE for exclusive, Node.SHARED for shared</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@return</span><span style="color:#6A737D;"> the new node</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 此方法的作用是把线程包装成node，同时进入到队列中</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 参数mode此时是Node.EXCLUSIVE，代表独占模式</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> Node </span><span style="color:#B392F0;">addWaiter</span><span style="color:#E1E4E8;">(Node </span><span style="color:#FFAB70;">mode</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        Node node </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Node</span><span style="color:#E1E4E8;">(Thread.</span><span style="color:#B392F0;">currentThread</span><span style="color:#E1E4E8;">(), mode);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// Try the fast path of enq; backup to full enq on failure</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 以下几行代码想把当前node加到链表的最后面去，也就是进到阻塞队列的最后</span></span>
<span class="line"><span style="color:#E1E4E8;">        Node pred </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> tail;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// tail!=null =&gt; 队列不为空(tail==head的时候，其实队列是空的，不过不管这个吧)</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (pred </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">) { </span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 将当前的队尾节点，设置为自己的前驱 </span></span>
<span class="line"><span style="color:#E1E4E8;">            node.prev </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> pred; </span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 用CAS把自己设置为队尾, 如果成功后，tail == node 了，这个节点成为阻塞队列新的尾巴</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#B392F0;">compareAndSetTail</span><span style="color:#E1E4E8;">(pred, node)) { </span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 进到这里说明设置成功，当前node==tail, 将自己与之前的队尾相连，</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 上面已经有 node.prev = pred，加上下面这句，也就实现了和之前的尾节点双向连接了</span></span>
<span class="line"><span style="color:#E1E4E8;">                pred.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 线程入队了，可以返回了</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 仔细看看上面的代码，如果会到这里，</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 说明 pred==null(队列是空的) 或者 CAS失败(有线程在竞争入队)</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 读者一定要跟上思路，如果没有跟上，建议先不要往下读了，往回仔细看，否则会浪费时间的</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">enq</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * Inserts node into queue, initializing if necessary. See picture above.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#FFAB70;">node</span><span style="color:#6A737D;"> the node to insert</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@return</span><span style="color:#6A737D;"> node&#39;s predecessor</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 采用自旋的方式入队</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 之前说过，到这个方法只有两种可能：等待队列为空，或者有线程竞争入队，</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 自旋在这边的语义是：CAS设置tail过程中，竞争一次竞争不到，我就多次竞争，总会排到的</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> Node </span><span style="color:#B392F0;">enq</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> Node </span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (;;) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            Node t </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> tail;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 之前说过，队列为空也会进来这里</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (t </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">) { </span><span style="color:#6A737D;">// Must initialize</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 初始化head节点</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 细心的读者会知道原来 head 和 tail 初始化的时候都是 null 的</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 还是一步CAS，你懂的，现在可能是很多线程同时进来呢</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#B392F0;">compareAndSetHead</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Node</span><span style="color:#E1E4E8;">()))</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#6A737D;">// 给后面用：这个时候head节点的waitStatus==0, 看new Node()构造方法就知道了</span></span>
<span class="line"><span style="color:#E1E4E8;">                  </span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#6A737D;">// 这个时候有了head，但是tail还是null，设置一下，</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#6A737D;">// 把tail指向head，放心，马上就有线程要来了，到时候tail就要被抢了</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#6A737D;">// 注意：这里只是设置了tail=head，这里可没return哦，没有return，没有return</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#6A737D;">// 所以，设置完了以后，继续for循环，下次就到下面的else分支了</span></span>
<span class="line"><span style="color:#E1E4E8;">                    tail </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> head;</span></span>
<span class="line"><span style="color:#E1E4E8;">            } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 下面几行，和上一个方法 addWaiter 是一样的，</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 只是这个套在无限循环里，反正就是将当前线程排到队尾，有线程竞争的话排不上重复排</span></span>
<span class="line"><span style="color:#E1E4E8;">                node.prev </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> t;</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#B392F0;">compareAndSetTail</span><span style="color:#E1E4E8;">(t, node)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    t.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> t;</span></span>
<span class="line"><span style="color:#E1E4E8;">                }</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 现在，又回到这段代码了</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// if (!tryAcquire(arg) </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">//        &amp;&amp; acquireQueued(addWaiter(Node.EXCLUSIVE), arg)) </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">//     selfInterrupt();</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 下面这个方法，参数node，经过addWaiter(Node.EXCLUSIVE)，此时已经进入阻塞队列</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 注意一下：如果acquireQueued(addWaiter(Node.EXCLUSIVE), arg))返回true的话，</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 意味着上面这段代码将进入selfInterrupt()，所以正常情况下，下面应该返回false</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 这个方法非常重要，应该说真正的线程挂起，然后被唤醒后去获取锁，都在这个方法里了</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">acquireQueued</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> Node </span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> </span><span style="color:#FFAB70;">arg</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> failed </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">try</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> interrupted </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (;;) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> Node p </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node.</span><span style="color:#B392F0;">predecessor</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// p == head 说明当前节点虽然进到了阻塞队列，但是是阻塞队列的第一个，因为它的前驱是head</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 注意，阻塞队列不包含head节点，head一般指的是占有锁的线程，head后面的才称为阻塞队列</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 所以当前节点可以去试抢一下锁</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 这里我们说一下，为什么可以去试试：</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 首先，它是队头，这个是第一个条件，其次，当前的head有可能是刚刚初始化的node，</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// enq(node) 方法里面有提到，head是延时初始化的，而且new Node()的时候没有设置任何线程</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 也就是说，当前的head不属于任何一个线程，所以作为队头，可以去试一试，</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// tryAcquire已经分析过了, 忘记了请往前看一下，就是简单用CAS试操作一下state</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (p </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> head </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">tryAcquire</span><span style="color:#E1E4E8;">(arg)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#B392F0;">setHead</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"><span style="color:#E1E4E8;">                    p.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">; </span><span style="color:#6A737D;">// help GC</span></span>
<span class="line"><span style="color:#E1E4E8;">                    failed </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> interrupted;</span></span>
<span class="line"><span style="color:#E1E4E8;">                }</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 到这里，说明上面的if分支没有成功，要么当前node本来就不是队头，</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 要么就是tryAcquire(arg)没有抢赢别人，继续往下看</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#B392F0;">shouldParkAfterFailedAcquire</span><span style="color:#E1E4E8;">(p, node) </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#B392F0;">parkAndCheckInterrupt</span><span style="color:#E1E4E8;">())</span></span>
<span class="line"><span style="color:#E1E4E8;">                    interrupted </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">finally</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 什么时候 failed 会为 true???</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// tryAcquire() 方法抛异常的情况</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (failed)</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#B392F0;">cancelAcquire</span><span style="color:#E1E4E8;">(node);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * Checks and updates status for a node that failed to acquire.</span></span>
<span class="line"><span style="color:#6A737D;">     * Returns true if thread should block. This is the main signal</span></span>
<span class="line"><span style="color:#6A737D;">     * control in all acquire loops.  Requires that pred == node.prev</span></span>
<span class="line"><span style="color:#6A737D;">     *</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#FFAB70;">pred</span><span style="color:#6A737D;"> node&#39;s predecessor holding status</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#FFAB70;">node</span><span style="color:#6A737D;"> the node</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#F97583;">@return</span><span style="color:#6A737D;"> {@code true} if thread should block</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 刚刚说过，会到这里就是没有抢到锁呗，这个方法说的是：&quot;当前线程没有抢到锁，是否需要挂起当前线程？&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 第一个参数是前驱节点，第二个参数才是代表当前线程的节点</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">static</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">shouldParkAfterFailedAcquire</span><span style="color:#E1E4E8;">(Node </span><span style="color:#FFAB70;">pred</span><span style="color:#E1E4E8;">, Node </span><span style="color:#FFAB70;">node</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> ws </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> pred.waitStatus;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 前驱节点的 waitStatus == -1 ，说明前驱节点状态正常，当前线程需要挂起，直接可以返回true</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (ws </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> Node.SIGNAL)</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">             * This node has already set status asking a release</span></span>
<span class="line"><span style="color:#6A737D;">             * to signal it, so it can safely park.</span></span>
<span class="line"><span style="color:#6A737D;">             */</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 前驱节点 waitStatus大于0 ，之前说过，大于0 说明前驱节点取消了排队。</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 这里需要知道这点：进入阻塞队列排队的线程会被挂起，而唤醒的操作是由前驱节点完成的。</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 所以下面这块代码说的是将当前节点的prev指向waitStatus&lt;=0的节点，</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 简单说，就是为了找个好爹，因为你还得依赖它来唤醒呢，如果前驱节点取消了排队，</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 找前驱节点的前驱节点做爹，往前遍历总能找到一个好爹的</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (ws </span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">             * Predecessor was cancelled. Skip over predecessors and</span></span>
<span class="line"><span style="color:#6A737D;">             * indicate retry.</span></span>
<span class="line"><span style="color:#6A737D;">             */</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">do</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">                node.prev </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> pred </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> pred.prev;</span></span>
<span class="line"><span style="color:#E1E4E8;">            } </span><span style="color:#F97583;">while</span><span style="color:#E1E4E8;"> (pred.waitStatus </span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">            pred.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">             * waitStatus must be 0 or PROPAGATE.  Indicate that we</span></span>
<span class="line"><span style="color:#6A737D;">             * need a signal, but don&#39;t park yet.  Caller will need to</span></span>
<span class="line"><span style="color:#6A737D;">             * retry to make sure it cannot acquire before parking.</span></span>
<span class="line"><span style="color:#6A737D;">             */</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 仔细想想，如果进入到这个分支意味着什么</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 前驱节点的waitStatus不等于-1和1，那也就是只可能是0，-2，-3</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 在我们前面的源码中，都没有看到有设置waitStatus的，所以每个新的node入队时，waitStatu都是0</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 正常情况下，前驱节点是之前的 tail，那么它的 waitStatus 应该是 0</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 用CAS将前驱节点的waitStatus设置为Node.SIGNAL(也就是-1)</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">compareAndSetWaitStatus</span><span style="color:#E1E4E8;">(pred, ws, Node.SIGNAL);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 这个方法返回 false，那么会再走一次 for 循序，</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">//     然后再次进来此方法，此时会从第一个分支返回 true</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// private static boolean shouldParkAfterFailedAcquire(Node pred, Node node)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 这个方法结束根据返回值我们简单分析下：</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 如果返回true, 说明前驱节点的waitStatus==-1，是正常情况，那么当前线程需要被挂起，等待以后被唤醒</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">//		我们也说过，以后是被前驱节点唤醒，就等着前驱节点拿到锁，然后释放锁的时候叫你好了</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 如果返回false, 说明当前不需要被挂起，为什么呢？往后看</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 跳回到前面是这个方法</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// if (shouldParkAfterFailedAcquire(p, node) &amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">//                parkAndCheckInterrupt())</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">//                interrupted = true;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 1. 如果shouldParkAfterFailedAcquire(p, node)返回true，</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 那么需要执行parkAndCheckInterrupt():</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 这个方法很简单，因为前面返回true，所以需要挂起线程，这个方法就是负责挂起线程的</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 这里用了LockSupport.park(this)来挂起线程，然后就停在这里了，等待被唤醒=======</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">parkAndCheckInterrupt</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        LockSupport.</span><span style="color:#B392F0;">park</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> Thread.</span><span style="color:#B392F0;">interrupted</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 2. 接下来说说如果shouldParkAfterFailedAcquire(p, node)返回false的情况</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;">// 仔细看shouldParkAfterFailedAcquire(p, node)，我们可以发现，其实第一次进来的时候，一般都不会返回true的，原因很简单，前驱节点的waitStatus=-1是依赖于后继节点设置的。也就是说，我都还没给前驱设置-1呢，怎么可能是true呢，但是要看到，这个方法是套在循环里的，所以第二次进来的时候状态就是-1了。</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 解释下为什么shouldParkAfterFailedAcquire(p, node)返回false的时候不直接挂起线程：</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// =&gt; 是为了应对在经过这个方法后，node已经是head的直接后继节点了。剩下的读者自己想想吧。</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">FairSync</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">extends</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Sync</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">long</span><span style="color:#24292E;"> serialVersionUID </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">3000897897090466540L</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  	</span><span style="color:#6A737D;">// 争锁</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">lock</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">acquire</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  	</span><span style="color:#6A737D;">// 来自父类AQS，我直接贴过来这边，下面分析的时候同样会这样做，不会给读者带来阅读压力</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 我们看到，这个方法，如果tryAcquire(arg) 返回true, 也就结束了。</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 否则，acquireQueued方法会将线程压到队列中</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">acquire</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">arg</span><span style="color:#24292E;">) { </span><span style="color:#6A737D;">// 此时 arg == 1</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 首先调用tryAcquire(1)一下，名字上就知道，这个只是试一试</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 因为有可能直接就成功了呢，也就不需要进队列排队了，</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 对于公平锁的语义就是：本来就没人持有锁，根本没必要进队列等待(又是挂起，又是等待被唤醒的)</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#6F42C1;">tryAcquire</span><span style="color:#24292E;">(arg) </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// tryAcquire(arg)没有成功，这个时候需要把当前线程挂起，放到阻塞队列中。</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">acquireQueued</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">addWaiter</span><span style="color:#24292E;">(Node.EXCLUSIVE), arg)) {</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">selfInterrupt</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * Fair version of tryAcquire.  Don&#39;t grant access unless</span></span>
<span class="line"><span style="color:#6A737D;">     * recursive call or no waiters or is first.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 尝试直接获取锁，返回值是boolean，代表是否获取到锁</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 返回true：1.没有线程在等待锁；2.重入锁，线程本来就持有锁，也就可以理所当然可以直接获取</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">protected</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">tryAcquire</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">acquires</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> Thread current </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Thread.</span><span style="color:#6F42C1;">currentThread</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> c </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getState</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// state == 0 此时此刻没有线程持有锁</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (c </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 虽然此时此刻锁是可以用的，但是这是公平锁，既然是公平，就得讲究先来后到，</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 看看有没有别人在队列中等了半天了</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#6F42C1;">hasQueuedPredecessors</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 如果没有线程在等待，那就用CAS尝试一下，成功了就获取到锁了，</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 不成功的话，只能说明一个问题，就在刚刚几乎同一时刻有个线程抢先了 =_=</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 因为刚刚还没人的，我判断过了</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">compareAndSetState</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, acquires)) {</span></span>
<span class="line"><span style="color:#24292E;">              </span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 到这里就是获取到锁了，标记一下，告诉大家，现在是我占用了锁</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">setExclusiveOwnerThread</span><span style="color:#24292E;">(current);</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">      	</span><span style="color:#6A737D;">// 会进入这个else if分支，说明是重入了，需要操作：state=state+1</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 这里不存在并发问题</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (current </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getExclusiveOwnerThread</span><span style="color:#24292E;">()) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> nextc </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> c </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> acquires;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (nextc </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Error</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Maximum lock count exceeded&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">setState</span><span style="color:#24292E;">(nextc);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 如果到这里，说明前面的if和else if都没有返回true，说明没有获取到锁</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 回到上面一个外层调用方法继续看:</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// if (!tryAcquire(arg) </span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//        &amp;&amp; acquireQueued(addWaiter(Node.EXCLUSIVE), arg)) </span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//     selfInterrupt();</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 假设tryAcquire(arg) 返回false，那么代码将执行：</span></span>
<span class="line"><span style="color:#24292E;">  	</span><span style="color:#6A737D;">//		acquireQueued(addWaiter(Node.EXCLUSIVE), arg)，</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 这个方法，首先需要执行：addWaiter(Node.EXCLUSIVE)</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * Creates and enqueues node for current thread and given mode.</span></span>
<span class="line"><span style="color:#6A737D;">     *</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E36209;">mode</span><span style="color:#6A737D;"> Node.EXCLUSIVE for exclusive, Node.SHARED for shared</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@return</span><span style="color:#6A737D;"> the new node</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 此方法的作用是把线程包装成node，同时进入到队列中</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 参数mode此时是Node.EXCLUSIVE，代表独占模式</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> Node </span><span style="color:#6F42C1;">addWaiter</span><span style="color:#24292E;">(Node </span><span style="color:#E36209;">mode</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        Node node </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Node</span><span style="color:#24292E;">(Thread.</span><span style="color:#6F42C1;">currentThread</span><span style="color:#24292E;">(), mode);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// Try the fast path of enq; backup to full enq on failure</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 以下几行代码想把当前node加到链表的最后面去，也就是进到阻塞队列的最后</span></span>
<span class="line"><span style="color:#24292E;">        Node pred </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tail;</span></span>
<span class="line"><span style="color:#24292E;">      </span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// tail!=null =&gt; 队列不为空(tail==head的时候，其实队列是空的，不过不管这个吧)</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pred </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">) { </span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 将当前的队尾节点，设置为自己的前驱 </span></span>
<span class="line"><span style="color:#24292E;">            node.prev </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pred; </span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 用CAS把自己设置为队尾, 如果成功后，tail == node 了，这个节点成为阻塞队列新的尾巴</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">compareAndSetTail</span><span style="color:#24292E;">(pred, node)) { </span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 进到这里说明设置成功，当前node==tail, 将自己与之前的队尾相连，</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 上面已经有 node.prev = pred，加上下面这句，也就实现了和之前的尾节点双向连接了</span></span>
<span class="line"><span style="color:#24292E;">                pred.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 线程入队了，可以返回了</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 仔细看看上面的代码，如果会到这里，</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 说明 pred==null(队列是空的) 或者 CAS失败(有线程在竞争入队)</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 读者一定要跟上思路，如果没有跟上，建议先不要往下读了，往回仔细看，否则会浪费时间的</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">enq</span><span style="color:#24292E;">(node);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * Inserts node into queue, initializing if necessary. See picture above.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E36209;">node</span><span style="color:#6A737D;"> the node to insert</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@return</span><span style="color:#6A737D;"> node&#39;s predecessor</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 采用自旋的方式入队</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 之前说过，到这个方法只有两种可能：等待队列为空，或者有线程竞争入队，</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 自旋在这边的语义是：CAS设置tail过程中，竞争一次竞争不到，我就多次竞争，总会排到的</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> Node </span><span style="color:#6F42C1;">enq</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> Node </span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (;;) {</span></span>
<span class="line"><span style="color:#24292E;">            Node t </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tail;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 之前说过，队列为空也会进来这里</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (t </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">) { </span><span style="color:#6A737D;">// Must initialize</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 初始化head节点</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 细心的读者会知道原来 head 和 tail 初始化的时候都是 null 的</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 还是一步CAS，你懂的，现在可能是很多线程同时进来呢</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">compareAndSetHead</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Node</span><span style="color:#24292E;">()))</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6A737D;">// 给后面用：这个时候head节点的waitStatus==0, 看new Node()构造方法就知道了</span></span>
<span class="line"><span style="color:#24292E;">                  </span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6A737D;">// 这个时候有了head，但是tail还是null，设置一下，</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6A737D;">// 把tail指向head，放心，马上就有线程要来了，到时候tail就要被抢了</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6A737D;">// 注意：这里只是设置了tail=head，这里可没return哦，没有return，没有return</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6A737D;">// 所以，设置完了以后，继续for循环，下次就到下面的else分支了</span></span>
<span class="line"><span style="color:#24292E;">                    tail </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">            } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 下面几行，和上一个方法 addWaiter 是一样的，</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 只是这个套在无限循环里，反正就是将当前线程排到队尾，有线程竞争的话排不上重复排</span></span>
<span class="line"><span style="color:#24292E;">                node.prev </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> t;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">compareAndSetTail</span><span style="color:#24292E;">(t, node)) {</span></span>
<span class="line"><span style="color:#24292E;">                    t.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> t;</span></span>
<span class="line"><span style="color:#24292E;">                }</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 现在，又回到这段代码了</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// if (!tryAcquire(arg) </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//        &amp;&amp; acquireQueued(addWaiter(Node.EXCLUSIVE), arg)) </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//     selfInterrupt();</span></span>
<span class="line"><span style="color:#24292E;">    </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 下面这个方法，参数node，经过addWaiter(Node.EXCLUSIVE)，此时已经进入阻塞队列</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 注意一下：如果acquireQueued(addWaiter(Node.EXCLUSIVE), arg))返回true的话，</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 意味着上面这段代码将进入selfInterrupt()，所以正常情况下，下面应该返回false</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 这个方法非常重要，应该说真正的线程挂起，然后被唤醒后去获取锁，都在这个方法里了</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">acquireQueued</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> Node </span><span style="color:#E36209;">node</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">arg</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> failed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">try</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> interrupted </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (;;) {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> Node p </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node.</span><span style="color:#6F42C1;">predecessor</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// p == head 说明当前节点虽然进到了阻塞队列，但是是阻塞队列的第一个，因为它的前驱是head</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 注意，阻塞队列不包含head节点，head一般指的是占有锁的线程，head后面的才称为阻塞队列</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 所以当前节点可以去试抢一下锁</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 这里我们说一下，为什么可以去试试：</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 首先，它是队头，这个是第一个条件，其次，当前的head有可能是刚刚初始化的node，</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// enq(node) 方法里面有提到，head是延时初始化的，而且new Node()的时候没有设置任何线程</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 也就是说，当前的head不属于任何一个线程，所以作为队头，可以去试一试，</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// tryAcquire已经分析过了, 忘记了请往前看一下，就是简单用CAS试操作一下state</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (p </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">tryAcquire</span><span style="color:#24292E;">(arg)) {</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6F42C1;">setHead</span><span style="color:#24292E;">(node);</span></span>
<span class="line"><span style="color:#24292E;">                    p.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">; </span><span style="color:#6A737D;">// help GC</span></span>
<span class="line"><span style="color:#24292E;">                    failed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> interrupted;</span></span>
<span class="line"><span style="color:#24292E;">                }</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 到这里，说明上面的if分支没有成功，要么当前node本来就不是队头，</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 要么就是tryAcquire(arg)没有抢赢别人，继续往下看</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">shouldParkAfterFailedAcquire</span><span style="color:#24292E;">(p, node) </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6F42C1;">parkAndCheckInterrupt</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">                    interrupted </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">finally</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 什么时候 failed 会为 true???</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// tryAcquire() 方法抛异常的情况</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (failed)</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">cancelAcquire</span><span style="color:#24292E;">(node);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * Checks and updates status for a node that failed to acquire.</span></span>
<span class="line"><span style="color:#6A737D;">     * Returns true if thread should block. This is the main signal</span></span>
<span class="line"><span style="color:#6A737D;">     * control in all acquire loops.  Requires that pred == node.prev</span></span>
<span class="line"><span style="color:#6A737D;">     *</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E36209;">pred</span><span style="color:#6A737D;"> node&#39;s predecessor holding status</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E36209;">node</span><span style="color:#6A737D;"> the node</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@return</span><span style="color:#6A737D;"> {@code true} if thread should block</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 刚刚说过，会到这里就是没有抢到锁呗，这个方法说的是：&quot;当前线程没有抢到锁，是否需要挂起当前线程？&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 第一个参数是前驱节点，第二个参数才是代表当前线程的节点</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">shouldParkAfterFailedAcquire</span><span style="color:#24292E;">(Node </span><span style="color:#E36209;">pred</span><span style="color:#24292E;">, Node </span><span style="color:#E36209;">node</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> ws </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pred.waitStatus;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 前驱节点的 waitStatus == -1 ，说明前驱节点状态正常，当前线程需要挂起，直接可以返回true</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (ws </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> Node.SIGNAL)</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">             * This node has already set status asking a release</span></span>
<span class="line"><span style="color:#6A737D;">             * to signal it, so it can safely park.</span></span>
<span class="line"><span style="color:#6A737D;">             */</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 前驱节点 waitStatus大于0 ，之前说过，大于0 说明前驱节点取消了排队。</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 这里需要知道这点：进入阻塞队列排队的线程会被挂起，而唤醒的操作是由前驱节点完成的。</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 所以下面这块代码说的是将当前节点的prev指向waitStatus&lt;=0的节点，</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 简单说，就是为了找个好爹，因为你还得依赖它来唤醒呢，如果前驱节点取消了排队，</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 找前驱节点的前驱节点做爹，往前遍历总能找到一个好爹的</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (ws </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">             * Predecessor was cancelled. Skip over predecessors and</span></span>
<span class="line"><span style="color:#6A737D;">             * indicate retry.</span></span>
<span class="line"><span style="color:#6A737D;">             */</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">do</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">                node.prev </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pred </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pred.prev;</span></span>
<span class="line"><span style="color:#24292E;">            } </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (pred.waitStatus </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">            pred.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">             * waitStatus must be 0 or PROPAGATE.  Indicate that we</span></span>
<span class="line"><span style="color:#6A737D;">             * need a signal, but don&#39;t park yet.  Caller will need to</span></span>
<span class="line"><span style="color:#6A737D;">             * retry to make sure it cannot acquire before parking.</span></span>
<span class="line"><span style="color:#6A737D;">             */</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 仔细想想，如果进入到这个分支意味着什么</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 前驱节点的waitStatus不等于-1和1，那也就是只可能是0，-2，-3</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 在我们前面的源码中，都没有看到有设置waitStatus的，所以每个新的node入队时，waitStatu都是0</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 正常情况下，前驱节点是之前的 tail，那么它的 waitStatus 应该是 0</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 用CAS将前驱节点的waitStatus设置为Node.SIGNAL(也就是-1)</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">compareAndSetWaitStatus</span><span style="color:#24292E;">(pred, ws, Node.SIGNAL);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 这个方法返回 false，那么会再走一次 for 循序，</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//     然后再次进来此方法，此时会从第一个分支返回 true</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// private static boolean shouldParkAfterFailedAcquire(Node pred, Node node)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 这个方法结束根据返回值我们简单分析下：</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 如果返回true, 说明前驱节点的waitStatus==-1，是正常情况，那么当前线程需要被挂起，等待以后被唤醒</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//		我们也说过，以后是被前驱节点唤醒，就等着前驱节点拿到锁，然后释放锁的时候叫你好了</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 如果返回false, 说明当前不需要被挂起，为什么呢？往后看</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 跳回到前面是这个方法</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// if (shouldParkAfterFailedAcquire(p, node) &amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//                parkAndCheckInterrupt())</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//                interrupted = true;</span></span>
<span class="line"><span style="color:#24292E;">    </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 1. 如果shouldParkAfterFailedAcquire(p, node)返回true，</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 那么需要执行parkAndCheckInterrupt():</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 这个方法很简单，因为前面返回true，所以需要挂起线程，这个方法就是负责挂起线程的</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 这里用了LockSupport.park(this)来挂起线程，然后就停在这里了，等待被唤醒=======</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">parkAndCheckInterrupt</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        LockSupport.</span><span style="color:#6F42C1;">park</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> Thread.</span><span style="color:#6F42C1;">interrupted</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 2. 接下来说说如果shouldParkAfterFailedAcquire(p, node)返回false的情况</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;">// 仔细看shouldParkAfterFailedAcquire(p, node)，我们可以发现，其实第一次进来的时候，一般都不会返回true的，原因很简单，前驱节点的waitStatus=-1是依赖于后继节点设置的。也就是说，我都还没给前驱设置-1呢，怎么可能是true呢，但是要看到，这个方法是套在循环里的，所以第二次进来的时候状态就是-1了。</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 解释下为什么shouldParkAfterFailedAcquire(p, node)返回false的时候不直接挂起线程：</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// =&gt; 是为了应对在经过这个方法后，node已经是head的直接后继节点了。剩下的读者自己想想吧。</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>说到这里，也就明白了，多看几遍 <code>final boolean acquireQueued(final Node node, int arg)</code> 这个方法吧。自己推演下各个分支怎么走，哪种情况下会发生什么，走到哪里。</p><h2 id="解锁操作" tabindex="-1">解锁操作 <a class="header-anchor" href="#解锁操作" aria-label="Permalink to &quot;解锁操作&quot;">​</a></h2><p>最后，就是还需要介绍下唤醒的动作了。我们知道，正常情况下，如果线程没获取到锁，线程会被 <code>LockSupport.park(this);</code> 挂起停止，等待被唤醒。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// 唤醒的代码还是比较简单的，你如果上面加锁的都看懂了，下面都不需要看就知道怎么回事了</span></span>
<span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">unlock</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    sync.</span><span style="color:#B392F0;">release</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">release</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> arg) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 往后看吧</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#B392F0;">tryRelease</span><span style="color:#E1E4E8;">(arg)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        Node h </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> head;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (h </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> h.waitStatus </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">unparkSuccessor</span><span style="color:#E1E4E8;">(h);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 回到ReentrantLock看tryRelease方法</span></span>
<span class="line"><span style="color:#F97583;">protected</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">tryRelease</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> releases) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> c </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getState</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;"> releases;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (Thread.</span><span style="color:#B392F0;">currentThread</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getExclusiveOwnerThread</span><span style="color:#E1E4E8;">())</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">IllegalMonitorStateException</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 是否完全释放锁</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> free </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 其实就是重入的问题，如果c==0，也就是说没有嵌套锁了，可以释放了，否则还不能释放掉</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (c </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        free </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">setExclusiveOwnerThread</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">setState</span><span style="color:#E1E4E8;">(c);</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> free;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Wakes up node&#39;s successor, if one exists.</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#FFAB70;">node</span><span style="color:#6A737D;"> the node</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#6A737D;">// 唤醒后继节点</span></span>
<span class="line"><span style="color:#6A737D;">// 从上面调用处知道，参数node是head头结点</span></span>
<span class="line"><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">void</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">unparkSuccessor</span><span style="color:#E1E4E8;">(Node node) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">     * If status is negative (i.e., possibly needing signal) try</span></span>
<span class="line"><span style="color:#6A737D;">     * to clear in anticipation of signalling.  It is OK if this</span></span>
<span class="line"><span style="color:#6A737D;">     * fails or if status is changed by waiting thread.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> ws </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node.waitStatus;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 如果head节点当前waitStatus&lt;0, 将其修改为0</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (ws </span><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">compareAndSetWaitStatus</span><span style="color:#E1E4E8;">(node, ws, </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">     * Thread to unpark is held in successor, which is normally</span></span>
<span class="line"><span style="color:#6A737D;">     * just the next node.  But if cancelled or apparently null,</span></span>
<span class="line"><span style="color:#6A737D;">     * traverse backwards from tail to find the actual</span></span>
<span class="line"><span style="color:#6A737D;">     * non-cancelled successor.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 下面的代码就是唤醒后继节点，但是有可能后继节点取消了等待（waitStatus==1）</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 从队尾往前找，找到waitStatus&lt;=0的所有节点中排在最前面的</span></span>
<span class="line"><span style="color:#E1E4E8;">    Node s </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node.next;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (s </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">||</span><span style="color:#E1E4E8;"> s.waitStatus </span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        s </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 从后往前找，仔细看代码，不必担心中间有节点取消(waitStatus==1)的情况</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (Node t </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> tail; t </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> t </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> node; t </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> t.prev)</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (t.waitStatus </span><span style="color:#F97583;">&lt;=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">                s </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> t;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (s </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 唤醒线程</span></span>
<span class="line"><span style="color:#E1E4E8;">        LockSupport.</span><span style="color:#B392F0;">unpark</span><span style="color:#E1E4E8;">(s.thread);</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// 唤醒的代码还是比较简单的，你如果上面加锁的都看懂了，下面都不需要看就知道怎么回事了</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">unlock</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    sync.</span><span style="color:#6F42C1;">release</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">release</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> arg) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 往后看吧</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">tryRelease</span><span style="color:#24292E;">(arg)) {</span></span>
<span class="line"><span style="color:#24292E;">        Node h </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (h </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> h.waitStatus </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">unparkSuccessor</span><span style="color:#24292E;">(h);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 回到ReentrantLock看tryRelease方法</span></span>
<span class="line"><span style="color:#D73A49;">protected</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">tryRelease</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> releases) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> c </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getState</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> releases;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (Thread.</span><span style="color:#6F42C1;">currentThread</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getExclusiveOwnerThread</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">IllegalMonitorStateException</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 是否完全释放锁</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> free </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 其实就是重入的问题，如果c==0，也就是说没有嵌套锁了，可以释放了，否则还不能释放掉</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (c </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        free </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">setExclusiveOwnerThread</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">null</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setState</span><span style="color:#24292E;">(c);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> free;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Wakes up node&#39;s successor, if one exists.</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E36209;">node</span><span style="color:#6A737D;"> the node</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#6A737D;">// 唤醒后继节点</span></span>
<span class="line"><span style="color:#6A737D;">// 从上面调用处知道，参数node是head头结点</span></span>
<span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">unparkSuccessor</span><span style="color:#24292E;">(Node node) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">     * If status is negative (i.e., possibly needing signal) try</span></span>
<span class="line"><span style="color:#6A737D;">     * to clear in anticipation of signalling.  It is OK if this</span></span>
<span class="line"><span style="color:#6A737D;">     * fails or if status is changed by waiting thread.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> ws </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node.waitStatus;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 如果head节点当前waitStatus&lt;0, 将其修改为0</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (ws </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">compareAndSetWaitStatus</span><span style="color:#24292E;">(node, ws, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">/*</span></span>
<span class="line"><span style="color:#6A737D;">     * Thread to unpark is held in successor, which is normally</span></span>
<span class="line"><span style="color:#6A737D;">     * just the next node.  But if cancelled or apparently null,</span></span>
<span class="line"><span style="color:#6A737D;">     * traverse backwards from tail to find the actual</span></span>
<span class="line"><span style="color:#6A737D;">     * non-cancelled successor.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 下面的代码就是唤醒后继节点，但是有可能后继节点取消了等待（waitStatus==1）</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 从队尾往前找，找到waitStatus&lt;=0的所有节点中排在最前面的</span></span>
<span class="line"><span style="color:#24292E;">    Node s </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node.next;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (s </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> s.waitStatus </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        s </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 从后往前找，仔细看代码，不必担心中间有节点取消(waitStatus==1)的情况</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (Node t </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tail; t </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> t </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> node; t </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> t.prev)</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (t.waitStatus </span><span style="color:#D73A49;">&lt;=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">                s </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> t;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (s </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 唤醒线程</span></span>
<span class="line"><span style="color:#24292E;">        LockSupport.</span><span style="color:#6F42C1;">unpark</span><span style="color:#24292E;">(s.thread);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>唤醒线程以后，被唤醒的线程将从以下代码中继续往前走：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">parkAndCheckInterrupt</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    LockSupport.</span><span style="color:#B392F0;">park</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">); </span><span style="color:#6A737D;">// 刚刚线程被挂起在这里了</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> Thread.</span><span style="color:#B392F0;">interrupted</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#6A737D;">// 又回到这个方法了：acquireQueued(final Node node, int arg)，这个时候，node的前驱是head了</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">parkAndCheckInterrupt</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    LockSupport.</span><span style="color:#6F42C1;">park</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">); </span><span style="color:#6A737D;">// 刚刚线程被挂起在这里了</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> Thread.</span><span style="color:#6F42C1;">interrupted</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6A737D;">// 又回到这个方法了：acquireQueued(final Node node, int arg)，这个时候，node的前驱是head了</span></span></code></pre></div><p>好了，后面就不分析源码了，剩下的还有问题自己去仔细看看代码吧。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>总结一下吧。</p><p>在并发环境下，加锁和解锁需要以下三个部件的协调：</p><ol><li>锁状态。我们要知道锁是不是被别的线程占有了，这个就是 state 的作用，它为 0 的时候代表没有线程占有锁，可以去争抢这个锁，用 CAS 将 state 设为 1，如果 CAS 成功，说明抢到了锁，这样其他线程就抢不到了，如果锁重入的话，state进行 +1 就可以，解锁就是减 1，直到 state 又变为 0，代表释放锁，所以 lock() 和 unlock() 必须要配对啊。然后唤醒等待队列中的第一个线程，让其来占有锁。</li><li>线程的阻塞和解除阻塞。AQS 中采用了 LockSupport.park(thread) 来挂起线程，用 unpark 来唤醒线程。</li><li>阻塞队列。因为争抢锁的线程可能很多，但是只能有一个线程拿到锁，其他的线程都必须等待，这个时候就需要一个 queue 来管理这些线程，AQS 用的是一个 FIFO 的队列，就是一个链表，每个 node 都持有后继节点的引用。AQS 采用了 CLH 锁的变体来实现，感兴趣的读者可以参考这篇文章<a href="http://coderbee.net/index.php/concurrent/20131115/577" target="_blank" rel="noreferrer">关于CLH的介绍</a>，写得简单明了。</li></ol><h2 id="示例图解析" tabindex="-1">示例图解析 <a class="header-anchor" href="#示例图解析" aria-label="Permalink to &quot;示例图解析&quot;">​</a></h2><p>下面属于回顾环节，用简单的示例来说一遍，如果上面的有些东西没看懂，这里还有一次帮助你理解的机会。</p><p>首先，第一个线程调用 reentrantLock.lock()，翻到最前面可以发现，tryAcquire(1) 直接就返回 true 了，结束。只是设置了 state=1，连 head 都没有初始化，更谈不上什么阻塞队列了。要是线程 1 调用 unlock() 了，才有线程 2 来，那世界就太太太平了，完全没有交集嘛，那我还要 AQS 干嘛。</p><p>如果线程 1 没有调用 unlock() 之前，线程 2 调用了 lock(), 想想会发生什么？</p><p>线程 2 会初始化 head【new Node()】，同时线程 2 也会插入到阻塞队列并挂起 (注意看这里是一个 for 循环，而且设置 head 和 tail 的部分是不 return 的，只有入队成功才会跳出循环)</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> Node </span><span style="color:#B392F0;">enq</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">final</span><span style="color:#E1E4E8;"> Node node) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (;;) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        Node t </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> tail;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (t </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">) { </span><span style="color:#6A737D;">// Must initialize</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#B392F0;">compareAndSetHead</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Node</span><span style="color:#E1E4E8;">()))</span></span>
<span class="line"><span style="color:#E1E4E8;">                tail </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> head;</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            node.prev </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> t;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#B392F0;">compareAndSetTail</span><span style="color:#E1E4E8;">(t, node)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                t.next </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> node;</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> t;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> Node </span><span style="color:#6F42C1;">enq</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> Node node) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (;;) {</span></span>
<span class="line"><span style="color:#24292E;">        Node t </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tail;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (t </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">) { </span><span style="color:#6A737D;">// Must initialize</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">compareAndSetHead</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Node</span><span style="color:#24292E;">()))</span></span>
<span class="line"><span style="color:#24292E;">                tail </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            node.prev </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> t;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">compareAndSetTail</span><span style="color:#24292E;">(t, node)) {</span></span>
<span class="line"><span style="color:#24292E;">                t.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> node;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> t;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>首先，是线程 2 初始化 head 节点，此时 head==tail, waitStatus==0</p><p><img src="https://www.javadoop.com/blogimages/AbstractQueuedSynchronizer/aqs-1.png" alt="aqs-1"></p><p>然后线程 2 入队：</p><p><img src="https://www.javadoop.com/blogimages/AbstractQueuedSynchronizer/aqs-2.png" alt="aqs-2"></p><p>同时我们也要看此时节点的 waitStatus，我们知道 head 节点是线程 2 初始化的，此时的 waitStatus 没有设置， java 默认会设置为 0，但是到 shouldParkAfterFailedAcquire 这个方法的时候，线程 2 会把前驱节点，也就是 head 的waitStatus设置为 -1。</p><p>那线程 2 节点此时的 waitStatus 是多少呢，由于没有设置，所以是 0；</p><p>如果线程 3 此时再进来，直接插到线程 2 的后面就可以了，此时线程 3 的 waitStatus 是 0，到 shouldParkAfterFailedAcquire 方法的时候把前驱节点线程 2 的 waitStatus 设置为 -1。</p><p><img src="https://www.javadoop.com/blogimages/AbstractQueuedSynchronizer/aqs-3.png" alt="aqs-3"></p><p>这里可以简单说下 waitStatus 中 SIGNAL(-1) 状态的意思，Doug Lea 注释的是：代表后继节点需要被唤醒。也就是说这个 waitStatus 其实代表的不是自己的状态，而是后继节点的状态，我们知道，每个 node 在入队的时候，都会把前驱节点的状态改为 SIGNAL，然后阻塞，等待被前驱唤醒。这里涉及的是两个问题：有线程取消了排队、唤醒操作。其实本质是一样的，读者也可以顺着 “waitStatus代表后继节点的状态” 这种思路去看一遍源码。</p>`,51),e=[o];function c(t,r,E,y,i,A){return n(),a("div",null,e)}const u=s(p,[["render",c]]);export{D as __pageData,u as default};
