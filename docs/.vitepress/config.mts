import { defineConfig } from 'vitepress';


// import markdownLinkResolver from '../markdown-link-resolver';
const markdownLinkResolver = require('../markdown-link-resolver');


export default defineConfig({
  // 标题（浏览器后缀）
  title: "Wiki | 高等游民",

  // 描述
  description: "高等游民の知识库",

  // 语言
  lang: 'zh-CN',

  // 根目录，如果需要部署成htpps://github.com/blog/的形式，则设置/blog/
  base: '/wiki',

  // 文档最后更新时间展示
  lastUpdated: true,

  // 去除浏览器链接中的.html后缀(部署服务器时会导致页面重复问题，等待官方更新解决)
  //cleanUrls: true,

  //构建忽略死亡链接检测，就不会构建失败
  ignoreDeadLinks: true,

  //exclude the mardwork file under the path;see : https://github.com/mrmlnc/fast-glob#pattern-syntax
  srcExclude: ['doc/templates/**/*.md'],

  // markdown显示行数
  markdown: {
    lineNumbers: true,
    config: (md) => {
      // 添加自定义的 Markdown 插件
      md.use(markdownLinkResolver);
    },
  },
  // head设置
  head: [
    // 浏览器中图标
    ["link", {rel: "icon", href: "/wiki/logo.ico"}],
  ],
  // 主题设置
  themeConfig: {
    // 左上角logo
    logo: '/logo.png',
    // 首页右上角导航栏
    nav: [
      { text: '主页', link: '/' },
      { text: '面试', link: '/interview/toc' },
      { text: '生活', link: 'https://senup.github.io/' },
    ],
    // 文章左侧导航栏
    sidebar: [
      {
        text: '面试',
        items: [
          { text: '目录', link: '/interview/toc' }
        ]
      },{
        text: '系统学习',
        items: [
          { text: 'MySQL', link: '/advance/MySQL.md' },
          { text: 'Spring', link: '/advance/Spring.md' }
        ]
      }
    ],
    // 文章底部导航栏的自定义配置，默认是英语
    docFooter: {
			prev: '上一篇',
			next: '下一篇',
		},
    // 文章右侧目录展示级别和标题
    outline: {
      level: [2, 6],
      label: '文章目录'
    },
    // 文章更新时间的前缀文本
    lastUpdatedText: '最后更新时间',
    // 开启本地搜索（左上角）
    search: {
      provider: 'local',
    },
    // 右上角Github链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],
    // 页脚
    footer: {
			copyright: 'Copyright © 2023-Present ',
		}
  }
})