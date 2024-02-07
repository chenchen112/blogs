import { defineConfig } from "vuepress/config";

export default defineConfig({
  base: "/blog/",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "ChenChen112",
      description: "blogs react three lint http frontend",
    },
  },
  themeConfig: {
    editLinks: true,
    nav: [{ text: "Github", link: "https://github.com/chenchen112/blog" }],
    logo: "https://avatars.githubusercontent.com/u/58901888?v=4",
    sidebarDepth: 0,
    sidebar: [
      {
        title: "misc",
        children: ["/misc/monorepo"],
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
