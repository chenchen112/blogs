import { defineConfig } from "vitepress";
import Sidebar2024 from "../2024/sidebar";
import StatScript from "./statScript";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blogs/",
  title: "blogs",
  description: "frontend blogs",
  head: [
    ["meta", { name: "keywords", content: " 前端博客 " }],
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["script", {}, StatScript],
  ],
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/Avatar.jpg",
    siteTitle: " 个人博客 ",
    nav: [{ text: "2024", link: "/2024/" }],
    sidebar: [Sidebar2024],
    socialLinks: [{ icon: "github", link: "https://github.com/chenchen112" }],
    editLink: {
      pattern: "'https://github.com/vuejs/vitepress/edit/main/docs/:path'",
      text: "Edit this page on GitHub",
    },
    lastUpdated: {
      text: " 更新于 ",
      formatOptions: { dateStyle: "full", timeStyle: "medium" },
    },
    docFooter: { prev: " 上一篇 ", next: " 下一篇 " },
    search: { provider: "local" },
  },
});
