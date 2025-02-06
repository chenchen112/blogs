import { SidebarItem } from "../.vitepress/type";

const Sidebar2025: SidebarItem = {
  text: "2025",
  items: [
    {
      text: " 前端开发 ",
      collapsed: true,
      items: [],
    },
    {
      text: " 后端开发 ",
      collapsed: true,
      items: [],
    },

    {
      text: " 翻译翻译 ",
      collapsed: true,
      items: [],
    },
    {
      text: " 读书笔记 ",
      collapsed: true,
      items: [
        {
          text: " BookName ",
          collapsed: true,
          items: [],
        },
      ],
    },
    {
      text: " 旅行手册 ",
      collapsed: true,
      items: [],
    },
    { text: " 入职感受 ", link: "/2025/Onboarding" },
  ],
};

export default Sidebar2025;
