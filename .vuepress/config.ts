import { defineConfig } from "vuepress/config";
import moment from "moment";

export default defineConfig({
  base: "/blogs/",
  title: "一些记录",
  description: "blogs react three lint http frontend",
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
    lineNumbers: true,
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
        title: "misc",
        children: ["/misc/monorepo", "/misc/Laptop"],
      },
      {
        title: "HTTP",
        children: ["/HTTP/HTTP_version", "/HTTP/HTTP", "/HTTP/TCP"],
      },
      {
        title: "Lint",
        children: ["/Lint/Eslint", "/Lint/Prettier", "/Lint/StyleLint"],
      },
      {
        title: "React",
        children: ["/React/React_Vue"],
      },
      {
        title: "Three",
        children: ["/Three/particles", "/Three/notes"],
      },
    ],
  },
});
