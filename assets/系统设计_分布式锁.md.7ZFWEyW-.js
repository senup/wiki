import{_ as s,o as n,c as e,R as a}from"./chunks/framework.7FlijoJG.js";const q=JSON.parse('{"title":"分布式锁","description":"","frontmatter":{"title":"分布式锁","date":"2023-12-23T18:49:40.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"系统设计/分布式锁.md","filePath":"系统设计/分布式锁.md","lastUpdated":1711296414000}'),l={name:"系统设计/分布式锁.md"},p=a(`<h2 id="设计一个分布式锁" tabindex="-1">设计一个分布式锁 <a class="header-anchor" href="#设计一个分布式锁" aria-label="Permalink to &quot;设计一个分布式锁&quot;">​</a></h2><p>生成一个全局唯一的键并不一定要在代码层面实现，最重要的是这个键要能够在整个分布式环境下保持唯一。</p><p>假设我们使用的是 Java 的 Spring 框架和 jedis 客户端，而锁的生成逻辑如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">import redis.clients.jedis.Jedis;</span></span>
<span class="line"><span style="color:#e1e4e8;">import java.lang.management.ManagementFactory;</span></span>
<span class="line"><span style="color:#e1e4e8;">import java.net.InetAddress;</span></span>
<span class="line"><span style="color:#e1e4e8;">import java.net.UnknownHostException;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">public class RedisDistributedLock {</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    private static final String LOCK_PREFIX = &quot;lock:&quot;;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    private String lockKey;</span></span>
<span class="line"><span style="color:#e1e4e8;">    private String requestId;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    public RedisDistributedLock(String keySuffix) {</span></span>
<span class="line"><span style="color:#e1e4e8;">        this.lockKey = LOCK_PREFIX + keySuffix;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">        try {</span></span>
<span class="line"><span style="color:#e1e4e8;">            String jvmName = ManagementFactory.getRuntimeMXBean().getName();</span></span>
<span class="line"><span style="color:#e1e4e8;">            String ip = InetAddress.getLocalHost().getHostAddress();</span></span>
<span class="line"><span style="color:#e1e4e8;">            String threadName = Thread.currentThread().getName();</span></span>
<span class="line"><span style="color:#e1e4e8;">            long threadId = Thread.currentThread().getId();</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">            this.requestId = String.format(&quot;%s-%s-%s-%d&quot;, jvmName, ip, threadName, threadId);</span></span>
<span class="line"><span style="color:#e1e4e8;">        } catch (UnknownHostException e) {</span></span>
<span class="line"><span style="color:#e1e4e8;">            throw new RuntimeException(&quot;Error generating unique request ID&quot;, e);</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    public boolean tryLock(Jedis jedis) {</span></span>
<span class="line"><span style="color:#e1e4e8;">        String result = jedis.set(lockKey, requestId, &quot;NX&quot;, &quot;PX&quot;, 10000);</span></span>
<span class="line"><span style="color:#e1e4e8;">        return &quot;OK&quot;.equals(result);</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    public boolean releaseLock(Jedis jedis) {</span></span>
<span class="line"><span style="color:#e1e4e8;">        String script =</span></span>
<span class="line"><span style="color:#e1e4e8;">        &quot;if redis.call(&#39;get&#39;, KEYS[1]) == ARGV[1] then &quot; +</span></span>
<span class="line"><span style="color:#e1e4e8;">            &quot;return redis.call(&#39;del&#39;, KEYS[1]) &quot; +</span></span>
<span class="line"><span style="color:#e1e4e8;">        &quot;else return 0 end&quot;;</span></span>
<span class="line"><span style="color:#e1e4e8;">        Object result = jedis.eval(script, Collections.singletonList(lockKey), Collections.singletonList(requestId));</span></span>
<span class="line"><span style="color:#e1e4e8;">        return &quot;1&quot;.equals(result.toString());</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">import redis.clients.jedis.Jedis;</span></span>
<span class="line"><span style="color:#24292e;">import java.lang.management.ManagementFactory;</span></span>
<span class="line"><span style="color:#24292e;">import java.net.InetAddress;</span></span>
<span class="line"><span style="color:#24292e;">import java.net.UnknownHostException;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">public class RedisDistributedLock {</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    private static final String LOCK_PREFIX = &quot;lock:&quot;;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    private String lockKey;</span></span>
<span class="line"><span style="color:#24292e;">    private String requestId;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    public RedisDistributedLock(String keySuffix) {</span></span>
<span class="line"><span style="color:#24292e;">        this.lockKey = LOCK_PREFIX + keySuffix;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">        try {</span></span>
<span class="line"><span style="color:#24292e;">            String jvmName = ManagementFactory.getRuntimeMXBean().getName();</span></span>
<span class="line"><span style="color:#24292e;">            String ip = InetAddress.getLocalHost().getHostAddress();</span></span>
<span class="line"><span style="color:#24292e;">            String threadName = Thread.currentThread().getName();</span></span>
<span class="line"><span style="color:#24292e;">            long threadId = Thread.currentThread().getId();</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">            this.requestId = String.format(&quot;%s-%s-%s-%d&quot;, jvmName, ip, threadName, threadId);</span></span>
<span class="line"><span style="color:#24292e;">        } catch (UnknownHostException e) {</span></span>
<span class="line"><span style="color:#24292e;">            throw new RuntimeException(&quot;Error generating unique request ID&quot;, e);</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    public boolean tryLock(Jedis jedis) {</span></span>
<span class="line"><span style="color:#24292e;">        String result = jedis.set(lockKey, requestId, &quot;NX&quot;, &quot;PX&quot;, 10000);</span></span>
<span class="line"><span style="color:#24292e;">        return &quot;OK&quot;.equals(result);</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    public boolean releaseLock(Jedis jedis) {</span></span>
<span class="line"><span style="color:#24292e;">        String script =</span></span>
<span class="line"><span style="color:#24292e;">        &quot;if redis.call(&#39;get&#39;, KEYS[1]) == ARGV[1] then &quot; +</span></span>
<span class="line"><span style="color:#24292e;">            &quot;return redis.call(&#39;del&#39;, KEYS[1]) &quot; +</span></span>
<span class="line"><span style="color:#24292e;">        &quot;else return 0 end&quot;;</span></span>
<span class="line"><span style="color:#24292e;">        Object result = jedis.eval(script, Collections.singletonList(lockKey), Collections.singletonList(requestId));</span></span>
<span class="line"><span style="color:#24292e;">        return &quot;1&quot;.equals(result.toString());</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><p>构造方法中，我们使用 <code>JVMName、IP、ThreadName 和 ThreadId</code> 生成 requestId（你的每个请求应具备独特标识）。然后在<code>tryLock()</code>方法中，我们通过 SETNX 操作设置锁，并通过<code>releaseLock()</code>执行 Lua 脚本完成对锁的释放。</p>`,5),t=[p];function o(c,r,i,d,u,y){return n(),e("div",null,t)}const m=s(l,[["render",o]]);export{q as __pageData,m as default};
