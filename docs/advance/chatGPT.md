---
title: chatGPT
date: 2023-11-12 01:54:27
tags:
  - tech
  - chatGPT
  - hello
draft: true
hideInList: false
feature: 
isTop: false
---

# promot

假设你是个 Java 资深工程师，你拥有所有的面试知识和实战经验。现在我是个三年工作经验的小白，接下来我会一直提问你一些面试问题，我希望你从面试者的角度回答我，要求简洁直白口语化，并且当我提问你的时候，你每个回答都需要从以下的角度来回答来，要点如下： 外部应用维度：你在工作中日常使用的角度解答问题（最好补充亲自使用的案例）、说出相关技术的规范、联想该技术的最佳实践；内部设计维度：该相关技术的实现目的、技术的实现原理、可能存在的优劣局限、未来该技术演进趋势；这些技术的回答角度不需要齐全，我只需要你回答的时候从这些角度优先考虑。然后，我希望输出格式是 markdown，最后输出面试官可能根据你的回答提出最可能问到的三个相关问题（使用单列表格），我追问你的情况下也需要保持上面这些要求，你明白了吗


<!--more-->



```shell

你是一位专业 Java 工程师，请根据以下说明来执行对应任务。

# 指令菜单：
/框架：＜Spring（默认范例）＞# 用于选择指定框架的提示语
/语言：<中文（默认）＞# 输出语言
/帮助：输出指令菜单，提供帮助

一、框架介绍：
根据/key，用一句话描述清晰、具体的介绍该框架说明：
框架介绍："是什么"、"有什么特性"、"用于解决什么应用场景"
“是什么"、"有什么特性”、"用于解决什么应用场景"为必不可少的核心，组成简洁、连贯的句子。其中“用于解决什么应用场景"，请举出真实的例子。

二、框架对比：
## 框架对比
找出同类型的框架 2 至 3 个，使用表格来描述同类型的框架与本框架的优点、缺点。

三、前置准备：
## 前置准备
该框架在正式使用之前，需要准备的操作（如安装步骤、配置步骤、引入依赖等），请描述出具体的操作（如 maven 引入依赖包）。
提炼要求：
1、无需描述安装 JDK

四、样例代码：
## 样例代码
代码如何快速使用该框架，列举代码，并说明该代码所展现的功能是什么，每一行都必须添加注释。

五、框架原理：
## 框架原理
先列举该框架中几个重要的关键节点及名词再描述框架的原理、流程走向。
请用通俗易懂的话语描述输出项：“框架介绍"+"框架对比"+"前置准备"+"样例代码"+"框架原理"。
请一步一步思考，开始创作前，用表格输出指令菜单，先和用户确认。
用户回复"1"保持默认。


```

给大家推荐些我觉得不错的 ChatGPT Prompt 相关的资源,包括理论学习、prompt 提示词获取、prompt 词生成和优化这三个方面,后续如果有新的比较好的材料也会在这条动态下继续更新。  
  
一、Prompt 学习方面  
  
Learning Prompting:我最早学习 prompt 用的工具,优势是有中文且由浅入深,能很快速学习;劣势是内容稍微有点老,案例都是英文而且用的是 GPT-3 的 API 做的教程,ChatGPT 、GPT-4 出来后已经有了很多变化,但是看一看做快速入门是不错的。[https://learnprompting.org/zh-Hans/docs/intro](https://learnprompting.org/zh-Hans/docs/intro)  
  
Prompt Engineering guide:Learning Prompting 类似,也有中文版本,同时多了些 GPT-4 等新模型的介绍。[https://www.promptingguide.ai/zh](https://www.promptingguide.ai/zh)  
  
Mastering ChatGPT:一个相当不错的结构化介绍 ChatGPT prompt 的教程。[https://gptbot.io/master-chatgpt-prompting-techniques-guide/](https://gptbot.io/master-chatgpt-prompting-techniques-guide/)  
  
B 站排名第一的的 ChatGPT Prompt Engineering 教程。[https://www.bilibili.com/video/BV1g24y1L7WX/?spm_id_from=333.337.search-card.all.click&vd_source=b8ed956bbe6170c4bb6e401414e9d3ee](https://www.bilibili.com/video/BV1g24y1L7WX/?spm_id_from=333.337.search-card.all.click&vd_source=b8ed956bbe6170c4bb6e401414e9d3ee)  
  
BookAI,很不错的中文的 ChatGPT 学习平台,明显是作者自己写的,而不是那种翻译腔,包含 ChatGPT 和 Midjourney 的 prompt,组织方式比较特别,很多是按职业场景来组织的能带来启发,也有深入的 ChatGPT 从 0 到 1 的教程:[https://www.bookai.top/](https://www.bookai.top/)  
  
二、获取 Prompt 的平台  
  
Promptbase:一个 ChatGPT 、Midjourney 、Stable diffusion 等 AI 应用的交易平台,可以在这里出售和购买 prompt 。花真金白银是一个很好的投票器,对我来说这个平台有个额外的作用是,你可以通过查看热门售卖的 prompt 了解这个市场上用户对 prompt 的刚需是什么,大家都在哪 ChatGPT 、Midjourney 干哪些事情。[https://promptbase.com/](https://promptbase.com/)  
  
PromptHero:内容量还挺丰富的,除了 ChatGPT 也有 MJ 和 SD 的 prompt 内容。[https://prompthero.com/chatgpt-prompts](https://prompthero.com/chatgpt-prompts)  
  
ChatGPT 中文调教指南:在 github 上星星数很多,有很多设定 ChatGPT 角色的描述 prompt,省事可以用用,也能得到些启发。[https://github.com/PlexPt/awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)  
  
Snackprompt:Discover The Best ChatGPT Prompts  
  
FlowGPT:免费的获取 prompt 的平台,优势是有比较好的分类和不同 prompt 的热度。[https://flowgpt.com/](https://flowgpt.com/)  
  
三、帮助你生成和优化 prompt 的工具  
  
PromptPerfect:一款自动优化 ChatGPT 等大型语言模型提示的工具。[https://promptperfect.jina.ai/prompts](https://promptperfect.jina.ai/prompts)  
  
ChatGPT & Midjourney Prompt Generator:一个用于生成动态提示的工具,适用于 ChatGPT 、Midjourney,具有变量提示生成、AI 提示库和自定义提示库功能。https://hero.page/blog/chatgpt-and-midjourney-prompt-generator?ref=theresanaiforthat