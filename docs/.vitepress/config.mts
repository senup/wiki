import { defineConfig } from 'vitepress'

export default defineConfig({
  // 标题（浏览器后缀）
  title: "Wiki | 高等游民",
  // 描述
  description: "高等游民の知识库",
  // 语言
  lang: 'zh-CN',
  // 根目录，如果需要部署成htpps://github.com/blog/的形式，则设置/blog/
  base: '/',
  // 文档最后更新时间展示
  lastUpdated: true,
  // 去除浏览器链接中的.html后缀(部署服务器时会导致页面重复问题，等待官方更新解决)
  //cleanUrls: true,
  // markdown显示行数
  markdown: {
    lineNumbers: true,
  },
  // head设置
  head: [
    // 浏览器中图标
    ["link", {rel: "icon", href: "/logo.ico"}],
  ],
  // 主题设置
  themeConfig: {
    // 左上角logo
    logo: '/logo.png',
    // 首页右上角导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Wiki', link: '/wiki/README' },
      { text: 'Blog', link: 'https://senup.github.io/' },
    ],
    // 文章左侧导航栏
    sidebar: [
      {
        text: '面试',
        items: [
          { text: '目录', link: '/wiki/toc' }
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