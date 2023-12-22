import{_ as s,o as n,c as a,R as e}from"./chunks/framework.7FlijoJG.js";const y=JSON.parse('{"title":"Java 线程池-joehuang","description":"","frontmatter":{"title":"Java 线程池-joehuang","date":"2023-12-22T13:36:13.000Z","Tags":["tech"],"Draft":true,"HideInList":false,"Feature":null,"IsTop":false},"headers":[],"relativePath":"advance/Java 线程池-joehuang.md","filePath":"advance/Java 线程池-joehuang.md","lastUpdated":1703223644000}'),p={name:"advance/Java 线程池-joehuang.md"},l=e(`<p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221336660.png" alt="image.png"></p><p>提交任务流程 <img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221337838.png" alt="image.png"></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">P1 线程池的核心参数</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">P2 01任务提交流程</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">&gt; P3 02创建worker</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">P4 03worker执行任务</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">P5 04获取任务</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">P6 05worker销毁</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">P7 06线程池关闭流程</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">P8 常见线程池</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">P1 线程池的核心参数</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">P2 01任务提交流程</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">&gt; P3 02创建worker</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">P4 03worker执行任务</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">P5 04获取任务</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">P6 05worker销毁</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">P7 06线程池关闭流程</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">P8 常见线程池</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221338243.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221339992.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221339771.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221339932.png" alt="image.png"></p><p><img src="https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221340839.png" alt="image.png"></p>`,8),c=[l];function o(t,r,i,g,u,m){return n(),a("div",null,c)}const d=s(p,[["render",o]]);export{y as __pageData,d as default};
