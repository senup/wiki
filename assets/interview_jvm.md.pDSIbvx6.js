import{_ as s,o as a,c as n,R as e}from"./chunks/framework.7FlijoJG.js";const m=JSON.parse('{"title":"jvm","description":"","frontmatter":{"title":"jvm","date":"2023-11-29T22:56:08.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"interview/jvm.md","filePath":"interview/jvm.md","lastUpdated":1703254130000}'),l={name:"interview/jvm.md"},p=e(`<h3 id="元空间溢出" tabindex="-1">元空间溢出 <a class="header-anchor" href="#元空间溢出" aria-label="Permalink to &quot;元空间溢出&quot;">​</a></h3><p>元空间（Metaspace）是 Java 8 之后取代了永久代（PermGen）的内存区域，用于存储类的元数据信息，比如类名、方法名、字段信息等。元空间默认是不限制大小的，它是直接使用本机的内存而不是 Java 堆内存。元空间溢出通常是由于加载了大量的类或者动态生成的类导致的。</p><p>元空间溢出可以通过以下几种方式触发：</p><ol><li><strong>加载大量类或生成大量动态代理类</strong>：如果程序中频繁地加载大量的类或者使用动态生成类的方式，会导致元空间占用过多内存而溢出。</li><li><strong>限制元空间大小</strong>：通过 JVM 参数<code>-XX:MaxMetaspaceSize</code>来限制元空间的大小，当达到这个限制时就会触发溢出。</li></ol><p>示例代码可以模拟加载大量类的情况：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">import java.util.ArrayList;</span></span>
<span class="line"><span style="color:#e1e4e8;">import java.util.List;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">public class MetaspaceOOM {</span></span>
<span class="line"><span style="color:#e1e4e8;">    public static void main(String[] args) {</span></span>
<span class="line"><span style="color:#e1e4e8;">        List&lt;Class&lt;?&gt;&gt; classes = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span style="color:#e1e4e8;">        while (true) {</span></span>
<span class="line"><span style="color:#e1e4e8;">            Class&lt;?&gt; clazz = generateClass();</span></span>
<span class="line"><span style="color:#e1e4e8;">            classes.add(clazz);</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    private static Class&lt;?&gt; generateClass() {</span></span>
<span class="line"><span style="color:#e1e4e8;">        // 动态生成类并返回</span></span>
<span class="line"><span style="color:#e1e4e8;">        // ...</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">import java.util.ArrayList;</span></span>
<span class="line"><span style="color:#24292e;">import java.util.List;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">public class MetaspaceOOM {</span></span>
<span class="line"><span style="color:#24292e;">    public static void main(String[] args) {</span></span>
<span class="line"><span style="color:#24292e;">        List&lt;Class&lt;?&gt;&gt; classes = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span style="color:#24292e;">        while (true) {</span></span>
<span class="line"><span style="color:#24292e;">            Class&lt;?&gt; clazz = generateClass();</span></span>
<span class="line"><span style="color:#24292e;">            classes.add(clazz);</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    private static Class&lt;?&gt; generateClass() {</span></span>
<span class="line"><span style="color:#24292e;">        // 动态生成类并返回</span></span>
<span class="line"><span style="color:#24292e;">        // ...</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><h3 id="栈空间溢出" tabindex="-1">栈空间溢出 <a class="header-anchor" href="#栈空间溢出" aria-label="Permalink to &quot;栈空间溢出&quot;">​</a></h3><p>栈空间（Stack）是线程私有的，用于存储线程的方法调用、局部变量等信息。栈空间是有限制的，当线程的方法调用层级过深或者每个方法调用所使用的栈空间过大时，会触发栈空间溢出（StackOverflowError）。</p><p>栈空间溢出可以通过以下方式触发：</p><ol><li><strong>递归调用过深</strong>：如果一个方法递归调用的层级过深，导致方法调用链过长，栈空间可能会耗尽。</li><li><strong>每个方法使用的栈空间过大</strong>：如果方法中使用了大量的局部变量或者大对象，会占用大量栈空间，导致栈空间溢出。</li></ol><p>示例代码可以模拟栈空间溢出：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">public class StackOverflowExample {</span></span>
<span class="line"><span style="color:#e1e4e8;">    public static void main(String[] args) {</span></span>
<span class="line"><span style="color:#e1e4e8;">        stackOverflowMethod();</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    private static void stackOverflowMethod() {</span></span>
<span class="line"><span style="color:#e1e4e8;">        stackOverflowMethod(); // 递归调用导致栈溢出</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">public class StackOverflowExample {</span></span>
<span class="line"><span style="color:#24292e;">    public static void main(String[] args) {</span></span>
<span class="line"><span style="color:#24292e;">        stackOverflowMethod();</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    private static void stackOverflowMethod() {</span></span>
<span class="line"><span style="color:#24292e;">        stackOverflowMethod(); // 递归调用导致栈溢出</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h3 id="gc-停顿" tabindex="-1">gc 停顿 <a class="header-anchor" href="#gc-停顿" aria-label="Permalink to &quot;gc 停顿&quot;">​</a></h3><p>垃圾回收（GC）停顿指的是在进行垃圾回收时，应用程序的执行会被暂停。停顿可能会对应用程序的响应性和性能产生影响。主要有以下几种情况会导致 GC 停顿：</p><ol><li><strong>全停顿（Full GC）</strong>：在进行全局垃圾回收时，会触发全停顿。在进行 Full GC 期间，所有的应用线程都会被暂停。这种停顿在一些场景下会比较显著，特别是当堆内存较大且垃圾回收器需要执行长时间的清理时。</li><li><strong>年轻代 GC 停顿</strong>：年轻代（Young Generation）的垃圾回收，即 Minor GC，也会导致短暂的停顿。这种停顿一般较短，因为年轻代的垃圾回收通常会在新生代中进行，只会影响新生代的对象。</li><li><strong>老年代 GC 停顿</strong>：对于老年代（Old Generation）的垃圾回收，即 Major GC 或 Full GC，停顿时间可能较长，特别是在清理老年代的大对象或者执行多次 Minor GC 后需要进行 Full GC 时。</li></ol><p>控制 GC 停顿的方法主要包括：</p><ol><li><strong>优化垃圾回收器选择</strong>：不同的垃圾回收器（如 CMS、G1、ZGC、Shenandoah 等）有不同的特性，一些垃圾回收器专注于降低停顿时间。</li><li><strong>调整垃圾回收参数</strong>：可以通过调整堆大小、GC 算法、触发 GC 的阈值等参数来影响 GC 的行为。比如，增加堆内存大小可能会减少 GC 的频率，减少停顿时间。</li><li><strong>并行和并发处理</strong>：一些垃圾回收器使用并行和并发的方式来执行垃圾回收，尽量减少应用程序的停顿时间。这些方式会在不同场景下有不同的适用性。</li><li><strong>优化对象分配和回收</strong>：减少对象的频繁分配和及时释放不再使用的对象可以减少 GC 的频率和停顿时间。</li><li><strong>合理的 GC 策略</strong>：根据应用的实际情况选择合适的 GC 策略和参数配置，对于不同的应用场景可能需要针对性地进行调优。</li></ol><p>GC 停顿的控制并非简单的一种设置，需要结合应用程序的实际情况和性能需求进行综合考量和优化。</p>`,18),t=[p];function r(c,o,i,d,b,u){return a(),n("div",null,t)}const y=s(l,[["render",r]]);export{m as __pageData,y as default};
