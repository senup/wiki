import{_ as i,D as a,o as s,c as n,I as t,w as r,R as e,a as l}from"./chunks/framework.7FlijoJG.js";const f=JSON.parse('{"title":"Cookie和Session的区别","description":"","frontmatter":{},"headers":[],"relativePath":"interview/javaweb.md","filePath":"interview/javaweb.md","lastUpdated":1700618398000}'),c={name:"interview/javaweb.md"},p=e('<h1 id="cookie和session的区别" tabindex="-1">Cookie和Session的区别 <a class="header-anchor" href="#cookie和session的区别" aria-label="Permalink to &quot;Cookie和Session的区别&quot;">​</a></h1><h2 id="定义" tabindex="-1">定义 <a class="header-anchor" href="#定义" aria-label="Permalink to &quot;定义&quot;">​</a></h2><p>Cookie 是一种发送到客户浏览器的文本串句柄，并保存在客户机硬盘上，可以用来在某个WEB站点会话间持久的保持数据。 Session是存储在web服务器端的一块信息，session对象存储特定用户会话所需的属性以及配置信息，当用户在应用程序的web页面之间跳转时，存储在Session对象中的变量将不会丢失，而是在整个用户会话中一直存在下去。Session其实指的就是访问者从到达某个特定主页到离开为止的那段时间。Session其实是利用Cookie进行信息处理的，当用户首先进行了请求后，服务端就在用户浏览器上创建了一个Cookie，当这个Session结束时，其实就是意味着这个Cookie就过期了。</p><h2 id="相同点" tabindex="-1">相同点 <a class="header-anchor" href="#相同点" aria-label="Permalink to &quot;相同点&quot;">​</a></h2><p>cookie和session的共同之处在于：cookie和session都是用来跟踪浏览器用户身份的会话方式。</p><h2 id="不同点" tabindex="-1">不同点 <a class="header-anchor" href="#不同点" aria-label="Permalink to &quot;不同点&quot;">​</a></h2>',6),d=e('<p>简单的说，当你登录一个网站的时候，</p><ul><li><p>如果web服务器端使用的是session，那么所有的数据都保存在服务器上，客户端每次请求服务器的时候会发送当前会话的sessionid，服务器根据当前sessionid判断相应的用户数据标志，以确定用户是否登录或具有某种权限。由于数据是存储在服务器上面，所以你不能伪造，但是如果你能够获取某个登录用户的 sessionid，用特殊的浏览器伪造该用户的请求也是能够成功的。sessionid是服务器和客户端链接时候随机分配的，一般来说是不会有重复，但如果有大量的并发请求，也不是没有重复的可能性。</p></li><li><p>如果浏览器使用的是cookie，那么所有的数据都保存在浏览器端，比如你登录以后，服务器设置了cookie用户名，那么当你再次请求服务器的时候，浏览器会将用户名一块发送给服务器，这些变量有一定的特殊标记。服务器会解释为cookie变量，所以只要不关闭浏览器，那么cookie变量一直是有效的，所以能够保证长时间不掉线。如果你能够截获某个用户的 cookie变量，然后伪造一个数据包发送过去，那么服务器还是认为你是合法的。所以，使用 cookie被攻击的可能性比较大。如果设置了的有效时间，那么它会将 cookie保存在客户端的硬盘上，下次再访问该网站的时候，浏览器先检查有没有 cookie，如果有的话，就读取该 cookie，然后发送给服务器。如果你在机器上面保存了某个论坛 cookie，有效期是一年，如果有人入侵你的机器，将你的 cookie拷走，然后放在他的浏览器的目录下面，那么他登录该网站的时候就是用你的的身份登录的。所以 cookie是可以伪造的。当然，伪造的时候需要主意，直接copy cookie文件到 cookie目录，浏览器是不认的，他有一个index.dat文件，存储了 cookie文件的建立时间，以及是否有修改，所以你必须先要有该网站的 cookie文件，并且要从保证时间上骗过浏览器</p></li></ul><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>两个都可以用来存私密的东西，同样也都有有效期的说法,区别在于session是放在服务器上的，过期与否取决于服务期的设定，cookie是存在客户端的，过去与否可以在cookie生成的时候设置进去。</p><ul><li>cookie数据存放在客户的浏览器上，session数据放在服务器上</li><li>cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗,如果主要考虑到安全应当使用session</li><li>session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能，如果主要考虑到减轻服务器性能方面，应当使用COOKIE</li><li>单个cookie在客户端的限制是3K，就是说一个站点在客户端存放的COOKIE不能3K。</li><li>所以：将登陆信息等重要信息存放为SESSION;其他信息如果需要保留，可以放在COOKIE中</li></ul><h1 id="session共享技术" tabindex="-1">Session共享技术 <a class="header-anchor" href="#session共享技术" aria-label="Permalink to &quot;Session共享技术&quot;">​</a></h1><h2 id="问题描述" tabindex="-1">问题描述 <a class="header-anchor" href="#问题描述" aria-label="Permalink to &quot;问题描述&quot;">​</a></h2><p>一个用户在登陆成功后会把用户信息存储在Session中，但是由于后台不止一台服务器，比如这时Session所在服务器为server1，那么用户在Session失效之前如果再次使用app，那么可能会被路由到另外一台服务器server2，这时问题来了，由于server2没有该用户的Session信息，所以需要用户重新登陆，那么在这种情况下用户的体验就会非常不好，所以现在技术上需要实现多台server之间共享Session，让用户状态得以在每台服务器上都能保存到。</p><h2 id="实现方案" tabindex="-1">实现方案 <a class="header-anchor" href="#实现方案" aria-label="Permalink to &quot;实现方案&quot;">​</a></h2><ol><li><p>服务器实现是Session复制或者Session共享。这种类型的共享Session是和服务器紧密相关的，比如在webSphere或者JBoss上搭建集群的时候可以配置Session复制或者Session共享，但是这种方式有一个致命的缺点，那就是不好扩展和移植，比如如果再增加几台服务器，就要不断修改服务器配置。</p></li><li><p>利用成熟的技术做Session复制。比如12306使用的gemfire，比如常见的内存数据库如redis或者memcache，这类方案虽然比较普适，但是严重依赖于第三方，这样当第三方服务器出现问题时，那么将是应用的灾难。</p></li><li><p>将Session维护在客户端。很容易联想到就是利用Cookie，但是客户端存在风险，数据会存在不安全的情况，而且可以存放的数据量比较小，所以将Session维护在客户端还要对Session中的信息进行加密。</p></li></ol><h2 id="解决方案" tabindex="-1">解决方案 <a class="header-anchor" href="#解决方案" aria-label="Permalink to &quot;解决方案&quot;">​</a></h2><p>我们最终实现的方案可以说是上述方案二和方案三的合体版，可以利用gemfire实现session复制共享，还可以将Session维护在redis中实现session共享，同时可以将Session维护在客户端的Cookie中，但是前提是数据要加密。这三种方式可以迅速切换，从而在一种情况出现不可用的时候应用程序可以迅速切换从而不影响正常使用。我们在实践中，可以首选gemfire或者redis作为Session共享的载体，一旦Session不稳定出现问题的时候，可以紧急切换Cookie维护Session作为备用。</p><h1 id="ajax技术" tabindex="-1">Ajax技术 <a class="header-anchor" href="#ajax技术" aria-label="Permalink to &quot;Ajax技术&quot;">​</a></h1><p>Ajax是一种创建交互式网页应用的网页开发技术，Asynchronous JavaScript and XML的缩写。</p><p>Ajax的优势：</p><ul><li>通过异步模式，提升了用户的体验。</li><li>优化了浏览器和服务器之间的传输，减少不必要的数据往返，减少了带宽占用。</li><li>Ajax引擎在客户端运行，承担了一部分本来由服务器承担的工作，从而减少了大用户量下服务器的负载。</li></ul><p>Ajax的最大特点：</p><ul><li>可以实现局部刷新，在不更新整个页面的前提下维护数据，提升用户体验度。</li></ul><h1 id="jsonp原理" tabindex="-1">jsonp原理 <a class="header-anchor" href="#jsonp原理" aria-label="Permalink to &quot;jsonp原理&quot;">​</a></h1><p>JavaScript是一种在web开发中经常使用的前端动态脚本技术，在JavaScript中，有一个很重要的安全性限制，被称为&quot;Same-Origin Policy&quot;（同源策略），这一策略对于JavaScript代码能够访问的页面内容做了很重要的限制，即JavaScript只能访问与包含它的文档在同一域下的内容。 JavaScript这个安全策略在进行多iframe或多窗口编程、以及Ajax编程时显得尤为重要，根据这个策略，在baidu.com下的页面包含的JS代码不能访问在google.com域名下的内容，甚至不同的子域名之间也不能通过js代码相互访问。这对于Ajax的影响在于，通过XMLHttpRequest实现的Ajax请求，不能向不同的域提交请求，例如：在abc.example.com下的页面，不能向def.example.com提交Ajax请求等等。</p><blockquote><p>然而，当进行一些比较深入的前端编程的时候，跨域操作是不可避免的，这时候“同源策略”就显得过于苛刻，jsonp跨域get请求是一个常用的解决方案。 jsonp的最基本原理是：动态添加一个<code>&lt;script&gt;</code>标签，使用script标签的src属性没有跨域的限制的特点实现跨域。即首先在客户端注册一个callback，然后把callback的名字传给服务器，此时，服务器先生成json数据，然后以javascript语法的方式，生成一个function，function名字就是传递上来的参数jsonp，最后将json数据直接以入参的方式，放置到function中，这样就生成了一段js代码返回给客户端。然后客户端浏览器解析script标签并执行返回的js代码，此时数据作为参数传入到了客户端预先定义好的callback函数里。</p></blockquote>',21);function h(k,S,u,_,b,m){const o=a("font");return s(),n("div",null,[p,t(o,{color:"red"},{default:r(()=>[l("cookie数据保存在客户端，session数据保存在服务器端。")]),_:1}),d])}const j=i(c,[["render",h]]);export{f as __pageData,j as default};
