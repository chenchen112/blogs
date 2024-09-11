import { defineConfig } from "vuepress/config";
import Sidebar2024 from "../2024/sidebar";
import StatScript from "./statScript";

const KeywordsContent = " 博客 frontend vuepress";

export default defineConfig({
  base: "/blogs/",
  title: "blogs",
  description: "frontend blogs ",
  head: [
    ["meta", { name: "keywords", content: KeywordsContent }],
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["script", {}, StatScript],
  ],
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
    sidebar: [Sidebar2024],
  },
});
