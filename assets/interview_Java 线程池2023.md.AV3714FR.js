import{_ as s,o as n,c as e,R as a}from"./chunks/framework.7FlijoJG.js";const m=JSON.parse('{"title":"Java 线程池","description":"","frontmatter":{"title":"Java 线程池","date":"2023-12-22T13:36:13.000Z","tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"interview/Java 线程池2023.md","filePath":"interview/Java 线程池2023.md","lastUpdated":1703254130000}'),l={name:"interview/Java 线程池2023.md"},p=a(`<p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221336660.png" alt="image.png"></p><h2 id="线程池的核心参数" tabindex="-1">线程池的核心参数 <a class="header-anchor" href="#线程池的核心参数" aria-label="Permalink to &quot;线程池的核心参数&quot;">​</a></h2><p>想象我们要举办一个派对，这个派对就是我们的任务数。每个参加我们派对的人，都可以被看作是一个个独立的线程。看明白了吗？好，现在让我们来建立我们的派对吧。</p><p>首先，我们先来看&quot;coreSize&quot;，这就好比你的派对里可以容纳的核心嘉宾数量，也可以说是理想状态下你希望能够参与你派对的人的数量。</p><p>接下来，是&quot;maximumSize&quot;。这是你派对的极限，也就是你的派对地点所能承载的最大人数。毕竟，即使你的朋友再多，你的派对地点也容不下无限人吧。这与 Java 线程池的最大线程数一样，即使我们的任务再多，我们也不能无限地派发线程。</p><p>再者，讲到&quot;delayTime&quot;，不难看出这应该是一种时间概念，实则是我们的独待时间。想象一下，你的核心嘉宾如果超过了这个时间还没有来到你的派对，说明他可能由于某种原因没法来，然后该位置就要留给其他客人了，比如等待的任务。</p><p>最后，我们看看&quot;queue&quot;。这就像是一个等待区，把那些想进入派对但派对地点已经没有位置的人放在一起，当派对地点有位置让出来时，他们就可以进场参与派对，也就是可以开始执行任务了。</p><p>这样，多线程的核心参数的概念是不是就清楚多了？对了，这些都是线程池 ExecutorService 框架中 ThreadPoolExecutor 类的代码参数。</p><h2 id="任务提交流程" tabindex="-1">任务提交流程 <a class="header-anchor" href="#任务提交流程" aria-label="Permalink to &quot;任务提交流程&quot;">​</a></h2><p>你可以想象一下，在一个办公室里，有一位商务助理接收每一个新的任务，并根据固定的流程来处理他们。在 Java 的多线程环境中，任务提交流程大体上就是这个样子的，现在让我们来看一看具体是什么样子的。</p><ol><li>当任务（这是那个新的工作申请）首次提交时，商务助理（线程池）首先会核查当前的正在处理任务的员工（线程）数量是否已经达到了核心线程数&quot;coreSize&quot;。如果没有，商务助理就会新雇用一个员工来处理这个任务；但如果已经达到了核心线程数，这个新任务就需要等待一下。</li><li>受理的新任务如果不能立即有员工来处理，它就会进入到等待区(queue)，这个等待区就是那个“排队等待的场所”。它会整齐排队等待被处理。</li><li>如果等待区(queue)已经满了，也就是说，已经没有足够的空间容纳更多等待处理的任务，这时，商务助理（线程池）就需要做出决定了：要么雇用额外的员工（线程），直到达到&quot;maximumSize&quot;；要么对于新进来的任务直接说“不”，无法接受，也就是抛出 RejectedExecutionException。</li><li>当等待区的任务被取出来分配给一个员工（线程）处理，它就从队列中出列。然后使用适当的工作策略（涉及到线程的运行、优先级等因素）开始执行任务。</li><li>最后，当一个任务被完成，员工（线程）就可以选择去等待区（queue）拿新的任务进行处理，如果等待区没有新任务，而且这个员工被设定为可以自动退出的，那么过一段时间之后，他们就会“被解约”，也就是线程被结束掉。</li></ol><p>我希望这个办公室的场景可以帮助你更好地理解线程池中的任务提交流程。 <img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221337838.png" alt="image.png"></p><h2 id="创建-worker" tabindex="-1">创建 worker <a class="header-anchor" href="#创建-worker" aria-label="Permalink to &quot;创建 worker&quot;">​</a></h2><p>我们现在就重点分析一下 ThreadPoolExecutor 中添加 worker 线程的流程。</p><p>在描述这个过程之前，我们先看看 ThreadPoolExecutor 中的两个字段：</p><ul><li><code>workers</code>： workers 是一个 HashSet，用于保存线程池中的工作线程 Worker，而 Worker 是 ThreadPoolExecutor 的一个内部类，封装了线程（Thread）和 Runnable 对象。</li><li><code>ctl</code>： ctl 是一个 AtomicInteger 类，高三位表示线程池状态，低二十九位表示线程数量。</li></ul><p>好，现在让我们一步步看看 addWorker 方法的流程：</p><ol><li>首先要判断传入的参数是否符合预期，也就是判断当前线程数是否小于 corePoolSize 或者是否允许创建非核心线程。</li><li>让我们看看第一次尝试添加 worker。如果当前的线程数少于<code>corePoolSize</code>，那就会尝试创建并启动一个核心线程，此时如果添加失败（可能线程池状态已经改变或者线程数已经超过阈值），会直接返回 false。如果当前线程数等于或者超过了<code>corePoolSize</code>，那么会尝试加入到队列中。</li><li>如果加入到队列成功，会进行第二次尝试，先检查线程池的状态，如果是 RUNNING，就创建并启动新线程；如果状态不是 RUNNING，就移除这个任务，返回 false。如果线程池的状态是 RUNNING，但是发现没有创建任何线程，那就会移除这个任务并尝试添加新的 worker。</li><li>如果以上尝试都失败，那就尝试创建并启动非核心线程。</li></ol><p>如果最终创建并启动线程成功，就会返回 true，否则返回 false。 <img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221338243.png" alt="image.png"></p><h2 id="worker-执行任务" tabindex="-1">worker 执行任务 <a class="header-anchor" href="#worker-执行任务" aria-label="Permalink to &quot;worker 执行任务&quot;">​</a></h2><p>现在让我们深入探讨一下线程池中的 Worker 是如何执行任务的。</p><p>我们知道，在 ThreadPoolExecutor 中，真正执行任务的地方是 Worker 类的 run 方法，具体来说，这个过程包括以下几步：</p><ol><li>首先，Worker 的 run 方法会调用 runWorker 方法，参数就是 worker 自己。</li><li>runWorker 方法中，线程将会按照一定的顺序来选择任务进行执行。首先，线程会执行自己当前的首个任务（A task）。然后再从阻塞队列中取出任务执行。当阻塞队列为空或者无法取到任务时，runWorker 方法将会停止执行。</li><li>在 runWorker 方法里，还会调用 getTask 方法从阻塞队列中获取任务。这是一个阻塞方法，如果获取不到任务，线程将会被挂起等待，直到队列中有新的任务添加进来。注意 getTask 的挂起条件是线程池处于 RUNNING 状态或者队列非空。</li><li>在 getTask 方法中，如果线程池已经停止，或者线程池允许回收核心线程的情况下，当前线程空闲时间超过 keepAliveTime，那么获取任务失败，getTask 返回 null，随后 runWorker 方法会返回，线程任务运行结束。</li><li>任务的运行是在 Worker 的 run 方法中先调用了 beforeExecute 方法，然后在 try 代码块中执行 Runnable.run 方法，执行完毕后，无论是否遇到异常，都会执行 afterExecute 方法，这个方法用于收尾工作，比如资源释放等。</li><li>当 Runnable.run()执行完成或者遇到异常导致出现问题时，Worker 会调用 processWorkerExit 方法进行退出处理。这个方法会从线程池中移除当前线程，并检查是否需要终止线程池。</li></ol><p>这一系列步骤就是一个 Worker 执行任务的整个过程。看起来可能有些复杂，但只要你懂得他的执行逻辑，就能写出执行效率更高，更健壮的并发程序。</p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221339992.png" alt="image.png"></p><h2 id="获取任务" tabindex="-1">获取任务 <a class="header-anchor" href="#获取任务" aria-label="Permalink to &quot;获取任务&quot;">​</a></h2><p>获取任务的主流程是在 getTask()方法中，我会尽量简明得说明它：</p><ol><li>首先要弄清楚一个逻辑，只有队列非空才可以获取到任务，所以要先检查一下队列是否是空的，如果是空的，就会进入一个无限循环，一直到队列中有任务。</li><li>在这个无限循环中，线程会先判断是否可以上班（也就是线程池是否是 RUNNING 状态）。如果不可以，就会返回 null，此时 Worker 就会退出。</li><li>如果线程池状态是 RUNNING，那么就再一次检查当前队列是否为空，如果为空则继续等待。</li><li>当前线程如果空闲时间超过了 keepAliveTime，或线程池允许回收核心线程，那么 getTask 方法返回 null，进而 Worker 会停止工作。</li><li>如果线程池状态，队列状态，以及线程运行状态都符合预期，就会调用 poll 方法获取任务。阻塞队列的 poll 方法是一个阻塞方法，如果在指定时间内没有获取到任务，那么这个方法将会挂起线程。</li><li>如果最终获取到了任务，就返回这个任务，并且跳出挂起的循环。</li></ol><p>综上，getTask()方法的主要工作就是在执行过程中检查线程池状态，根据状态决定是否需要继续获取任务，或者超时返回 null 以结束 Worker 的运行。</p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221339771.png" alt="image.png"></p><h2 id="worker-销毁" tabindex="-1">worker 销毁 <a class="header-anchor" href="#worker-销毁" aria-label="Permalink to &quot;worker 销毁&quot;">​</a></h2><p>我们一起了解一下 Worker 的销毁过程，或者可以说是“让 Worker 退休”的过程，这个过程封装在了 processWorkerExit 方法中。</p><ol><li>这个方法首先会设置线程池的最大线程数，因为 worker 退出了，线程池的线程数量需要减 1。</li><li>接下来，会进行一次状态检查，如果线程池是 STOP 或者 TIDYING 状态（需要清理资源）且队列为空，那么就会将线程池状态设置为 TIDYING，并执行 terminated 方法进行线程池的最后清理。</li><li>然后会判断是否需要创建新的线程。这通常发生在队列非空但没有线程来处理队列的任务，这时候就需要创建一个新的 worker 来处理这些任务。</li><li>最后，从 workers set 中移除退出的 Worker，并进行条件检查。如果线程池已经完成终止过程，就调用 tryTerminate 方法尝试终止线程池。</li></ol><p>我们的线程池就像是个工厂，而 Worker 就是这个工厂中的工人。当一个工人完成他的工作，或者“退休”时，工厂需要重新调整工作人力，可能会有新的工人入职，也可能是整个工厂都已经没有工作需要完成，那么这个工厂也就可以关闭了。</p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221339932.png" alt="image.png"></p><h2 id="线程池关闭流程" tabindex="-1">线程池关闭流程 <a class="header-anchor" href="#线程池关闭流程" aria-label="Permalink to &quot;线程池关闭流程&quot;">​</a></h2><p>让我们一起看看 Java 线程池关闭的流程，这基本上建立在两个方法上：shutdown 和 shutdownNow。</p><ol><li><p><code>shutdown()</code> ：这个是优雅关闭，它会遍历所有的 workers，中断空闲线程，然后将线程池的状态设置为 SHUTDOWN，代表线程池不再接收新的任务，但是会继续处理阻塞队列中存在的任务。</p></li><li><p><code>shutdownNow()</code> ：</p><ul><li>首先，这个方法会将线程池的状态设置为 STOP，代表线程池不再接收新的任务，同时也强制中断当前正在执行的任务。</li><li>接着，它会复制一份工作队列副本返回，这样如果有需要你可以知道线程池关闭时还有什么任务未被执行。</li><li>然后，这个方法会尝试停止所有的活跃（isAlive）的 workers。</li></ul></li></ol><p>以上，shutdown()和 shutdownNow()就是关闭线程池最主要的两个方法。两者的区别主要在于，shutdown()比较温和些，会等待所有的任务执行完毕，而 shutdownNow()就像倒数第二秒的炸弹一样，选择在这个时候终止所有的任务。 <img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221340839.png" alt="image.png"></p><h2 id="常见线程池" tabindex="-1">常见线程池 <a class="header-anchor" href="#常见线程池" aria-label="Permalink to &quot;常见线程池&quot;">​</a></h2><ol><li><code>FixedThreadPool</code>： 创建一个固定数量的线程池，每个线程使用无界的队列，当所有线程均处于活动状态时，新任务会等待队列中的空余空间。</li><li><code>CachedThreadPool</code>：创建一个根据需要（新任务到来时）会创建新线程的线程池，但在以前构建的线程可用时将重用它们。对于执行很多短期异步任务的程序来说，这种线程池通常可以提供方便的服务。</li><li><code>ScheduledThreadPool</code>： 创建一个可在给定延迟后运行或定期执行任务的线程池。</li><li><code>SingleThreadExecutor</code>：创建仅包含单个工作线程的线程池，所有任务都是保证按照任务到达的顺序执行。</li></ol><table><thead><tr><th>#</th><th>类型</th><th>核心数量</th><th>最大数量</th><th>非核心线程超时时间</th><th>队列</th><th>应用场景</th></tr></thead><tbody><tr><td>1</td><td>FixedThreadPool</td><td>固定</td><td>固定</td><td>不会被回收</td><td>LinkedBlockingQueue</td><td>适用于长期运行的任务</td></tr><tr><td>2</td><td>CachedThreadPool</td><td>0</td><td>Integer.MAX_VALUE</td><td>60s</td><td>SynchronousQueue</td><td>适用于执行大量的、耗时少的任务</td></tr><tr><td>3</td><td>ScheduledThreadPool</td><td>固定</td><td>Integer.MAX_VALUE</td><td>不会被回收</td><td>DelayedWorkQueue</td><td>适用于需要周期性或者延迟执行任务的场景</td></tr><tr><td>4</td><td>SingleThreadExecutor</td><td>1</td><td>1</td><td>不会被回收</td><td>LinkedBlockingQueue</td><td>适用于需要保证任务按顺序执行的场景</td></tr></tbody></table><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221340765.png" alt="image.png"></p><h2 id="abc-三个线程要顺序执行-可以怎么实现呢" tabindex="-1">abc 三个线程要顺序执行，可以怎么实现呢 <a class="header-anchor" href="#abc-三个线程要顺序执行-可以怎么实现呢" aria-label="Permalink to &quot;abc 三个线程要顺序执行，可以怎么实现呢&quot;">​</a></h2><p>Java 中的 join()方法正好可以满足这个要求。</p><p>现在假设我们有三个线程，分别是线程 A、线程 B 和线程 C。我们希望它们顺序执行，那么我们可以让 B 线程在 A 线程的基础上启动，在 B 线程启动之后，再在 B 线程的基础上启动 C 线程。这样，就可以保证这三个线程的执行顺序。下面就是具体的实现代码：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">Thread A = new Thread(new Runnable() {</span></span>
<span class="line"><span style="color:#e1e4e8;">    public void run() {</span></span>
<span class="line"><span style="color:#e1e4e8;">        System.out.println(&quot;A&quot;);</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">});</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">Thread B = new Thread(new Runnable() {</span></span>
<span class="line"><span style="color:#e1e4e8;">    public void run() {</span></span>
<span class="line"><span style="color:#e1e4e8;">        try {</span></span>
<span class="line"><span style="color:#e1e4e8;">            A.join();</span></span>
<span class="line"><span style="color:#e1e4e8;">        } catch (InterruptedException e) {</span></span>
<span class="line"><span style="color:#e1e4e8;">            e.printStackTrace();</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">        System.out.println(&quot;B&quot;);</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">});</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">Thread C = new Thread(new Runnable() {</span></span>
<span class="line"><span style="color:#e1e4e8;">    public void run() {</span></span>
<span class="line"><span style="color:#e1e4e8;">        try {</span></span>
<span class="line"><span style="color:#e1e4e8;">            B.join();</span></span>
<span class="line"><span style="color:#e1e4e8;">        } catch (InterruptedException e) {</span></span>
<span class="line"><span style="color:#e1e4e8;">            e.printStackTrace();</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">        System.out.println(&quot;C&quot;);</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">});</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">// 这里需要反着启动，为的是让A线程先执行</span></span>
<span class="line"><span style="color:#e1e4e8;">C.start();</span></span>
<span class="line"><span style="color:#e1e4e8;">B.start();</span></span>
<span class="line"><span style="color:#e1e4e8;">A.start();</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">Thread A = new Thread(new Runnable() {</span></span>
<span class="line"><span style="color:#24292e;">    public void run() {</span></span>
<span class="line"><span style="color:#24292e;">        System.out.println(&quot;A&quot;);</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">});</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">Thread B = new Thread(new Runnable() {</span></span>
<span class="line"><span style="color:#24292e;">    public void run() {</span></span>
<span class="line"><span style="color:#24292e;">        try {</span></span>
<span class="line"><span style="color:#24292e;">            A.join();</span></span>
<span class="line"><span style="color:#24292e;">        } catch (InterruptedException e) {</span></span>
<span class="line"><span style="color:#24292e;">            e.printStackTrace();</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">        System.out.println(&quot;B&quot;);</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">});</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">Thread C = new Thread(new Runnable() {</span></span>
<span class="line"><span style="color:#24292e;">    public void run() {</span></span>
<span class="line"><span style="color:#24292e;">        try {</span></span>
<span class="line"><span style="color:#24292e;">            B.join();</span></span>
<span class="line"><span style="color:#24292e;">        } catch (InterruptedException e) {</span></span>
<span class="line"><span style="color:#24292e;">            e.printStackTrace();</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">        System.out.println(&quot;C&quot;);</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">});</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">// 这里需要反着启动，为的是让A线程先执行</span></span>
<span class="line"><span style="color:#24292e;">C.start();</span></span>
<span class="line"><span style="color:#24292e;">B.start();</span></span>
<span class="line"><span style="color:#24292e;">A.start();</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div></div><p>线程的 join 方法可以使得线程之间的并行执行变为串行执行。调用某线程的 join 方法会阻塞当前线程，等待该线程执行完毕，当前线程才会继续执行。</p>`,48),r=[p];function o(t,i,c,u,d,h){return n(),e("div",null,r)}const y=s(l,[["render",o]]);export{m as __pageData,y as default};
