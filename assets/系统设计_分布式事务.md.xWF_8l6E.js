import{_ as s,o as n,c as a,R as l}from"./chunks/framework.7FlijoJG.js";const A=JSON.parse('{"title":"分布式事务","description":"","frontmatter":{"title":"分布式事务","date":"2023-12-25T15:47:44.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"系统设计/分布式事务.md","filePath":"系统设计/分布式事务.md","lastUpdated":1711296414000}'),p={name:"系统设计/分布式事务.md"},o=l(`<h2 id="分布式事务和-mysql-事务中的一致性怎么区别怎么理解" tabindex="-1">分布式事务和 mysql 事务中的一致性怎么区别怎么理解 <a class="header-anchor" href="#分布式事务和-mysql-事务中的一致性怎么区别怎么理解" aria-label="Permalink to &quot;分布式事务和 mysql 事务中的一致性怎么区别怎么理解&quot;">​</a></h2><p>Mysql 事务更多地关注单个系统的一致性，保证数据库的状态是一致的；</p><p>而分布式事务更多的关注的是多个系统间的一致性，保证所有相关系统的状态都是一致的。</p><h2 id="分布式事务中的状态一致性是怎么实现的" tabindex="-1">分布式事务中的状态一致性是怎么实现的？ <a class="header-anchor" href="#分布式事务中的状态一致性是怎么实现的" aria-label="Permalink to &quot;分布式事务中的状态一致性是怎么实现的？&quot;">​</a></h2><p>在分布式事务中，确保所有相关系统的状态一致通常需要使用某种协调机制。</p><p>一种常见的策略是用两阶段提交（2PC）协议。它的工作流程可以用饭店点菜来比喻：</p><ol><li>阶段一：预提交阶段。这就是你告诉服务员你要点什么菜，但是服务员还没有下单给厨师。在分布式事务中，这个阶段就是每个系统都准备执行事务，但并没有真的执行。</li><li>阶段二：提交阶段。当每个系统都准备好了（菜品都点好了），事务协调者会告诉每个系统可以执行事务了（服务员把订单交给厨房）。但是，如果任何一个系统没有准备好(菜品没货了)，事务协调者会告诉每个系统取消事务(换个菜品)。</li></ol><p>另一种协议是三阶段提交，简单来说就多了一个“准备提交”的阶段，类似于服务员再次确认你的订单是否正确。</p><p>但这些协议都有其局限性，比如可能会出现阻塞甚至导致系统崩溃。因此现在流行的解决办法往往采用更灵活的&quot;最终一致性&quot;策略，如 Saga 模式，每个微服务执行本地事务并触发相应的事件，作用就像餐厅各个部门之间的沟通。</p><p>希望这个饭店点菜的比喻能让你对分布式事务一致性的实现有个初步理解。只要有好的厨师(开发者)、高效的服务员(算法)和流畅的沟通(系统与系统间的交互)，一顿丰盛美味的大餐(一致性的系统状态)就不再是难题。</p><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><p>简化版本的两阶段提交（2PC）协议的代码例子。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">TransactionCoordinator</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 简化起见，我们假设只有两个系统参与事务。</span></span>
<span class="line"><span style="color:#E1E4E8;">  SystemA systemA;</span></span>
<span class="line"><span style="color:#E1E4E8;">  SystemB systemB;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">commit</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 阶段一：预提交</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> readyA </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> systemA.</span><span style="color:#B392F0;">prepare</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> readyB </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> systemB.</span><span style="color:#B392F0;">prepare</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 如果所有系统都准备好了，那么就进入提交阶段；否则，执行回滚操作。</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (readyA </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> readyB) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 阶段二：提交</span></span>
<span class="line"><span style="color:#E1E4E8;">      systemA.</span><span style="color:#B392F0;">commit</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">      systemB.</span><span style="color:#B392F0;">commit</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      systemA.</span><span style="color:#B392F0;">rollback</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">      systemB.</span><span style="color:#B392F0;">rollback</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TransactionCoordinator</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 简化起见，我们假设只有两个系统参与事务。</span></span>
<span class="line"><span style="color:#24292E;">  SystemA systemA;</span></span>
<span class="line"><span style="color:#24292E;">  SystemB systemB;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">commit</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 阶段一：预提交</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> readyA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> systemA.</span><span style="color:#6F42C1;">prepare</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> readyB </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> systemB.</span><span style="color:#6F42C1;">prepare</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 如果所有系统都准备好了，那么就进入提交阶段；否则，执行回滚操作。</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (readyA </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> readyB) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 阶段二：提交</span></span>
<span class="line"><span style="color:#24292E;">      systemA.</span><span style="color:#6F42C1;">commit</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">      systemB.</span><span style="color:#6F42C1;">commit</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      systemA.</span><span style="color:#6F42C1;">rollback</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">      systemB.</span><span style="color:#6F42C1;">rollback</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>以上代码中，<code>TransactionCoordinator</code> 代表事务协调者，而 <code>SystemA</code> 和 <code>SystemB</code> 代表两个参与事务的系统。假设每个系统都有 <code>prepare</code>、<code>commit</code> 和 <code>rollback</code> 这三个方法，分别对应于两阶段提交中的预提交、提交和回滚操作。</p><hr><p>三阶段提交的例子：假设我们有两个系统，<code>SystemA</code>  和  <code>SystemB</code>，他们都有  <code>canCommit</code>、<code>preCommit</code>、<code>doCommit</code>  和  <code>doAbort</code>  这四个方法，分别对应三阶段提交中的询问、预提交、正式提交和中断操作。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">TransactionCoordinator</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 假设我们只有两个系统参与事务</span></span>
<span class="line"><span style="color:#E1E4E8;">    SystemA systemA;</span></span>
<span class="line"><span style="color:#E1E4E8;">    SystemB systemB;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">commit</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 阶段一：询问系统是否准备好提交</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> readyA </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> systemA.</span><span style="color:#B392F0;">canCommit</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">boolean</span><span style="color:#E1E4E8;"> readyB </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> systemB.</span><span style="color:#B392F0;">canCommit</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 如果所有系统都准备好了，那么进入预提交阶段；否则，执行回滚操作。</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (readyA </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> readyB) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 阶段二：预提交</span></span>
<span class="line"><span style="color:#E1E4E8;">            systemA.</span><span style="color:#B392F0;">preCommit</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">            systemB.</span><span style="color:#B392F0;">preCommit</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 预提交阶段结束后，进入正式提交阶段</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 阶段三：正式提交</span></span>
<span class="line"><span style="color:#E1E4E8;">            systemA.</span><span style="color:#B392F0;">doCommit</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">            systemB.</span><span style="color:#B392F0;">doCommit</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// 如果任何一个系统没有准备好，中断事务</span></span>
<span class="line"><span style="color:#E1E4E8;">            systemA.</span><span style="color:#B392F0;">doAbort</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">            systemB.</span><span style="color:#B392F0;">doAbort</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TransactionCoordinator</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 假设我们只有两个系统参与事务</span></span>
<span class="line"><span style="color:#24292E;">    SystemA systemA;</span></span>
<span class="line"><span style="color:#24292E;">    SystemB systemB;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">commit</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 阶段一：询问系统是否准备好提交</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> readyA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> systemA.</span><span style="color:#6F42C1;">canCommit</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> readyB </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> systemB.</span><span style="color:#6F42C1;">canCommit</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 如果所有系统都准备好了，那么进入预提交阶段；否则，执行回滚操作。</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (readyA </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> readyB) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 阶段二：预提交</span></span>
<span class="line"><span style="color:#24292E;">            systemA.</span><span style="color:#6F42C1;">preCommit</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">            systemB.</span><span style="color:#6F42C1;">preCommit</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 预提交阶段结束后，进入正式提交阶段</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 阶段三：正式提交</span></span>
<span class="line"><span style="color:#24292E;">            systemA.</span><span style="color:#6F42C1;">doCommit</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">            systemB.</span><span style="color:#6F42C1;">doCommit</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// 如果任何一个系统没有准备好，中断事务</span></span>
<span class="line"><span style="color:#24292E;">            systemA.</span><span style="color:#6F42C1;">doAbort</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">            systemB.</span><span style="color:#6F42C1;">doAbort</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>在上面的代码中，<code>TransactionCoordinator</code>  是我们的事务协调者，它先询问所有系统是否准备好提交。如果所有系统都回答说他们准备好了，事务协调者会开始预提交阶段，并完成提交。但如果有系统没有准备好，那么事务协调者会中断事务。</p>`,18),e=[o];function c(t,r,y,E,i,m){return n(),a("div",null,e)}const F=s(p,[["render",c]]);export{A as __pageData,F as default};
