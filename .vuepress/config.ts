import { defineConfig } from "vuepress/config";
import moment from "moment";

export default defineConfig({
  base: "/blogs/",
  title: "个人博客",
  description: "blogs",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  plugins: [
    ["@vuepress/plugin-medium-zoom"],
    ["@vuepress/plugin-back-to-top"],
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp) => {
          moment.locale("zh-CN");
          return moment(timestamp).fromNow();
        },
      },
    ],
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
    lastUpdated: "更新于",
    repo: "chenchen112/blogs",
    repoLabel: "查看源码",
    docsBranch: "main",
    editLinkText: "编辑",
    smoothScroll: true,
    sidebar: [
      {
        title: "CSS",
        collapsable: false,
        children: ["/CSS/BFC", "/CSS/className"],
      },
      {
        title: "HTTP",
        collapsable: false,
        children: ["/HTTP/TCP", "/HTTP/HTTP_version", "/HTTP/HTTP"],
      },
      {
        title: "Lint",
        collapsable: false,
        children: ["/Lint/Eslint", "/Lint/Prettier", "/Lint/StyleLint"],
      },
      {
        title: "React",
        collapsable: false,
        children: ["/React/React_Vue"],
      },
      {
        title: "Three.js",
        collapsable: false,
        children: ["/Three/notes", "/Three/particles"],
      },
      {
        title: "Webpack",
        collapsable: false,
        children: ["/Webpack/optimization", "/Webpack/notes"],
      },
      {
        title: "misc",
        collapsable: false,
        children: [
          "/misc/git",
          "/misc/monorepo",
          "/misc/Laptop",
          "/misc/V8",
          "/misc/WechatLogin",
          "/misc/js-questions",
          "/misc/movie",
        ],
      },
      {
        title: "译文",
        collapsable: false,
        children: ["/Translation/LearnRegexTheEasyWay"],
      },
    ],
  },
});
