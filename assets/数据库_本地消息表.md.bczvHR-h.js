import{_ as s,o as n,c as a,R as e}from"./chunks/framework.7FlijoJG.js";const u=JSON.parse('{"title":"本地消息表","description":"","frontmatter":{"title":"本地消息表","date":"2023-12-28T00:08:07.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"数据库/本地消息表.md","filePath":"数据库/本地消息表.md","lastUpdated":1711296414000}'),p={name:"数据库/本地消息表.md"},l=e(`<p>介绍一下本地消息表，本地消息表的方案最初是由 ebay 的工程师提出，核心思想是将分布式事务拆分成本地事务进行处理，通过消息日志的方式来异步执行。</p><p>本地消息表是一种业务耦合的设计，消息生产方需要额外建一个事务消息表，并记录消息发送状态，消息消费方需要处理这个消息，并完成自己的业务逻辑，另外会有一个异步机制来定期扫描未完成的消息，确保最终一致性。</p><p>下面我们用下单减库存业务来简单模拟本地消息表的实现过程：</p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312280008516.png" alt="image.png"></p><p>（1）系统收到下单请求，将订单业务数据存入到订单库中，并且同时存储该订单对应的消息数据，比如购买商品的 ID 和数量，消息数据与订单库为同一库，更新订单和存储消息为一个本地事务，要么都成功，要么都失败。</p><p>（2）库存服务通过消息中间件收到库存更新消息，调用库存服务进行业务操作，同时返回业务处理结果。</p><p>（3）消息生产方，也就是订单服务收到处理结果后，将本地消息表的数据删除或者设置为已完成。</p><p>（4）设置异步任务，定时去扫描本地消息表，发现有未完成的任务则重试，保证最终一致性。</p><p>以上就是基于本地消息表一致性的主流程，在具体实践中，还有许多分支情况，比如消息发送失败、下游业务方处理失败等，感兴趣的同学可以思考下。</p><p>我会为你提供一个简化版的“本地消息表”方案的代码样例。这个样例会涉及两个服务：订单服务和库存服务。在实际代码中，还需要做很多其他的工作，比如错误处理、重试策略等等。</p><p>首先，我们需要在订单服务中创建一个本地消息表：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">package</span><span style="color:#E1E4E8;"> com.example.orderservice;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> x.persistence.Entity;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> x.persistence.GeneratedValue;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> x.persistence.Id;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> x.persistence.Table;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">@</span><span style="color:#F97583;">Entity</span></span>
<span class="line"><span style="color:#E1E4E8;">@</span><span style="color:#F97583;">Table</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">name</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;local_message&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Message</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    @</span><span style="color:#F97583;">Id</span></span>
<span class="line"><span style="color:#E1E4E8;">    @</span><span style="color:#F97583;">GeneratedValue</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">int</span><span style="color:#E1E4E8;"> id;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> String content;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> processed;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// getters and setters...</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">package</span><span style="color:#24292E;"> com.example.orderservice;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> x.persistence.Entity;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> x.persistence.GeneratedValue;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> x.persistence.Id;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> x.persistence.Table;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">@</span><span style="color:#D73A49;">Entity</span></span>
<span class="line"><span style="color:#24292E;">@</span><span style="color:#D73A49;">Table</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">name</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;local_message&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Message</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Id</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">GeneratedValue</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> id;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> String content;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> processed;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// getters and setters...</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>然后，在创建订单时，我们同时在本地消息表中插入一条新的记录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">@Service</span></span>
<span class="line"><span style="color:#e1e4e8;">public class OrderService {</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    @Autowired</span></span>
<span class="line"><span style="color:#e1e4e8;">    private MessageRepository messageRepository;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    public void createOrder(Order order) {</span></span>
<span class="line"><span style="color:#e1e4e8;">        // 创建订单的业务逻辑...</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">        // 在本地消息表中插入一条新纪录</span></span>
<span class="line"><span style="color:#e1e4e8;">        Message message = new Message();</span></span>
<span class="line"><span style="color:#e1e4e8;">        message.setContent(order.getId());</span></span>
<span class="line"><span style="color:#e1e4e8;">        message.setProcessed(false);</span></span>
<span class="line"><span style="color:#e1e4e8;">        messageRepository.save(message);</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">@Service</span></span>
<span class="line"><span style="color:#24292e;">public class OrderService {</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    @Autowired</span></span>
<span class="line"><span style="color:#24292e;">    private MessageRepository messageRepository;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    public void createOrder(Order order) {</span></span>
<span class="line"><span style="color:#24292e;">        // 创建订单的业务逻辑...</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">        // 在本地消息表中插入一条新纪录</span></span>
<span class="line"><span style="color:#24292e;">        Message message = new Message();</span></span>
<span class="line"><span style="color:#24292e;">        message.setContent(order.getId());</span></span>
<span class="line"><span style="color:#24292e;">        message.setProcessed(false);</span></span>
<span class="line"><span style="color:#24292e;">        messageRepository.save(message);</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><p>最后，我们需要一个独立的线程或者定时任务定期扫描本地消息表，对未处理的消息进行处理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">@Component</span></span>
<span class="line"><span style="color:#e1e4e8;">public class MessageProcessor {</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">  @Autowired</span></span>
<span class="line"><span style="color:#e1e4e8;">  private MessageRepository messageRepository;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">  @Autowired</span></span>
<span class="line"><span style="color:#e1e4e8;">  private InventoryServiceClient inventoryServiceClient;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">  @Scheduled(fixedRate = 5000)</span></span>
<span class="line"><span style="color:#e1e4e8;">  public void processMessages() {</span></span>
<span class="line"><span style="color:#e1e4e8;">    List&lt;Message&gt; unprocessedMessages = messageRepository.findByProcessed(false);</span></span>
<span class="line"><span style="color:#e1e4e8;">    for (Message message : unprocessedMessages) {</span></span>
<span class="line"><span style="color:#e1e4e8;">      boolean success = inventoryServiceClient.decreaseInventory(message.getContent());</span></span>
<span class="line"><span style="color:#e1e4e8;">      if (success) {</span></span>
<span class="line"><span style="color:#e1e4e8;">        message.setProcessed(true);</span></span>
<span class="line"><span style="color:#e1e4e8;">        messageRepository.save(message);</span></span>
<span class="line"><span style="color:#e1e4e8;">      }</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">  }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">@Component</span></span>
<span class="line"><span style="color:#24292e;">public class MessageProcessor {</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  @Autowired</span></span>
<span class="line"><span style="color:#24292e;">  private MessageRepository messageRepository;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  @Autowired</span></span>
<span class="line"><span style="color:#24292e;">  private InventoryServiceClient inventoryServiceClient;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  @Scheduled(fixedRate = 5000)</span></span>
<span class="line"><span style="color:#24292e;">  public void processMessages() {</span></span>
<span class="line"><span style="color:#24292e;">    List&lt;Message&gt; unprocessedMessages = messageRepository.findByProcessed(false);</span></span>
<span class="line"><span style="color:#24292e;">    for (Message message : unprocessedMessages) {</span></span>
<span class="line"><span style="color:#24292e;">      boolean success = inventoryServiceClient.decreaseInventory(message.getContent());</span></span>
<span class="line"><span style="color:#24292e;">      if (success) {</span></span>
<span class="line"><span style="color:#24292e;">        message.setProcessed(true);</span></span>
<span class="line"><span style="color:#24292e;">        messageRepository.save(message);</span></span>
<span class="line"><span style="color:#24292e;">      }</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><p>这样，当订单服务创建订单时，会同时在本地消息表中插入一条消息；然后消息处理器会定期处理这些消息，调用库存服务的 API 进行库存扣减。</p><p>但是，真正实现这个“本地消息表”方案还远不止如此，你还需要考虑消息的持久性，处理时序颠倒，幂等性等问题，需要自己去设计解决方案。而且，本地消息表方案只适用于确保至少执行一次的业务场景。如果你的业务要求“恰好执行一次”，那么你可能需要使用别的事务解决方案。</p>`,18),o=[l];function c(t,r,i,y,d,E){return n(),a("div",null,o)}const v=s(p,[["render",c]]);export{u as __pageData,v as default};
