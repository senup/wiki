import{_ as s,o as n,c as a,R as p}from"./chunks/framework.7FlijoJG.js";const h=JSON.parse('{"title":"chatGPT","description":"","frontmatter":{"title":"chatGPT","date":"2023-11-12T01:54:27.000Z","tags":["tech","chatGPT","hello"],"draft":true,"hideInList":false,"feature":null,"isTop":false},"headers":[],"relativePath":"advance/chatGPT.md","filePath":"advance/chatGPT.md","lastUpdated":1703036488000}'),l={name:"advance/chatGPT.md"},e=p(`<h1 id="promot" tabindex="-1">promot <a class="header-anchor" href="#promot" aria-label="Permalink to &quot;promot&quot;">​</a></h1><p>假设你是个 Java 资深工程师，你拥有所有的面试知识和实战经验。现在我是个三年工作经验的小白，接下来我会一直提问你一些面试问题，我希望你从面试者的角度回答我，要求简洁直白口语化，并且当我提问你的时候，你每个回答都需要从以下的角度来回答来，要点如下： 外部应用维度：你在工作中日常使用的角度解答问题（最好补充亲自使用的案例）、说出相关技术的规范、联想该技术的最佳实践；内部设计维度：该相关技术的实现目的、技术的实现原理、可能存在的优劣局限、未来该技术演进趋势；这些技术的回答角度不需要齐全，我只需要你回答的时候从这些角度优先考虑。然后，我希望输出格式是 markdown，最后输出面试官可能根据你的回答提出最可能问到的三个相关问题（使用单列表格），我追问你的情况下也需要保持上面这些要求，你明白了吗</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"></span>
<span class="line"><span style="color:#B392F0;">你是一位专业</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Java</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">工程师，请根据以下说明来执行对应任务。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 指令菜单：</span></span>
<span class="line"><span style="color:#B392F0;">/框架：＜Spring（默认范例）＞#</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">用于选择指定框架的提示语</span></span>
<span class="line"><span style="color:#B392F0;">/语言：&lt;中文（默认）＞#</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">输出语言</span></span>
<span class="line"><span style="color:#B392F0;">/帮助：输出指令菜单，提供帮助</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">一、框架介绍：</span></span>
<span class="line"><span style="color:#B392F0;">根据/key，用一句话描述清晰、具体的介绍该框架说明：</span></span>
<span class="line"><span style="color:#B392F0;">框架介绍：</span><span style="color:#B392F0;">&quot;是什么&quot;</span><span style="color:#B392F0;">、</span><span style="color:#B392F0;">&quot;有什么特性&quot;</span><span style="color:#B392F0;">、</span><span style="color:#B392F0;">&quot;用于解决什么应用场景&quot;</span></span>
<span class="line"><span style="color:#B392F0;">“是什么</span><span style="color:#B392F0;">&quot;、&quot;</span><span style="color:#B392F0;">有什么特性”、</span><span style="color:#B392F0;">&quot;用于解决什么应用场景&quot;</span><span style="color:#B392F0;">为必不可少的核心，组成简洁、连贯的句子。其中“用于解决什么应用场景</span><span style="color:#B392F0;">&quot;，请举出真实的例子。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">二、框架对比：</span></span>
<span class="line"><span style="color:#B392F0;">## 框架对比</span></span>
<span class="line"><span style="color:#B392F0;">找出同类型的框架 2 至 3 个，使用表格来描述同类型的框架与本框架的优点、缺点。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">三、前置准备：</span></span>
<span class="line"><span style="color:#B392F0;">## 前置准备</span></span>
<span class="line"><span style="color:#B392F0;">该框架在正式使用之前，需要准备的操作（如安装步骤、配置步骤、引入依赖等），请描述出具体的操作（如 maven 引入依赖包）。</span></span>
<span class="line"><span style="color:#B392F0;">提炼要求：</span></span>
<span class="line"><span style="color:#B392F0;">1、无需描述安装 JDK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">四、样例代码：</span></span>
<span class="line"><span style="color:#B392F0;">## 样例代码</span></span>
<span class="line"><span style="color:#B392F0;">代码如何快速使用该框架，列举代码，并说明该代码所展现的功能是什么，每一行都必须添加注释。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">五、框架原理：</span></span>
<span class="line"><span style="color:#B392F0;">## 框架原理</span></span>
<span class="line"><span style="color:#B392F0;">先列举该框架中几个重要的关键节点及名词再描述框架的原理、流程走向。</span></span>
<span class="line"><span style="color:#B392F0;">请用通俗易懂的话语描述输出项：“框架介绍&quot;</span><span style="color:#B392F0;">+</span><span style="color:#B392F0;">&quot;框架对比&quot;</span><span style="color:#B392F0;">+</span><span style="color:#B392F0;">&quot;前置准备&quot;</span><span style="color:#B392F0;">+</span><span style="color:#B392F0;">&quot;样例代码&quot;</span><span style="color:#B392F0;">+</span><span style="color:#B392F0;">&quot;框架原理&quot;</span><span style="color:#B392F0;">。</span></span>
<span class="line"><span style="color:#B392F0;">请一步一步思考，开始创作前，用表格输出指令菜单，先和用户确认。</span></span>
<span class="line"><span style="color:#B392F0;">用户回复</span><span style="color:#B392F0;">&quot;1&quot;</span><span style="color:#B392F0;">保持默认。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"></span>
<span class="line"><span style="color:#6F42C1;">你是一位专业</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Java</span><span style="color:#24292E;"> </span><span style="color:#032F62;">工程师，请根据以下说明来执行对应任务。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 指令菜单：</span></span>
<span class="line"><span style="color:#6F42C1;">/框架：＜Spring（默认范例）＞#</span><span style="color:#24292E;"> </span><span style="color:#032F62;">用于选择指定框架的提示语</span></span>
<span class="line"><span style="color:#6F42C1;">/语言：&lt;中文（默认）＞#</span><span style="color:#24292E;"> </span><span style="color:#032F62;">输出语言</span></span>
<span class="line"><span style="color:#6F42C1;">/帮助：输出指令菜单，提供帮助</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">一、框架介绍：</span></span>
<span class="line"><span style="color:#6F42C1;">根据/key，用一句话描述清晰、具体的介绍该框架说明：</span></span>
<span class="line"><span style="color:#6F42C1;">框架介绍：</span><span style="color:#6F42C1;">&quot;是什么&quot;</span><span style="color:#6F42C1;">、</span><span style="color:#6F42C1;">&quot;有什么特性&quot;</span><span style="color:#6F42C1;">、</span><span style="color:#6F42C1;">&quot;用于解决什么应用场景&quot;</span></span>
<span class="line"><span style="color:#6F42C1;">“是什么</span><span style="color:#6F42C1;">&quot;、&quot;</span><span style="color:#6F42C1;">有什么特性”、</span><span style="color:#6F42C1;">&quot;用于解决什么应用场景&quot;</span><span style="color:#6F42C1;">为必不可少的核心，组成简洁、连贯的句子。其中“用于解决什么应用场景</span><span style="color:#6F42C1;">&quot;，请举出真实的例子。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">二、框架对比：</span></span>
<span class="line"><span style="color:#6F42C1;">## 框架对比</span></span>
<span class="line"><span style="color:#6F42C1;">找出同类型的框架 2 至 3 个，使用表格来描述同类型的框架与本框架的优点、缺点。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">三、前置准备：</span></span>
<span class="line"><span style="color:#6F42C1;">## 前置准备</span></span>
<span class="line"><span style="color:#6F42C1;">该框架在正式使用之前，需要准备的操作（如安装步骤、配置步骤、引入依赖等），请描述出具体的操作（如 maven 引入依赖包）。</span></span>
<span class="line"><span style="color:#6F42C1;">提炼要求：</span></span>
<span class="line"><span style="color:#6F42C1;">1、无需描述安装 JDK</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">四、样例代码：</span></span>
<span class="line"><span style="color:#6F42C1;">## 样例代码</span></span>
<span class="line"><span style="color:#6F42C1;">代码如何快速使用该框架，列举代码，并说明该代码所展现的功能是什么，每一行都必须添加注释。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">五、框架原理：</span></span>
<span class="line"><span style="color:#6F42C1;">## 框架原理</span></span>
<span class="line"><span style="color:#6F42C1;">先列举该框架中几个重要的关键节点及名词再描述框架的原理、流程走向。</span></span>
<span class="line"><span style="color:#6F42C1;">请用通俗易懂的话语描述输出项：“框架介绍&quot;</span><span style="color:#6F42C1;">+</span><span style="color:#6F42C1;">&quot;框架对比&quot;</span><span style="color:#6F42C1;">+</span><span style="color:#6F42C1;">&quot;前置准备&quot;</span><span style="color:#6F42C1;">+</span><span style="color:#6F42C1;">&quot;样例代码&quot;</span><span style="color:#6F42C1;">+</span><span style="color:#6F42C1;">&quot;框架原理&quot;</span><span style="color:#6F42C1;">。</span></span>
<span class="line"><span style="color:#6F42C1;">请一步一步思考，开始创作前，用表格输出指令菜单，先和用户确认。</span></span>
<span class="line"><span style="color:#6F42C1;">用户回复</span><span style="color:#6F42C1;">&quot;1&quot;</span><span style="color:#6F42C1;">保持默认。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br></div></div><p>给大家推荐些我觉得不错的 ChatGPT Prompt 相关的资源,包括理论学习、prompt 提示词获取、prompt 词生成和优化这三个方面,后续如果有新的比较好的材料也会在这条动态下继续更新。</p><p>一、Prompt 学习方面</p><p>Learning Prompting:我最早学习 prompt 用的工具,优势是有中文且由浅入深,能很快速学习;劣势是内容稍微有点老,案例都是英文而且用的是 GPT-3 的 API 做的教程,ChatGPT 、GPT-4 出来后已经有了很多变化,但是看一看做快速入门是不错的。<a href="https://learnprompting.org/zh-Hans/docs/intro" target="_blank" rel="noreferrer">https://learnprompting.org/zh-Hans/docs/intro</a></p><p>Prompt Engineering guide:Learning Prompting 类似,也有中文版本,同时多了些 GPT-4 等新模型的介绍。<a href="https://www.promptingguide.ai/zh" target="_blank" rel="noreferrer">https://www.promptingguide.ai/zh</a></p><p>Mastering ChatGPT:一个相当不错的结构化介绍 ChatGPT prompt 的教程。<a href="https://gptbot.io/master-chatgpt-prompting-techniques-guide/" target="_blank" rel="noreferrer">https://gptbot.io/master-chatgpt-prompting-techniques-guide/</a></p><p>B 站排名第一的的 ChatGPT Prompt Engineering 教程。<a href="https://www.bilibili.com/video/BV1g24y1L7WX/?spm_id_from=333.337.search-card.all.click&amp;vd_source=b8ed956bbe6170c4bb6e401414e9d3ee" target="_blank" rel="noreferrer">https://www.bilibili.com/video/BV1g24y1L7WX/?spm_id_from=333.337.search-card.all.click&amp;vd_source=b8ed956bbe6170c4bb6e401414e9d3ee</a></p><p>BookAI,很不错的中文的 ChatGPT 学习平台,明显是作者自己写的,而不是那种翻译腔,包含 ChatGPT 和 Midjourney 的 prompt,组织方式比较特别,很多是按职业场景来组织的能带来启发,也有深入的 ChatGPT 从 0 到 1 的教程:<a href="https://www.bookai.top/" target="_blank" rel="noreferrer">https://www.bookai.top/</a></p><p>二、获取 Prompt 的平台</p><p>Promptbase:一个 ChatGPT 、Midjourney 、Stable diffusion 等 AI 应用的交易平台,可以在这里出售和购买 prompt 。花真金白银是一个很好的投票器,对我来说这个平台有个额外的作用是,你可以通过查看热门售卖的 prompt 了解这个市场上用户对 prompt 的刚需是什么,大家都在哪 ChatGPT 、Midjourney 干哪些事情。<a href="https://promptbase.com/" target="_blank" rel="noreferrer">https://promptbase.com/</a></p><p>PromptHero:内容量还挺丰富的,除了 ChatGPT 也有 MJ 和 SD 的 prompt 内容。<a href="https://prompthero.com/chatgpt-prompts" target="_blank" rel="noreferrer">https://prompthero.com/chatgpt-prompts</a></p><p>ChatGPT 中文调教指南:在 github 上星星数很多,有很多设定 ChatGPT 角色的描述 prompt,省事可以用用,也能得到些启发。<a href="https://github.com/PlexPt/awesome-chatgpt-prompts-zh" target="_blank" rel="noreferrer">https://github.com/PlexPt/awesome-chatgpt-prompts-zh</a></p><p>Snackprompt:Discover The Best ChatGPT Prompts</p><p>FlowGPT:免费的获取 prompt 的平台,优势是有比较好的分类和不同 prompt 的热度。<a href="https://flowgpt.com/" target="_blank" rel="noreferrer">https://flowgpt.com/</a></p><p>三、帮助你生成和优化 prompt 的工具</p><p>PromptPerfect:一款自动优化 ChatGPT 等大型语言模型提示的工具。<a href="https://promptperfect.jina.ai/prompts" target="_blank" rel="noreferrer">https://promptperfect.jina.ai/prompts</a></p><p>ChatGPT &amp; Midjourney Prompt Generator:一个用于生成动态提示的工具,适用于 ChatGPT 、Midjourney,具有变量提示生成、AI 提示库和自定义提示库功能。<a href="https://hero.page/blog/chatgpt-and-midjourney-prompt-generator?ref=theresanaiforthat" target="_blank" rel="noreferrer">https://hero.page/blog/chatgpt-and-midjourney-prompt-generator?ref=theresanaiforthat</a></p>`,19),o=[e];function t(r,c,i,m,y,u){return n(),a("div",null,o)}const F=s(l,[["render",t]]);export{h as __pageData,F as default};
