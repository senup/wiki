import{_ as s,o as n,c as a,R as l}from"./chunks/framework.7FlijoJG.js";const F=JSON.parse('{"title":"计算机网络基础","description":"","frontmatter":{},"headers":[],"relativePath":"wiki/计算机网络.md","filePath":"wiki/计算机网络.md","lastUpdated":1700579497000}'),p={name:"wiki/计算机网络.md"},o=l(`<h1 id="计算机网络基础" tabindex="-1">计算机网络基础 <a class="header-anchor" href="#计算机网络基础" aria-label="Permalink to &quot;计算机网络基础&quot;">​</a></h1><ul><li><a href="./计算机网络-概述.html">计算机网络概述</a></li><li><a href="./计算机网络-物理层.html">计算机网络-物理层</a></li><li><a href="./计算机网络-链路层.html">计算机网络-数据链路层</a></li><li><a href="./计算机网络-网络层.html">计算机网络-网络层</a></li><li><a href="./计算机网络-传输层.html">计算机网络-传输层</a></li><li><a href="./计算机网络-应用层.html">计算机网络-应用层</a></li></ul><h1 id="计算机网络复习脉络" tabindex="-1">计算机网络复习脉络 <a class="header-anchor" href="#计算机网络复习脉络" aria-label="Permalink to &quot;计算机网络复习脉络&quot;">​</a></h1><div class="language-c vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">复习方法：反复理解记忆，多问为什么，物理层几乎不需要掌握。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;">1.</span><span style="color:#E1E4E8;"> TCP</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">IP协议体系的认知</span></span>
<span class="line"><span style="color:#79B8FF;">2.</span><span style="color:#E1E4E8;"> 数据链路层</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">）以太网帧格式</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">）MTU的概念</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">3</span><span style="color:#E1E4E8;">）ARP协议和RARP协议（严格上说ARP协议归类于网络层），掌握ARP缓存的原理</span></span>
<span class="line"><span style="color:#79B8FF;">3.</span><span style="color:#E1E4E8;"> 网络层</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">）掌握IP的首部格式</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">）掌握IP的分片</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">3</span><span style="color:#E1E4E8;">）掌握IP的选路，即路由表</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">4</span><span style="color:#E1E4E8;">）ICMP协议</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">) 掌握报文格式</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">）分类：查询</span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;">差错</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">3</span><span style="color:#E1E4E8;">）两种</span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;">五种</span></span>
<span class="line"><span style="color:#79B8FF;">4.</span><span style="color:#E1E4E8;">传输层</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">）UDP，次要一点，掌握特点和首部各个字段</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">）掌握TCP</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">）特点</span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;">首部字段</span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;">传输可靠机制</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">）连接控制：三次握手，四次挥手，同时打开，同时关闭，半关闭</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">3</span><span style="color:#E1E4E8;">）流量控制机制：滑动窗口，慢启动，拥塞控制，快速重传，快速恢复</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">4</span><span style="color:#E1E4E8;">）超时重传机制</span></span>
<span class="line"><span style="color:#79B8FF;">5.</span><span style="color:#E1E4E8;">应用层</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">）掌握DNS协议</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">）名字空间</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">）指针查询（反向查找或逆向解析）基本原理</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">3</span><span style="color:#E1E4E8;">）DNS协议</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">）FTP协议</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">）控制流和数据流</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">）两种工作模式：PASV和PORT</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">3</span><span style="color:#E1E4E8;">）各种指令和响应码</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">4</span><span style="color:#E1E4E8;">）断点重传和匿名FTP的概念</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">3</span><span style="color:#E1E4E8;">）HTTP协议</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">）报文格式：请求报文，响应报文，请求头各种字段，响应头各种字段</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">）HTTP的状态码</span></span>
<span class="line"><span style="color:#E1E4E8;">	（</span><span style="color:#79B8FF;">4</span><span style="color:#E1E4E8;">）HTTPS协议</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">）握手的详细过程</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">）摘要算法，数字签名，数字证书的原理和过程</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">复习方法：反复理解记忆，多问为什么，物理层几乎不需要掌握。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;">1.</span><span style="color:#24292E;"> TCP</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">IP协议体系的认知</span></span>
<span class="line"><span style="color:#005CC5;">2.</span><span style="color:#24292E;"> 数据链路层</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">）以太网帧格式</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">）MTU的概念</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">）ARP协议和RARP协议（严格上说ARP协议归类于网络层），掌握ARP缓存的原理</span></span>
<span class="line"><span style="color:#005CC5;">3.</span><span style="color:#24292E;"> 网络层</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">）掌握IP的首部格式</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">）掌握IP的分片</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">）掌握IP的选路，即路由表</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">）ICMP协议</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">) 掌握报文格式</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">）分类：查询</span><span style="color:#D73A49;">+</span><span style="color:#24292E;">差错</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">）两种</span><span style="color:#D73A49;">+</span><span style="color:#24292E;">五种</span></span>
<span class="line"><span style="color:#005CC5;">4.</span><span style="color:#24292E;">传输层</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">）UDP，次要一点，掌握特点和首部各个字段</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">）掌握TCP</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">）特点</span><span style="color:#D73A49;">+</span><span style="color:#24292E;">首部字段</span><span style="color:#D73A49;">+</span><span style="color:#24292E;">传输可靠机制</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">）连接控制：三次握手，四次挥手，同时打开，同时关闭，半关闭</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">）流量控制机制：滑动窗口，慢启动，拥塞控制，快速重传，快速恢复</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">）超时重传机制</span></span>
<span class="line"><span style="color:#005CC5;">5.</span><span style="color:#24292E;">应用层</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">）掌握DNS协议</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">）名字空间</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">）指针查询（反向查找或逆向解析）基本原理</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">）DNS协议</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">）FTP协议</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">）控制流和数据流</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">）两种工作模式：PASV和PORT</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">）各种指令和响应码</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">）断点重传和匿名FTP的概念</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">）HTTP协议</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">）报文格式：请求报文，响应报文，请求头各种字段，响应头各种字段</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">）HTTP的状态码</span></span>
<span class="line"><span style="color:#24292E;">	（</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">）HTTPS协议</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">）握手的详细过程</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">）摘要算法，数字签名，数字证书的原理和过程</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br></div></div><h1 id="计网面试题" tabindex="-1">计网面试题 <a class="header-anchor" href="#计网面试题" aria-label="Permalink to &quot;计网面试题&quot;">​</a></h1><p>附件：<a href="https://docsify-1258928558.cos.ap-guangzhou.myqcloud.com/computer-network-interview.pdf" download="计算机网络面试.pdf">计算机网络面试题总结.pdf</a></p>`,6),e=[o];function t(c,r,E,y,i,b){return n(),a("div",null,e)}const m=s(p,[["render",t]]);export{F as __pageData,m as default};
