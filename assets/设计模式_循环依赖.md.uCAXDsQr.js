import{_ as n,o as s,c as a,R as e}from"./chunks/framework.7FlijoJG.js";const b=JSON.parse('{"title":"循环依赖","description":"","frontmatter":{"title":"循环依赖","date":"2024-01-03T14:04:52.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"设计模式/循环依赖.md","filePath":"设计模式/循环依赖.md","lastUpdated":1711296414000}'),p={name:"设计模式/循环依赖.md"},l=e(`<p>在生产环境中出现无法被 Spring 解决的循环依赖，一般就像是在一个密室锁了两个饿了三天的大胃王，但只留了一个汉堡。显然，这是一个灾难，绝对的混乱！</p><p>在 Spring 中，最常见无法解决的循环依赖是出现在 Prototype Beans 之间，或者是在构造函数注入中。让我们通过下面两个例子来看看。</p><ol><li>Prototype Beans 循环依赖：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">@Bean</span></span>
<span class="line"><span style="color:#e1e4e8;">@Scope(&quot;prototype&quot;)</span></span>
<span class="line"><span style="color:#e1e4e8;">public BeanA beanA(BeanB beanB) {</span></span>
<span class="line"><span style="color:#e1e4e8;">    return new BeanA(beanB);</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">@Bean</span></span>
<span class="line"><span style="color:#e1e4e8;">@Scope(&quot;prototype&quot;)</span></span>
<span class="line"><span style="color:#e1e4e8;">public BeanB beanB(BeanA beanA) {</span></span>
<span class="line"><span style="color:#e1e4e8;">    return new BeanB(beanA);</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">@Bean</span></span>
<span class="line"><span style="color:#24292e;">@Scope(&quot;prototype&quot;)</span></span>
<span class="line"><span style="color:#24292e;">public BeanA beanA(BeanB beanB) {</span></span>
<span class="line"><span style="color:#24292e;">    return new BeanA(beanB);</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">@Bean</span></span>
<span class="line"><span style="color:#24292e;">@Scope(&quot;prototype&quot;)</span></span>
<span class="line"><span style="color:#24292e;">public BeanB beanB(BeanA beanA) {</span></span>
<span class="line"><span style="color:#24292e;">    return new BeanB(beanA);</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><p>这个例子中，当我们尝试获取一个 Bean A 实例时，Spring 会尝试创建一个 Bean B 来注入到 Bean A 中。但是，在创建 Bean B 的时候，Spring 突然发现需要一个 Bean A 的实例。根据 Prototype Beans 的定义，它会再次创建一个新的 Bean A，这样就进入了一个无限循环！</p><ol start="2"><li>构造函数注入循环依赖：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">@Component</span></span>
<span class="line"><span style="color:#e1e4e8;">public class ConstructorA {</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    private final ConstructorB constructorB;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    public ConstructorA(ConstructorB constructorB) {</span></span>
<span class="line"><span style="color:#e1e4e8;">        this.constructorB = constructorB;</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">@Component</span></span>
<span class="line"><span style="color:#e1e4e8;">public class ConstructorB {</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    private final ConstructorA constructorA;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    public ConstructorB(ConstructorA constructorA) {</span></span>
<span class="line"><span style="color:#e1e4e8;">        this.constructorA = constructorA;</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">@Component</span></span>
<span class="line"><span style="color:#24292e;">public class ConstructorA {</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    private final ConstructorB constructorB;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    public ConstructorA(ConstructorB constructorB) {</span></span>
<span class="line"><span style="color:#24292e;">        this.constructorB = constructorB;</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">@Component</span></span>
<span class="line"><span style="color:#24292e;">public class ConstructorB {</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    private final ConstructorA constructorA;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    public ConstructorB(ConstructorA constructorA) {</span></span>
<span class="line"><span style="color:#24292e;">        this.constructorA = constructorA;</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><p>在这个例子中，我们通过构造函数注入 BeanA 和 BeanB。但是如果你想一下，你会发现无论创建哪个 Bean，都需要另一个 Bean 的实例。这就形成了一个死锁。</p><p>所以，在创建 Bean 时，我们需要避免 Prototype Beans 之间的循环依赖，和构造器循环依赖。只有这样，我们才能保证生产环境运行的稳定。记住，处理汉堡的最好方法，是一人一半！</p><h2 id="三级缓存" tabindex="-1">三级缓存 <a class="header-anchor" href="#三级缓存" aria-label="Permalink to &quot;三级缓存&quot;">​</a></h2><p>让我们想象一下你是一个寿司大师，正在制作寿司。你首先需要准备饭团（singletonObjects），然后把鱼放在饭团上（earlySingletonObjects），最后加上酱料和装饰物（singletonFactories）就完成了。每一步都是必须的且与下一步相关。Spring 的三级缓存的工作原理也是类似的。</p><ol><li>singletonObjects：<code>这个单例对象缓存池存储已经完全初始化好的 Bean</code>。就像是我们前面所说的，已经完全做好，酱料装饰物都已经添加上去的寿司。</li><li>earlySingletonObjects：<code>这个早期单例对象缓存池存储着已经实例化但尚未填充完成的 Bean</code>。比喻说，它就像是那个已经形状成型，鱼已经放上去，但还没加酱料和装饰物的寿司。</li><li>singletonFactories：<code>这个单例工厂缓存池存储的是可以产生早期 Bean 的工厂 Bean</code>。它就像你自己，预备的食材，你可以开始制作还没完全做好的寿司。</li></ol><p>当 BeanA 和 BeanB 有循环依赖的情况下，首先 Spring 会尝试从 singletonObjects 里拿到 BeanA 为 BeanB 做依赖注入，发现没有，接着它就会从 singletonFactories 中拿到 BeanA 的工厂来创建一个早期的 BeanA（此时还未完成属性的填充和初始化），并且把这个早期的 BeanA 放入 earlySingletonObjects 这个缓存里，然后拿这个填充了 BeanB 的引用的 BeanA 来完成 BeanB 的创建和填充。BeanB 创建完后，然后就可以拿 BeanB 去填充 BeanA，也就完成了 BeanA 的创建。</p><p>这就是 Spring 的三级缓存，像做寿司一样，每一步都是有条不紊的。通过这样的方式，Spring 很巧妙地解决了循环依赖的问题。毫无疑问，Spring 就像寿司大师一样，总是能制作出美味的“Bean 寿司”！</p><h2 id="第三级缓存的作用" tabindex="-1">第三级缓存的作用 <a class="header-anchor" href="#第三级缓存的作用" aria-label="Permalink to &quot;第三级缓存的作用&quot;">​</a></h2><p>第三级缓存的作用，主要还是提供了一个懒加载的选择，毕竟你通过 ObjectFactory 的 getObject 方法获取早期单例 bean 时，中间还是会有一些方法逻辑的，也就是说会产生一些性能的损耗，所以，ObjectFactory 存放在缓存 singletonFactories 中的一个好处就是，可以让你在用到早期单例缓存时，才来调用 ObjectFactory 的方法来获取 bean。</p><hr><blockquote><p>如果去掉三级缓存除了需要实时调用早期工厂的方法，那么其他 Bean 调用的时候也得有东西给他们调用。</p></blockquote><p>如果去掉第三级缓存，事情会变成什么样。</p><p>记住当我刚开始做寿司时提到的那个饭团和鱼吗？如果我们直接制作这种“早期寿司”，然后直接将它们放入二级缓存中，那么我们将无法进行任何后续的修改和添加其他成分。</p><p>也许你会说，我可以先把寿司做一半，然后再加料。听起来不错，但实际上，有些原料（比如 BeanB）可能需要在加工前另一种原料（例如 BeanA）的帮助。如果我们去掉了第三级缓存（singletonFactories），那么当一种 Bean（例如 BeanA）还没完全初始化，却需要被另一种 Bean（例如 BeanB）所引用时，我们怎样才能把还没完全初始化的 BeanA 提供给 BeanB 使用呢？</p><p>所以，如果没有第三级缓存，就容易在处理循环依赖的时候遇到问题。所以我们需要第三级缓存（singletonFactories），这样在创建 Bean 的过程中，我们可以使用工厂对象去创建还没完全初始化的早期 Bean，然后用这个早期 Bean 去满足其他 Bean 的依赖。</p><p>总的来说，Spring 的三级缓存机制是解决循环依赖的关键。没有之一，是没有之三的！就像做寿司一样，每一步都很重要。</p>`,23),o=[l];function t(c,r,i,B,u,y){return s(),a("div",null,o)}const A=n(p,[["render",t]]);export{b as __pageData,A as default};
