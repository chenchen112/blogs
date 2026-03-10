import { SidebarItem } from "../.vitepress/type";

const Sidebar2026: SidebarItem = {
  text: "2026",
  items: [
    {
      text: "前端开发",
      collapsed: true,
      items: [
        { text: "VsCode 插件开发", link: "/2026/frontend/VsCodePlugin" },
        { text: "关于 MonoRepo", link: "/2026/frontend/MonoRepo" },
      ],
    },
    {
      text: "关于AI",
      collapsed: true,
      items: [{ text: "如何看待 AI", link: "/2026/ai/introduction" }],
    },
    {
      text: "读书笔记",
      collapsed: true,
      items: [
        { text: "设计心理学", link: "/2026/reading/TheDesignOfEverydayThings" },
      ],
    },
    { text: "软件开发模式", link: "/2026/DevModel" },
    { text: "关于工作", link: "/2026/AboutWork" },
    { text: "自言自语", link: "/2026/SelfTalking" },
  ],
};

export default Sidebar2026;
