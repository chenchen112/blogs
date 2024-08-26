import { defineConfig } from "vuepress/config";

export default defineConfig({
  base: "/blogs/",
  title: " 个人博客 ",
  description: "blogs",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  plugins: [
    ["@vuepress/plugin-medium-zoom"],
    ["@vuepress/plugin-back-to-top"],
    ["@vuepress/last-updated"],
  ],
  configureWebpack: {
    resolve: {
      alias: {
        "@": "/img",
      },
    },
  },
  markdown: {
    lineNumbers: false, // 显示代码块的行数
  },
  themeConfig: {
    editLinks: true,
    nav: [{ text: "Github", link: "https://github.com/chenchen112/blogs" }],
    logo: "/Avatar.jpg",
    sidebarDepth: 0,
    lastUpdated: " 更新于 ",
    repo: "chenchen112/blogs",
    repoLabel: " 查看源码 ",
    docsBranch: "main",
    editLinkText: " 编辑 ",
    smoothScroll: true,
    sidebar: [
      {
        title: "2024",
        collapsable: false,
        children: [
          "/misc/WechatLogin",
          "/misc/ClassName",
          "/misc/Particles",
          "/misc/JsQuestions",
          {
            title: "Lint 配置参考 ",
            collapsable: false,
            children: ["/lint/Eslint", "/lint/Prettier", "/lint/StyleLint"],
          },
          {
            title: " 翻译 ",
            collapsable: false,
            children: [
              "/translation/SweepAndPrune",
              "/translation/LearnRegexTheEasyWay",
            ],
          },
        ],
      },
    ],
  },
});
