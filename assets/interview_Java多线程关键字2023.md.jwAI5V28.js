import{_ as s,o as n,c as a,R as e}from"./chunks/framework.7FlijoJG.js";const g=JSON.parse('{"title":"Java多线程关键字","description":"","frontmatter":{"title":"Java多线程关键字","date":"2023-12-22T13:41:29.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"interview/Java多线程关键字2023.md","filePath":"interview/Java多线程关键字2023.md","lastUpdated":1703255611000}'),l={name:"interview/Java多线程关键字2023.md"},p=e(`<h2 id="线程创建的方法" tabindex="-1">线程创建的方法 <a class="header-anchor" href="#线程创建的方法" aria-label="Permalink to &quot;线程创建的方法&quot;">​</a></h2><h3 id="线程创建的方法有几种" tabindex="-1">线程创建的方法有几种： <a class="header-anchor" href="#线程创建的方法有几种" aria-label="Permalink to &quot;线程创建的方法有几种：&quot;">​</a></h3><ol><li><code>通过继承Thread类</code>: 这种方式需要重写 Thread 类中的 run 方法，run 方法的方法体就是对应线程需要执行的任务。创建的线程并不会立即执行，需调用 start 方法才会执行。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">new Thread(){</span></span>
<span class="line"><span style="color:#e1e4e8;">    public void run(){</span></span>
<span class="line"><span style="color:#e1e4e8;">        // 执行代码</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}.start();</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">new Thread(){</span></span>
<span class="line"><span style="color:#24292e;">    public void run(){</span></span>
<span class="line"><span style="color:#24292e;">        // 执行代码</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}.start();</span></span></code></pre></div><ol start="2"><li><code>通过实现Runnable接口</code>: 创建一个新的类实现 Runnable 接口，然后实现它的 run 方法，将 Runnable 实例传给 Thread 类的构造方法，就可以启动新线程并执行 run 方法。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">Runnable runnable = new Runnable(){</span></span>
<span class="line"><span style="color:#e1e4e8;">    @Override</span></span>
<span class="line"><span style="color:#e1e4e8;">    public void run(){</span></span>
<span class="line"><span style="color:#e1e4e8;">        // 执行代码</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">};</span></span>
<span class="line"><span style="color:#e1e4e8;">new Thread(runnable).start();</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">Runnable runnable = new Runnable(){</span></span>
<span class="line"><span style="color:#24292e;">    @Override</span></span>
<span class="line"><span style="color:#24292e;">    public void run(){</span></span>
<span class="line"><span style="color:#24292e;">        // 执行代码</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">};</span></span>
<span class="line"><span style="color:#24292e;">new Thread(runnable).start();</span></span></code></pre></div><ol start="3"><li><code>通过实现Callable和Future创建线程</code>: 这种方式的优势就在于可以有返回值。Future 就像一个凭证，在将来的某个时间点获取结果。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">Callable&lt;Integer&gt; callable = new Callable&lt;Integer&gt;() {</span></span>
<span class="line"><span style="color:#e1e4e8;">    public Integer call() throws Exception {</span></span>
<span class="line"><span style="color:#e1e4e8;">        // 执行代码并返回结果</span></span>
<span class="line"><span style="color:#e1e4e8;">        return 0;</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">};</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">FutureTask&lt;Integer&gt; future = new FutureTask&lt;&gt;(callable);</span></span>
<span class="line"><span style="color:#e1e4e8;">new Thread(future).start();</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">Callable&lt;Integer&gt; callable = new Callable&lt;Integer&gt;() {</span></span>
<span class="line"><span style="color:#24292e;">    public Integer call() throws Exception {</span></span>
<span class="line"><span style="color:#24292e;">        // 执行代码并返回结果</span></span>
<span class="line"><span style="color:#24292e;">        return 0;</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">};</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">FutureTask&lt;Integer&gt; future = new FutureTask&lt;&gt;(callable);</span></span>
<span class="line"><span style="color:#24292e;">new Thread(future).start();</span></span></code></pre></div><p>接下来是线程池：<br> Java 提供了一个线程池框架，通常我们会使用 ExecutorService 的实现类创建线程池。比如 ThreadPoolExecutor 和 ScheduledThreadPoolExecutor。你可以通过以下方式创建：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">ExecutorService executor = Executors.newFixedThreadPool(10);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">ExecutorService executor = Executors.newFixedThreadPool(10);</span></span></code></pre></div><p>线程池提交任务主要有两种方式：<code>execute()</code>和<code>submit()</code>。</p><ol><li><code>execute(Runnable command)</code>: 用于提交一些一次性的任务，执行完成后就丢弃。</li><li><code>submit()</code>: 提交有返回值的任务，有三种形式：submit(Runnable task)、submit(Runnable task, T result)、submit(Callable task)。submit 方法返回一个 Future，我们可以通过 Future 获取线程执行后的返回结果。</li></ol><h3 id="线程创建的流程" tabindex="-1">线程创建的流程： <a class="header-anchor" href="#线程创建的流程" aria-label="Permalink to &quot;线程创建的流程：&quot;">​</a></h3><ol><li>新建线程</li><li>初始化线程，包含线程组，名称，优先级，是否是守护线程，目标对象等</li><li>调用线程的 start 方法，JVM 会调用该线程的 run 方法</li><li>线程进入 RUNNABLE 状态，等待 JVM 线程调度器调度</li><li>当线程执行完毕，或者出现未处理异常，则线程终止</li></ol><hr><h3 id="线程执行的流程" tabindex="-1">线程执行的流程： <a class="header-anchor" href="#线程执行的流程" aria-label="Permalink to &quot;线程执行的流程：&quot;">​</a></h3><ol><li>新线程被提交到线程池后，首先检查线程池状态，然后执行 addWorker 方法添加工作线程并执行任务</li><li>在 addWorker 中，首先会检查线程池状态和队列情况，然后创建工作线程，并放入到线程队列中，然后启动线程</li><li>线程启动后，会调用线程的 run 方法，执行任务</li><li>任务执行完毕后，线程不会立即销毁，而是等待新的任务</li><li>如果在 keepAliveTime 时间内没有新的任务，则线程将结束运行，进入 TERMINATED 状态</li></ol><hr><p><strong>线程创建的流程:</strong></p><ol><li><code>实例化线程对象</code>：首先我们提供一个实例化 Thread 的方式，这种方式可以是直接实例化 Thread 类，也可以是通过实现 Runnable 接口的方式。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">// 实例化Thread类</span></span>
<span class="line"><span style="color:#e1e4e8;">Thread thread = new Thread();</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">// 实现Runnable接口</span></span>
<span class="line"><span style="color:#e1e4e8;">Runnable runnable = new Runnable(){</span></span>
<span class="line"><span style="color:#e1e4e8;">    @Override</span></span>
<span class="line"><span style="color:#e1e4e8;">    public void run(){</span></span>
<span class="line"><span style="color:#e1e4e8;">        // 代码</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">};</span></span>
<span class="line"><span style="color:#e1e4e8;">Thread thread = new Thread(runnable);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">// 实例化Thread类</span></span>
<span class="line"><span style="color:#24292e;">Thread thread = new Thread();</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">// 实现Runnable接口</span></span>
<span class="line"><span style="color:#24292e;">Runnable runnable = new Runnable(){</span></span>
<span class="line"><span style="color:#24292e;">    @Override</span></span>
<span class="line"><span style="color:#24292e;">    public void run(){</span></span>
<span class="line"><span style="color:#24292e;">        // 代码</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">};</span></span>
<span class="line"><span style="color:#24292e;">Thread thread = new Thread(runnable);</span></span></code></pre></div><ol start="2"><li><code>初始化线程对象</code>：在实例化线程的过程中，我们有机会进行相关设置，例如线程名称、优先级等。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">// 设置线程名称</span></span>
<span class="line"><span style="color:#e1e4e8;">thread.setName(&quot;Thread01&quot;);</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">// 设置线程组，这一般是默认的，通常是父线程的线程组</span></span>
<span class="line"><span style="color:#e1e4e8;">ThreadGroup parentGroup = thread.getThreadGroup();</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">//设置线程优先级(1-10)，默认是5，低优先级的线程在与高优先级线程竞争时，会更可能得到CPU资源</span></span>
<span class="line"><span style="color:#e1e4e8;">thread.setPriority(Thread.NORM_PRIORITY);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">// 设置线程名称</span></span>
<span class="line"><span style="color:#24292e;">thread.setName(&quot;Thread01&quot;);</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">// 设置线程组，这一般是默认的，通常是父线程的线程组</span></span>
<span class="line"><span style="color:#24292e;">ThreadGroup parentGroup = thread.getThreadGroup();</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">//设置线程优先级(1-10)，默认是5，低优先级的线程在与高优先级线程竞争时，会更可能得到CPU资源</span></span>
<span class="line"><span style="color:#24292e;">thread.setPriority(Thread.NORM_PRIORITY);</span></span></code></pre></div><p><strong>线程执行的流程:</strong></p><ol><li><code>启动线程</code>：通过 Thread 实例的 start 方法。这个方法是 native 的，实际上是调用了 start0 方法。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">thread.start();</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">thread.start();</span></span></code></pre></div><ol start="2"><li><code>执行任务</code>：线程启动后，JVM 会调用线程的 run 方法。如果是直接创建的 Thread 对象，需要重写 run 方法，定义线程的任务；如果是 Runnable 对象，则 run 方法来自 Runnable 接口。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">// 覆盖Thread的run方法</span></span>
<span class="line"><span style="color:#e1e4e8;">@Override</span></span>
<span class="line"><span style="color:#e1e4e8;">public void run() {</span></span>
<span class="line"><span style="color:#e1e4e8;">    // 执行代码</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">// Runnable的run方法</span></span>
<span class="line"><span style="color:#e1e4e8;">@Override</span></span>
<span class="line"><span style="color:#e1e4e8;">public void run(){</span></span>
<span class="line"><span style="color:#e1e4e8;">    // 代码</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">// 覆盖Thread的run方法</span></span>
<span class="line"><span style="color:#24292e;">@Override</span></span>
<span class="line"><span style="color:#24292e;">public void run() {</span></span>
<span class="line"><span style="color:#24292e;">    // 执行代码</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">// Runnable的run方法</span></span>
<span class="line"><span style="color:#24292e;">@Override</span></span>
<span class="line"><span style="color:#24292e;">public void run(){</span></span>
<span class="line"><span style="color:#24292e;">    // 代码</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><ol start="3"><li><code>设置为已启动</code>：线程任务执行完毕后，线程会被设置为已结束状态。</li></ol><h2 id="synchronized-锁类型" tabindex="-1">synchronized 锁类型 <a class="header-anchor" href="#synchronized-锁类型" aria-label="Permalink to &quot;synchronized 锁类型&quot;">​</a></h2><p>Java 中提供了多种同步控制工具，例如 synchronized 是其中的一种，它可以用来保证线程安全，防止多个线程同时访问某一片代码段。</p><p>基于 synchronized 的同步，主要有三种使用方式：</p><ol><li><code>同步实例方法</code>： 直接在方法声明中加入 synchronized 关键字。在调用该方法时，不同线程将互斥访问这个方法。如果一个线程正在执行一个实例同步方法，其它线程不能访问该类的所有实例同步方法（包括同步方法和同步静态方法），其它线程可以访问非 synchronized 的方法。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">public class MyClass {</span></span>
<span class="line"><span style="color:#e1e4e8;">    public synchronized void method() {</span></span>
<span class="line"><span style="color:#e1e4e8;">        // 需要同步的代码</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">public class MyClass {</span></span>
<span class="line"><span style="color:#24292e;">    public synchronized void method() {</span></span>
<span class="line"><span style="color:#24292e;">        // 需要同步的代码</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><ol start="2"><li><code>同步代码块</code>： 将需要同步的代码包括在 synchronized 关键字和一对大括号中。为了达到同步的效果，你必须使用一个对象引用来指定同步块，并且具有相同指定对象引用的所有同步块才能够实现同步。换句话说，线程一次只能在一个对象引用的一个或多个同步块上同步。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">public void someMethod() {</span></span>
<span class="line"><span style="color:#e1e4e8;">    synchronized (this) {</span></span>
<span class="line"><span style="color:#e1e4e8;">        // 需要同步的代码</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">public void someMethod() {</span></span>
<span class="line"><span style="color:#24292e;">    synchronized (this) {</span></span>
<span class="line"><span style="color:#24292e;">        // 需要同步的代码</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><ol start="3"><li><code>同步静态方法</code>：使用 synchronized 修饰符来修饰一个静态方法。当一个线程获取到类锁，其他线程无法访问同一个类的所有同步静态方法，其它线程可以访问非 synchonized 的方法。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">public class MyClass {</span></span>
<span class="line"><span style="color:#e1e4e8;">    public static synchronized void method() {</span></span>
<span class="line"><span style="color:#e1e4e8;">        // 需要同步的代码</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">public class MyClass {</span></span>
<span class="line"><span style="color:#24292e;">    public static synchronized void method() {</span></span>
<span class="line"><span style="color:#24292e;">        // 需要同步的代码</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><p>上述三种方式提供了同步机制，它们都是通过使用监视器锁（monitors）来实现方法或者代码块的互斥访问。Java 中的每一个对象都可以作为锁，这是因为每个对象都有与之关联的监视器锁。</p><p>synchronized 保证了线程安全，但是使用过多会导致性能问题，因此我们需要尽量减少临界区的大小，只对必要的代码段进行同步。</p><h2 id="同步是如何实现的" tabindex="-1">同步是如何实现的 <a class="header-anchor" href="#同步是如何实现的" aria-label="Permalink to &quot;同步是如何实现的&quot;">​</a></h2><p>为了应对多线程环境下的线程安全问题，Java 提供了同步机制，也就是我们常说的  <code>synchronized</code>  关键字。关于同步的实现，我们需要深入理解一下 JVM 中的对象结构，以及对锁状态的更新。</p><p>在 JVM 中，每个 Java 对象在内存中都有一个对象头，也就是 Object Header。如果我们看一个普通的 Java 对象，它主要由三部分构成：</p><ul><li><code>Mark Word</code>：存储对象自身的运行时数据，如哈希码(hashcode)、锁状态标志、线程持有的锁、偏向线程 ID、偏向时间戳等。这部分数据的长度在 32 位和 64 位的 JVM（未开启压缩指针）中分别为 32bit 和 64bit。</li><li><code>类型指针</code>：其指向对象的类元数据(Class Metadata)，JVM 通过这个指针来确定这个对象是哪个类的实例。</li><li><code>实例数据（即我们在类中所定义的各种类型的字段）</code>：无论是从父类继承下来的，还是在子类中定义的，只要是对象的非静态字段，都在此处分配。</li></ul><p>然后，具体到同步如何实现，其核心就是对 Mark Word 中锁状态标志的修改。整个过程是这样的：</p><ol><li>在默认无锁状态（非同步情况）下，Mark Word 的结构是分配设置为偏向锁，并指向运行该代码的线程。</li><li>当有其他线程试图获取该对象的锁时，若偏向锁的指向刚好是这个线程，那么它就可以顺利获取到。反之，如果其他线程试图获取，则必须通过挂起自己线程的方式来撤销（撤销需要等待全局安全点，这是一个重量级操作）。撤销之后，偏向锁就升级为轻量级锁。</li><li>接下来的过程就是线程争用的处理。如果没有争用，那么轻量级锁就直接退化为偏向锁。如果有争用，那么锁就膨胀为重量级锁，重量级锁就会让其他申请的线程进入阻塞状态。</li></ol><p>这就是一次完整的锁升级，也是同步的实现过程。看似复杂，其实就像玩玩具一样。闯过了这一关，你就已经跨出了成为并发编程大师的重要一步。</p><h2 id="可见性和有序性" tabindex="-1">可见性和有序性 <a class="header-anchor" href="#可见性和有序性" aria-label="Permalink to &quot;可见性和有序性&quot;">​</a></h2><p>在多线程编程中，&quot;可见性&quot;和&quot;有序性&quot;是两个基本的概念，它们对理解如何编写正确和高效的并发程序至关重要。</p><ol><li><code>可见性</code>：当一个线程修改了共享变量的值，其他线程可以立即知道这个修改。Java 中，关键字 volatile 可以保证变量的可见性。当一个共享变量被 volatile 修饰时，它会保证修改的值立即同步到主内存，当有其他线程需要读取时，它会直接从主内存中读取新值。</li></ol><p>但需要注意的是，尽管 synchronized 关键字可以使共享变量在线程间保持同步，避免了线程间互相看不到对方的更新值的问题，但它本身并不能保证可见性，可见性是由 volatile 关键字来保证的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">private volatile int value;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">public void setValue(int value) {</span></span>
<span class="line"><span style="color:#e1e4e8;">   this.value = value;</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">private volatile int value;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">public void setValue(int value) {</span></span>
<span class="line"><span style="color:#24292e;">   this.value = value;</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><ol start="2"><li><code>有序性</code>：即程序执行的顺序按照代码的先后顺序执行。在 Java 里，可以通过 volatile 关键字来保证某些操作的有序性。Java 内存模型中，对 volatile 变量的写操作先行发生于读操作，这就创建了一个&quot;先行发生原则&quot;，如果对 volatile 变量的写操作先行发生于读操作，那么在读操作时就可以得到这个最新的值。</li></ol><p>此外，双重检查锁定的单例模式就可以利用 volatile 的这种有序性特性来工作。在这种模式下，volatile 防止了其他线程看到部分初始化的单例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">public class Singleton {</span></span>
<span class="line"><span style="color:#e1e4e8;">    private volatile static Singleton instance;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    public static Singleton getInstance() {</span></span>
<span class="line"><span style="color:#e1e4e8;">        if (instance == null) {</span></span>
<span class="line"><span style="color:#e1e4e8;">            synchronized(Singleton.class) {</span></span>
<span class="line"><span style="color:#e1e4e8;">                if (instance == null) {</span></span>
<span class="line"><span style="color:#e1e4e8;">                    instance = new Singleton();</span></span>
<span class="line"><span style="color:#e1e4e8;">                }</span></span>
<span class="line"><span style="color:#e1e4e8;">            }</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">        return instance;</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">public class Singleton {</span></span>
<span class="line"><span style="color:#24292e;">    private volatile static Singleton instance;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    public static Singleton getInstance() {</span></span>
<span class="line"><span style="color:#24292e;">        if (instance == null) {</span></span>
<span class="line"><span style="color:#24292e;">            synchronized(Singleton.class) {</span></span>
<span class="line"><span style="color:#24292e;">                if (instance == null) {</span></span>
<span class="line"><span style="color:#24292e;">                    instance = new Singleton();</span></span>
<span class="line"><span style="color:#24292e;">                }</span></span>
<span class="line"><span style="color:#24292e;">            }</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">        return instance;</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><p>在上述代码中，“instance = new Singleton()”这段代码其实是分为三步执行：</p><p>1）为 instance 分配内存空间;</p><p>2）初始化 instance;</p><p>3）将 instance 指向分配的内存地址。</p><p>但是由于 JVM 具有指令重排的特性，执行顺序有可能变成 1-&gt;3-&gt;2。在单线程环境下不会出现问题，但在多线程环境下会导致问题。指令重排是为了提高性能。</p><p>为了避免这个问题，我们需要添加 volatile 关键字，禁止进行指令重排。</p><h2 id="wait-和-notify" tabindex="-1">wait 和 notify <a class="header-anchor" href="#wait-和-notify" aria-label="Permalink to &quot;wait 和 notify&quot;">​</a></h2><p>Java 提供了几种等待/通知机制，如 wait(), notify()和 notifyAll()方法。这些方法提供了一种有效的方式来让线程之间进行通信。</p><ul><li>wait()方法是 Object 类的一个方法，当一个线程执行到 wait()方法时，它就会进入等待状态，同时释放掉它所持有的对象锁，让其他线程可以进入。</li><li>notify()和 notifyAll()也是 Object 类中的方法，它们的作用是唤醒在等待队列中等待同一共享资源的一个或所有线程。</li></ul><p>需要注意的是，这三个方法都必须在 synchronized 同步块中使用，这是因为必须确保调用 wait()或 notify()方法的线程已经持有对象锁。如果调用这些方法时没有持有对象锁，就会抛出 IllegalMonitorStateException 异常。</p><p>以下是一个简单的示例，展示了如何使用 wait()和 notify()在两个线程间同步：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">public class Sample {</span></span>
<span class="line"><span style="color:#e1e4e8;">    private Object lock = new Object();</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    public void doWait() {</span></span>
<span class="line"><span style="color:#e1e4e8;">        synchronized(lock) {</span></span>
<span class="line"><span style="color:#e1e4e8;">            try {</span></span>
<span class="line"><span style="color:#e1e4e8;">                System.out.println(&quot;开始执行wait&quot;);</span></span>
<span class="line"><span style="color:#e1e4e8;">                lock.wait();</span></span>
<span class="line"><span style="color:#e1e4e8;">                System.out.println(&quot;结束执行wait&quot;);</span></span>
<span class="line"><span style="color:#e1e4e8;">            } catch (InterruptedException e) {</span></span>
<span class="line"><span style="color:#e1e4e8;">                e.printStackTrace();</span></span>
<span class="line"><span style="color:#e1e4e8;">            }</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    public void doNotify() {</span></span>
<span class="line"><span style="color:#e1e4e8;">        synchronized(lock) {</span></span>
<span class="line"><span style="color:#e1e4e8;">            System.out.println(&quot;开始执行notify&quot;);</span></span>
<span class="line"><span style="color:#e1e4e8;">            lock.notify();</span></span>
<span class="line"><span style="color:#e1e4e8;">            System.out.println(&quot;结束执行notify&quot;);</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">public class Sample {</span></span>
<span class="line"><span style="color:#24292e;">    private Object lock = new Object();</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    public void doWait() {</span></span>
<span class="line"><span style="color:#24292e;">        synchronized(lock) {</span></span>
<span class="line"><span style="color:#24292e;">            try {</span></span>
<span class="line"><span style="color:#24292e;">                System.out.println(&quot;开始执行wait&quot;);</span></span>
<span class="line"><span style="color:#24292e;">                lock.wait();</span></span>
<span class="line"><span style="color:#24292e;">                System.out.println(&quot;结束执行wait&quot;);</span></span>
<span class="line"><span style="color:#24292e;">            } catch (InterruptedException e) {</span></span>
<span class="line"><span style="color:#24292e;">                e.printStackTrace();</span></span>
<span class="line"><span style="color:#24292e;">            }</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    public void doNotify() {</span></span>
<span class="line"><span style="color:#24292e;">        synchronized(lock) {</span></span>
<span class="line"><span style="color:#24292e;">            System.out.println(&quot;开始执行notify&quot;);</span></span>
<span class="line"><span style="color:#24292e;">            lock.notify();</span></span>
<span class="line"><span style="color:#24292e;">            System.out.println(&quot;结束执行notify&quot;);</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><p>在这个例子中，doWait()方法会使当前线程进入等待状态，并释放锁，让其他线程可以调用 doNotify()方法。doNotify()方法会唤醒一个等待的线程。如果没有等待的线程，该方法不会有任何效果。</p><p>这个等待/通知机制就像一个简易的交通信号灯，通过 wait 和 notify 就可以控制线程的行进与停止，确保不同的线程能够和谐地在我们的程序中运行，就如同精心调度的交通，避免了可能的”交通事故“，让我们的程序运行得既有序又安全。</p><h2 id="锁状态" tabindex="-1">锁状态 <a class="header-anchor" href="#锁状态" aria-label="Permalink to &quot;锁状态&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221809767.png" alt="image.png"></p><p>在 Java 的并发编程中，每一个对象都有一个与之关联的内部锁(也称为监视器锁)。当线程试图获取这个锁时，如果这个锁已经被其他线程持有，则该线程就会进入这个对象的等待集合(或称为 Wait Set)中，直到获取到锁资源为止。</p><p>这个锁资源的存在，被体现在每一个对象头里的 Mark Word 中。Mark Word 中存储着很多信息，其中包括锁信息、执行偏向锁的线程 ID、对象的哈希码等。在你提到的锁状态中，count 表示重入次数，thread 表示持有该锁的线程。</p><p>假设我们有一个初始状态的对象，其 count 为 0，thread 为 null，当线程 T1 首次获取到这把锁时，对象头中的 count 变为 1，thread 指向 T1。当 T1 再次重入锁时，count 递增变为 2。当 T1 完成任务退出同步块，释放锁时，count 递减，当 count 为 0 时，表示锁已完全释放，thread 变为 null。</p><p>如果此时，线程 T1 再度试图获取该锁但未能得到（比如已经被 T3 持有并执行），那么就会被放入对象的等待集合，其状态回到 count 为 0，thread 为 null。</p><p>此后，如果线程 T3 释放锁，线程 T2 获取了该锁，那么对象头的状态又会回到 count 为 1，thread 指向 T2，等待集合中还包含 T1。如果 T2 再度释放锁，状态又会恢复为 count 为 0，thread 为 null。</p><p>以上就是你提到的那组状态变化过程。</p><h2 id="volatile" tabindex="-1">Volatile <a class="header-anchor" href="#volatile" aria-label="Permalink to &quot;Volatile&quot;">​</a></h2><p><code>volatile</code> 是 Java 提供的轻量级同步机制，主要有两个特性：可见性和有序性。</p><ul><li><code>可见性</code>：指当一个线程修改了共享变量的值，其他线程可以立即得知这个修改。这是因为 volatile 关键字会强制把修改的值立即写入主内存，当有其他线程需要读取该变量时，它会直接从主内存中读。例如有两个线程 A 和 B，A 修改了一个被 volatile 修饰的变量的值，那么这个新值对 B 线程来说是可以看得见的。</li><li><code>有序性</code>：即禁止指令重排的优化。通常在执行程序时为了提高性能，编译器和处理器可能会对指令做重排，但是有些时候指令重排可能会导致多线程程序出错。volatile 关键字确保了指令不会被重排，从而避免了多线程环境下程序出错。</li></ul><p>在提到的代码中，如果不加 volatile，由于 JVM 运行时各线程之间的工作内存与主内存同步延迟，线程 B 可能会读到 a 的旧值，这就出现了可见性问题。与此同时，如果 JVM 进行了指令重排，可能会改变原本的执行逻辑，从而引发程序错误，这就出现了有序性问题。</p><p>值得注意的是，虽然 <code>volatile</code> 关键字确保了操作的有序性和可见性，但是它并不能保证复合操作的原子性。</p><p>例如对于 i++这样的操作，实际上是分为三步的：读取 i 的值，对 i 进行+1 操作，写入新值。这三步操作并非一个原子操作，volatile 无法保证它们的原子性。因此，在进行复合操作时，还需要使用到 synchronized 或者 java.util.concurrent.atomic 包下的原子类。</p><p>编程就像一个精密的齿轮系统，<code>volatile</code> 就好像是润滑油，虽小却关键。透过其简单的设计，我们可以解决代码执行过程中的可见性和有序性问题。为了让这个系统运转得更加稳定，我们需要深入理解每个部分的作用，并充分利用它们。虽然 <code>volatile</code> 不能保证操作的原子性，但是这并不影响我们利用它来创建更优雅，更高效的代码。</p><h2 id="atomic" tabindex="-1">Atomic <a class="header-anchor" href="#atomic" aria-label="Permalink to &quot;Atomic&quot;">​</a></h2><p><code>Atomic</code> 开头的类是 Java 并发库中提供的一个原子操作工具类。这些类可以帮助你在多线程环境下进行线程安全的操作，并且比使用 <code>synchronized</code> 关键字或 <code>ReentrantLock</code> 锁提供更简洁、代码量更小和响应速度更快的解决方案。</p><p>这些类包括<code>AtomicInteger</code>、<code>AtomicLong</code>、<code>AtomicBoolean</code>、<code>AtomicReference</code>等，主要用于多线程环境下对单个变量进行原子操作。</p><p>例如，对一个整型变量进行递增操作时，普通的<code>i++</code>操作在多线程环境下会出现问题，因为它不是一个原子操作，而是分为“读取”、“增加”和“写入”三个步骤。如果在这三个步骤中线程切换，那就可能会导致数据错误。</p><p><code>Atomic</code>类使用了一种称为<code>CAS（Compare And Swap）</code>机制来保证操作的原子性。它会对当前值和预期值进行比较，只有当当前值等于预期值时才会将新值写入，否则就会进行重试。</p><p>比如在<code>AtomicInteger</code>中的<code>getAndAdd()</code>方法，可以让你在一步中完成递增操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">AtomicInteger ai = new AtomicInteger(0);</span></span>
<span class="line"><span style="color:#e1e4e8;">int currentValue = ai.getAndAdd(10);  // currentValue的值依然为0，但ai的值已经变为10</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">AtomicInteger ai = new AtomicInteger(0);</span></span>
<span class="line"><span style="color:#24292e;">int currentValue = ai.getAndAdd(10);  // currentValue的值依然为0，但ai的值已经变为10</span></span></code></pre></div><p><code>getAndSet()</code>方法可以让你在一步中完成值的替换操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">AtomicBoolean ab = new AtomicBoolean(true);</span></span>
<span class="line"><span style="color:#e1e4e8;">boolean oldValue = ab.getAndSet(false); // oldValue的值为true，但ab的值已经变为false</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">AtomicBoolean ab = new AtomicBoolean(true);</span></span>
<span class="line"><span style="color:#24292e;">boolean oldValue = ab.getAndSet(false); // oldValue的值为true，但ab的值已经变为false</span></span></code></pre></div><p>总的来说，<code>Atomic</code>类在以下场景中是非常有用的：</p><ul><li>你需要在多线程环境下对单个变量进行线程安全的操作；</li><li>你想要一个比<code>synchronized</code>关键字或<code>ReentrantLock</code>锁更快、更简洁的解决方案；</li><li>你希望的操作可以在一步完成，避免了数据的不一致性。</li></ul><h2 id="局限" tabindex="-1">局限 <a class="header-anchor" href="#局限" aria-label="Permalink to &quot;局限&quot;">​</a></h2><p><code>Atomic</code> 类是基于 <code>CAS(compareAndSet)</code> 来实现的。<code>CAS</code> 的原理是拿当前的值与预期的值进行比较，如果相等，则改为新的值，如果不等，说明有其他线程已经修改了这个值，那么就重试操作。</p><p>在 JDK 的<code>Unsafe</code>类中，有很多底层的方法，其中就包括对<code>CAS</code>操作的支持。并且这些<code>CAS</code>操作是通过调用底层操作系统接口实现的，所以性能很高。</p><p>然而，<code>CAS</code>并不是万能的，它也有一些体现在下面的问题：</p><ol><li>只能保证一个共享变量的原子操作。如果涉及到对多个共享变量的操作，就不能保证操作的原子性了。解决这个问题的方式，一般是用锁<code>synchronized</code>或<code>ReentrantLock</code>。但是 Java 也提供了一个<code>AtomicReference</code>类，它可以将多个变量包装成一个对象后，对对象进行原子操作。</li><li>ABA 问题。即在这个过程中，如果一个值原来是 A，被改成了 B，然后又被改回 A，在<code>CAS</code>看来，这个变量并没有发生变化，但实际上它已经发生了两次变化。Java 为了解决这个问题，提供了<code>AtomicStampedReference</code>类，它可以通过控制版本号的方式，解决<code>ABA</code>问题。</li><li>自旋可能会带来大量的消耗。有可能一个线程不停地尝试操作，但总是失败，这样会进行大量的无效操作。一种常见的方法是用<code>Thread.yield()</code>让出 CPU，让其他线程先进行执行。如果其他线程释放了锁，那么这个线程就有机会成功。另一种是采用了自适应的自旋，如果在前几次自旋中，发现通过自旋可以获取到锁，那么在后续的自旋中，会多自旋几次。如果在前几次中自旋总是获取不到锁，那么后续就少自旋。</li></ol><p>有时候生活中的问题，需要我们用一种更具智慧的方式去解决。就如同<code>CAS</code>一样，虽然它拥有无比巨大的力量，但是它并不能解决所有问题。我们需要明白其局限性，同时配合其他工具使用。</p><h2 id="aqs-加锁流程" tabindex="-1">AQS 加锁流程 <a class="header-anchor" href="#aqs-加锁流程" aria-label="Permalink to &quot;AQS 加锁流程&quot;">​</a></h2><p>AQS，全称 AbstractQueuedSynchronizer（抽象队列同步器），它是 Java 并发包 java.util.concurrent 的基石。AQS 核心思想是，如果被请求的共享资源空闲则将当前请求资源的线程设为有效的工作线程，并且将共享资源设置为锁定状态。如果被请求的共享资源被占用，那么就需要一套等待唤醒机制来加入等待工作队列。</p><ol><li>线程 1 抢占锁成功则可以自由访问共享资源。</li><li>接着，线程 1 要重入锁。没问题呢，因为它已经拿到了锁，它可以自由的进入并出去。</li><li>然后是线程 2 和线程 3 想要加锁。可是哈，锁已经被线程 1 拿走了，线程 2 和线程 3 只能无奈地排在等待队列里面哭泣了。</li><li>线程 1 用完锁后，释放了锁。这个时候，线程 2 和线程 3 就像听到了&quot;开席&quot;的召唤，一激动，换锁就换锁吧。</li><li>线程 2 速度快，抢到了锁，于是就走进了共享资源的领域。</li><li>线程 2 工作完毕后，它释放了锁。这个时候，线程 3 终于等到了它的机会，它拿到了锁，终于可以安心工作了。</li><li>最后线程 3 也完成了它的工作，释放了锁，整个赛跑的故事就在这里画上了句号。</li></ol><hr><p>假设线程 1、线程 2、线程 3 都是初中生，在 Java 世界里想要进入一个被 AQS 守护着的&quot;高级知识讲座&quot;。</p><ol><li>线程 1 到达了现场，看到讲座大门正开着，于是他就走进去了。在 AQS 的源码中，相当于线程 1 尝试获取锁，看看 state 是否为 0，如果是 0 就用 CAS 操作尝试给 state 赋值（设为 1），成功后返回 true，获取锁成功，就可以愉快地以<code>getExclusiveOwnerThread()</code>介入讲座啦。</li><li>线程 1 已经在讲座内了，他又想出去拿点吃的又回来。因为他还持有进门的门票，所以他可以随意出入。这就是 AQS 的重入锁，它允许持有锁的线程反复获取锁。</li><li>线程 2 到了现场，发现门票已经被线程 1 拿走了，因此他们必须在门口的队列中等待。这就是 AQS 的<code>addWaiter(Node.EXCLUSIVE)</code>方法，它会为每一个新来的线程创建一个类型为独占模式的 Node（线程节点），并添加到等待队列中。</li><li>线程 3 也到了现场，和线程 2 一样，进入等待队列。</li><li>线程 1 在讲座结束后，准备离开，将门票归还。这就是&quot;线程 1 释放锁&quot;，AQS 的 state 被设为 0，并且门票的拥有者信息也被清空。然后 AQS 就会去等待队列中唤醒后继线程。在源码中，这个方法就是<code>unparkSuccessor()</code>，它会唤醒队列中的下一个（head.next）等待线程。</li><li>因为线程 2 在队列的最前面，他被唤醒并得到了门票，即获得了锁。</li><li>线程 2 在讲座结束后，归还了门票，然后线程 3 也被唤醒，得到了门票。</li><li>最后，线程 3 也留下了门票走人。</li></ol><p>这段表演结束了，当然，除了这段戏之外，AQS 的源码操作明显会更加复杂和详细，例如获取锁失败后如何进入睡眠、如何正确和安全的进行节点插入、唤醒等等，但基本的思路是这样的。现在你应该对三个线程如何在 AQS 下登台表演有了清晰的理解了吧!</p><h2 id="公平锁与非公平锁" tabindex="-1">公平锁与非公平锁 <a class="header-anchor" href="#公平锁与非公平锁" aria-label="Permalink to &quot;公平锁与非公平锁&quot;">​</a></h2><p>公平锁和非公平锁走进了一家吧。调酒师问，&quot;你们怎么不一起来呢？&quot;他们回答说，&quot;我们喜欢公平竞争，谁的手快，谁就能喝上酒。”</p><p>哈哈，说完笑话，我们来认真讲解下：</p><ol><li>非公平锁：就好像你在电脑前抢折扣商品，你可以不停刷新页面，只要商品一有折扣，你就马上抢购。这样可能夺走了别人本来就要买的东西。这就是非公平锁，新的线程有机会直接插队，即如果此时锁是空闲的，不用去排队，可以直接抢占锁。</li><li>公平锁：都按照先来后到的顺序，喝水排队，去洗手间排队，买咖啡...一切都在排，新来的线程必须在队尾等待。也就是说，一旦锁空闲，优先分配给等待最久的线程。</li></ol><p>那么他们有什么区别呢？</p><ol><li>不同之处主要在于性能。非公平锁的性能通常会优于公平锁，因为线程挂起操作和恢复操作都需要切换 CPU，消耗系统资源。而非公平锁可以尽可能地减少一些不必要的系统消耗。</li><li>但非公平锁的缺点就是可能会产生线程&quot;饥饿&quot;现象，即有些线程长时间得不到锁最终导致应用程序出现延迟等问题。这确实是个问题，但一般情况下不会那么严重。哈哈，毕竟我们的程序不是在&quot;拒绝服务&quot;攻击下运行的吧？</li></ol><p>至于具体使用哪种锁，则需要根据自己的业务场景进行选择。上述都只是死板的规则，就像你在开会，有时候你会优先让老板发言，有时候你会优先让抢着发言的员工先说。这都是权衡取舍的结果，如同公平锁和非公平锁一样。</p><hr><p>让我来讲讲如何在 Java 里面实现这两种锁。</p><p>首先，我们说一说非公平锁。你可能以前不知道，其实默认情况下 ReentrantLock 创建的都是非公平锁。新的线程试图获取锁的时候，会优先尝试去获取，成功则直接持有，如果失败，那么再去队列排队，这就有插队的可能，所以叫「非公平」。即：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">ReentrantLock lock </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ReentrantLock</span><span style="color:#E1E4E8;">(); </span><span style="color:#6A737D;">// 默认是非公平锁</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">ReentrantLock lock </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ReentrantLock</span><span style="color:#24292E;">(); </span><span style="color:#6A737D;">// 默认是非公平锁</span></span></code></pre></div><p>然后，我们再来看公平锁如何创建。你只需要在创建 ReentrantLock 时传入一个参数 true 即可，如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">ReentrantLock lock = new ReentrantLock(true); // 公平锁</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">ReentrantLock lock = new ReentrantLock(true); // 公平锁</span></span></code></pre></div><p>在这种情况下，面临竞争的时候，它总是会选择等待时间最长的线程，也就是等待队列头节点的线程（队列是一个 FIFO 队列）。</p><p>归根结底，ReentrantLock 的公平性和非公平性主要区别在于创建锁时传递给 Sync 的策略不同。公平锁使用 FairSync，非公平锁使用 NonfairSync。在公平锁中，加锁操作首先检查是否有排队等待的线程，如果有就直接进入等待队列排队；而在非公平锁中，加锁操作首先会尝试去直接抢占锁，也就是尝试获取 state 的操作，抢占失败再进入等待队列。</p><p>再次提醒，公平锁能够防止线程饥饿，每个线程都能得到公平的待遇，但是公平锁的吞吐量比较低；非公平锁吞吐量高，但是可能会导致线程饥饿，特别是那些优先级低的线程。具体使用哪种锁要看你的实际需求，没有绝对优劣之分。</p><h2 id="condition" tabindex="-1">condition <a class="header-anchor" href="#condition" aria-label="Permalink to &quot;condition&quot;">​</a></h2><p>让我们一起来看看 Condition 的剧情是如何发展的。</p><p>我们假设有两个角色，线程 1（尊称为 Sir Thread 1）和线程 2（尊称为 Lady Thread 2），他们都参加了一场被 Condition 举办的舞会。舞会的门票（锁）只有一个，幸运的 Sir Thread 1 拿到了。他们的生活就像一个方法，一辈子就这么长，不是吗？</p><p><strong>场景一：Sir Thread 1 执行 await 方法</strong></p><ul><li>先让 Sir Thread 1 性格大变，变得很谦让，他决定让出场地（释放锁），让其他人能也有机会参加舞会（执行）。</li><li>他把门票交给了 Condition，Condition 负责决定下一位参加舞会的人。</li><li>然后，他就去 Condition 的等待室里等待（进入 Condition 队列），等待由 Lady Thread 2 唤醒后再回来取门票。</li></ul><p><strong>场景二：Condition.await(timeout)的调用</strong></p><ul><li>这就像 Sir Thread 1 喊出：“我能忍受等你 20 分钟，但超过这个时间，我就无法接受了。”</li><li>在这 20 分钟的等待时间内，如果 Lady Thread 2 在这段时间内给他发送信号唤醒他，他就会很高兴的从等待室出来。</li><li>如果超过 20 分钟，Lady Thread 2 还没出现，那 Sir Thread 1 将很失望的离开。</li></ul><p><strong>场景三：Lady Thread 2 执行 signal 方法</strong></p><ul><li>Lady Thread 2 终于到达了（调用 signal 方法），她到服务台（Condition 对象）请某位壮士（唤醒 Condition 队列中的某个线程）。</li><li>服务台随机找到一个壮士（Sir Thread 1）, 告诉他你可以参加舞会了。</li></ul><p><strong>场景四：Lady Thread 2 释放锁</strong></p><ul><li>此时舞会的门票又回到了 Condition 手中，Condition 立马通知等待室里的 Sir Thread 1：“是时候参加舞会了！”</li></ul><p>而这和 Object 的 wait、notify 的主要区别在于：Condition 提供的 await、signal 等操作，是建立在 Lock(ReentrantLock)对象基础上的，它与 Lock 一样，是非阻塞性的，具有可中断和超时等待获取锁特性，并且一个 Lock 对象可以有多个 Condition 队列。而 Object 的 wait、notify 等操作，是建立在 synchronized 同步块或同步方法上的，它是阻塞性的，没有超时等待取锁特性，每个对象也只能有一个等待队列。</p><hr><p>从源码角度看，Condition 接口实际上是由 Lock.newCondition()方法返回的一个 ConditionObject 对象，这是是 Lock 的内部类。你可以把 Condition 看成是一个特殊的队列，在 Lock 的基础上提供了类似于等待/通知模式的功能。</p><p>那么我们来看看它的主要方法，以及在源码中的实体现。</p><ol><li><p><code>await()</code>函数：</p><p>当一个线程执行了 await()函数，会使当前线程进入等待状态，同时也会释放锁。</p></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">   public final void await() throws InterruptedException {</span></span>
<span class="line"><span style="color:#e1e4e8;">       // 如果当前线程被中断了，将抛出异常</span></span>
<span class="line"><span style="color:#e1e4e8;">       if (Thread.interrupted())</span></span>
<span class="line"><span style="color:#e1e4e8;">           throw new InterruptedException();</span></span>
<span class="line"><span style="color:#e1e4e8;">       // 加入等待队列，当线程收到signal时，会将线程移出这个队列</span></span>
<span class="line"><span style="color:#e1e4e8;">       Node node = addConditionWaiter();</span></span>
<span class="line"><span style="color:#e1e4e8;">       // 释放锁，同时会唤醒其他等待锁的线程。如果释放失败会把当前线程从队列中删除</span></span>
<span class="line"><span style="color:#e1e4e8;">       int savedState = fullyRelease(node);</span></span>
<span class="line"><span style="color:#e1e4e8;">       int interruptMode = 0;</span></span>
<span class="line"><span style="color:#e1e4e8;">       // 循环判断如果当前节点不在Sync队列中，就让线程挂起</span></span>
<span class="line"><span style="color:#e1e4e8;">       while (!isOnSyncQueue(node)) {</span></span>
<span class="line"><span style="color:#e1e4e8;">           LockSupport.park(this);</span></span>
<span class="line"><span style="color:#e1e4e8;">           // 当线程被唤醒时，如果是因为中断，修改interruptMode的值</span></span>
<span class="line"><span style="color:#e1e4e8;">           if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)</span></span>
<span class="line"><span style="color:#e1e4e8;">               break;</span></span>
<span class="line"><span style="color:#e1e4e8;">      }</span></span>
<span class="line"><span style="color:#e1e4e8;">      // 如果线程被signal唤醒，或者是抢占成功，会尝试获取同步状态，失败会挂起线程</span></span>
<span class="line"><span style="color:#e1e4e8;">      if (acquireQueued(node, savedState) &amp;&amp; interruptMode != THROW_IE)</span></span>
<span class="line"><span style="color:#e1e4e8;">          interruptMode = REINTERRUPT;</span></span>
<span class="line"><span style="color:#e1e4e8;">      // 如果线程被signalAll唤醒，会移出队列</span></span>
<span class="line"><span style="color:#e1e4e8;">      if (node.nextWaiter != null) // clean up if cancelled</span></span>
<span class="line"><span style="color:#e1e4e8;">          unlinkCancelledWaiters();</span></span>
<span class="line"><span style="color:#e1e4e8;">      if (interruptMode != 0)</span></span>
<span class="line"><span style="color:#e1e4e8;">          reportInterruptAfterWait(interruptMode);</span></span>
<span class="line"><span style="color:#e1e4e8;">   }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">   public final void await() throws InterruptedException {</span></span>
<span class="line"><span style="color:#24292e;">       // 如果当前线程被中断了，将抛出异常</span></span>
<span class="line"><span style="color:#24292e;">       if (Thread.interrupted())</span></span>
<span class="line"><span style="color:#24292e;">           throw new InterruptedException();</span></span>
<span class="line"><span style="color:#24292e;">       // 加入等待队列，当线程收到signal时，会将线程移出这个队列</span></span>
<span class="line"><span style="color:#24292e;">       Node node = addConditionWaiter();</span></span>
<span class="line"><span style="color:#24292e;">       // 释放锁，同时会唤醒其他等待锁的线程。如果释放失败会把当前线程从队列中删除</span></span>
<span class="line"><span style="color:#24292e;">       int savedState = fullyRelease(node);</span></span>
<span class="line"><span style="color:#24292e;">       int interruptMode = 0;</span></span>
<span class="line"><span style="color:#24292e;">       // 循环判断如果当前节点不在Sync队列中，就让线程挂起</span></span>
<span class="line"><span style="color:#24292e;">       while (!isOnSyncQueue(node)) {</span></span>
<span class="line"><span style="color:#24292e;">           LockSupport.park(this);</span></span>
<span class="line"><span style="color:#24292e;">           // 当线程被唤醒时，如果是因为中断，修改interruptMode的值</span></span>
<span class="line"><span style="color:#24292e;">           if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)</span></span>
<span class="line"><span style="color:#24292e;">               break;</span></span>
<span class="line"><span style="color:#24292e;">      }</span></span>
<span class="line"><span style="color:#24292e;">      // 如果线程被signal唤醒，或者是抢占成功，会尝试获取同步状态，失败会挂起线程</span></span>
<span class="line"><span style="color:#24292e;">      if (acquireQueued(node, savedState) &amp;&amp; interruptMode != THROW_IE)</span></span>
<span class="line"><span style="color:#24292e;">          interruptMode = REINTERRUPT;</span></span>
<span class="line"><span style="color:#24292e;">      // 如果线程被signalAll唤醒，会移出队列</span></span>
<span class="line"><span style="color:#24292e;">      if (node.nextWaiter != null) // clean up if cancelled</span></span>
<span class="line"><span style="color:#24292e;">          unlinkCancelledWaiters();</span></span>
<span class="line"><span style="color:#24292e;">      if (interruptMode != 0)</span></span>
<span class="line"><span style="color:#24292e;">          reportInterruptAfterWait(interruptMode);</span></span>
<span class="line"><span style="color:#24292e;">   }</span></span></code></pre></div><ol start="2"><li><p><code>signal()</code>函数：</p><p>当一个线程执行了 signal()函数, 会从 Condition 的等待队列中唤醒一个等待的线程，如果 Condition 的等待队列中没有等待线程，那么 signal 函数不会做任何事情。</p></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">   public final void signal() {</span></span>
<span class="line"><span style="color:#e1e4e8;">       // 只有持有锁的线程才能调用signal方法，否则会抛出异常</span></span>
<span class="line"><span style="color:#e1e4e8;">       if (!isHeldExclusively())</span></span>
<span class="line"><span style="color:#e1e4e8;">           throw new IllegalMonitorStateException();</span></span>
<span class="line"><span style="color:#e1e4e8;">       // 唤醒第一个等待的线程</span></span>
<span class="line"><span style="color:#e1e4e8;">       Node first = firstWaiter;</span></span>
<span class="line"><span style="color:#e1e4e8;">       if (first != null)</span></span>
<span class="line"><span style="color:#e1e4e8;">           doSignal(first);</span></span>
<span class="line"><span style="color:#e1e4e8;">   }</span></span>
<span class="line"><span style="color:#e1e4e8;">   private void doSignal(Node first) {</span></span>
<span class="line"><span style="color:#e1e4e8;">       do {</span></span>
<span class="line"><span style="color:#e1e4e8;">           // 设置第一个等待节点为下一个节点</span></span>
<span class="line"><span style="color:#e1e4e8;">           if ( (firstWaiter = first.nextWaiter) == null)</span></span>
<span class="line"><span style="color:#e1e4e8;">               lastWaiter = null;</span></span>
<span class="line"><span style="color:#e1e4e8;">           first.nextWaiter = null;</span></span>
<span class="line"><span style="color:#e1e4e8;">           // 循环唤醒等待的线程，直到成功将其移入同步队列</span></span>
<span class="line"><span style="color:#e1e4e8;">       } while (!transferForSignal(first) &amp;&amp; (first = firstWaiter) != null);</span></span>
<span class="line"><span style="color:#e1e4e8;">   }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">   public final void signal() {</span></span>
<span class="line"><span style="color:#24292e;">       // 只有持有锁的线程才能调用signal方法，否则会抛出异常</span></span>
<span class="line"><span style="color:#24292e;">       if (!isHeldExclusively())</span></span>
<span class="line"><span style="color:#24292e;">           throw new IllegalMonitorStateException();</span></span>
<span class="line"><span style="color:#24292e;">       // 唤醒第一个等待的线程</span></span>
<span class="line"><span style="color:#24292e;">       Node first = firstWaiter;</span></span>
<span class="line"><span style="color:#24292e;">       if (first != null)</span></span>
<span class="line"><span style="color:#24292e;">           doSignal(first);</span></span>
<span class="line"><span style="color:#24292e;">   }</span></span>
<span class="line"><span style="color:#24292e;">   private void doSignal(Node first) {</span></span>
<span class="line"><span style="color:#24292e;">       do {</span></span>
<span class="line"><span style="color:#24292e;">           // 设置第一个等待节点为下一个节点</span></span>
<span class="line"><span style="color:#24292e;">           if ( (firstWaiter = first.nextWaiter) == null)</span></span>
<span class="line"><span style="color:#24292e;">               lastWaiter = null;</span></span>
<span class="line"><span style="color:#24292e;">           first.nextWaiter = null;</span></span>
<span class="line"><span style="color:#24292e;">           // 循环唤醒等待的线程，直到成功将其移入同步队列</span></span>
<span class="line"><span style="color:#24292e;">       } while (!transferForSignal(first) &amp;&amp; (first = firstWaiter) != null);</span></span>
<span class="line"><span style="color:#24292e;">   }</span></span></code></pre></div><p>从源码我们可以看到，Condition 的 await 方法是使当前线程进入等待状态并释放锁，而 signal 方法则是唤醒等待队列上的一个线程。这提供了一种强大的机制，可以让我们的线程在正确的时间点上执行。</p><p>对了，我突然间想起来一个好玩的比喻。Condition 的 await 和 signal 就像是舞会的舞伴并列的坐在椅子上等待邀请，而 signal 就像是&quot;引导者&quot;邀请某人跳舞的邀请信。不过这里的呼唤和响应都需要在具有互斥锁的区域内完成，也就是说我们需要“礼貌”的邀请对方，对方也需要以同样的方式接受邀请。</p><p>愿每一个线程都能找到他的舞伴，一起跳起精彩的舞蹈。</p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221349212.png" alt="image.png"></p><h2 id="读写锁" tabindex="-1">读写锁 <a class="header-anchor" href="#读写锁" aria-label="Permalink to &quot;读写锁&quot;">​</a></h2><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221350802.png" alt="image.png"></p><p>读写锁在并发编程中特别重要。它有两把锁，一个读锁也就是共享锁，一个写锁也就是排他锁。读锁之间不互斥，读锁和写锁互斥，写锁和写锁互斥。这就是读写锁的一个特性，利用了读和读之间不需要锁的限制。</p><p>说到 ReentrantReadWriteLock，要注意它是通过分割单一的 Integer 来为读锁和写锁定量的，具体来说如下：</p><ol><li>状态的高 16 位表示读锁定数量，也就是当前有多少线程同时获取了读锁。</li><li>状态的低 16 位表示写锁定数量，这个地方包括写锁重入的计数。</li></ol><p>然后我们来看你的两个例子：</p><ol><li><strong>场景一：读请求+读请求+写请求+同步锁</strong>：这是一个很正常的例子，前两个读请求无任何冲突，可以同时获得锁，也就是读锁的计数将会增加 2。写请求和同步锁请求过来时，它在读锁释放之前都不能获得锁。具体到 ReentrantReadWriteLock 就是它们检查整个 state 值是否大于 0，只要有读锁或写锁，后面的写锁和同步锁请求都必须等待。</li><li><strong>场景二：写请求+读请求+写请求+读请求</strong>：这个例子中，写请求来时获取了写锁，读取和其他写请求都必须等待。如果写锁释放了，所有等待的线程都会尝试获取锁，但这时任何一个写锁如果获取成功，都会导致其他所有等待的线程（不论读锁还是写锁）继续等待。在 ReentrantReadWriteLock 中，写请求总是优先于读取请求，这也是为了防止写饥饿。</li></ol><p>哈哈，这本质上就像是一个舞会。读取请求就像是爵士舞者，他们可以多人同时在舞池上跳舞。写锁就像是华尔兹舞者，他们在跳舞时，舞池不能有其他人。而抢锁的过程，就像是在排队等待用餐的过程，大家都是按照&quot;先来后到&quot;的原则，但是华尔兹舞者总是可以优先入场。</p>`,155),o=[p];function t(c,i,r,d,u,y){return n(),a("div",null,o)}const v=s(l,[["render",t]]);export{g as __pageData,v as default};
