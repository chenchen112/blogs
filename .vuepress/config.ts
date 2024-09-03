import { defineConfig } from "vuepress/config";

export default defineConfig({
  base: "/blogs/",
  title: "blogs",
  description: "frontend blogs",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  plugins: [
    ["@vuepress/plugin-medium-zoom"],
    ["@vuepress/plugin-back-to-top"],
    ["@vuepress/last-updated"],
  ],
  markdown: { toc: { includeLevel: [2, 3, 4] } },
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
        children: [
          "/2024/misc/Wechat",
          "/2024/misc/ClassName",
          "/2024/misc/Particle",
          "/2024/misc/JsQuestions",
          {
            title: "Vue",
            collapsable: false,
            children: ["/2024/vue/Introduction", "/2024/vue/Essentials"],
          },
          {
            title: "Lint 配置参考 ",
            collapsable: false,
            children: [
              "/2024/lint/Eslint",
              "/2024/lint/Prettier",
              "/2024/lint/StyleLint",
            ],
          },
          {
            title: " 翻译 ",
            collapsable: false,
            children: [
              "/2024/translation/SweepAndPrune",
              "/2024/translation/LearnRegexTheEasyWay",
            ],
          },
          {
            title: " 读书笔记 ",
            collapsable: false,
            children: [
              {
                title: " 软技能：代码之外的生存指南 ",
                children: [
                  "/2024/reading/SoftSkills/Career",
                  "/2024/reading/SoftSkills/SelfMarketing",
                  "/2024/reading/SoftSkills/Learning",
                ],
              },
            ],
          },
          "/2024/todo",
        ],
      },
    ],
  },
});
