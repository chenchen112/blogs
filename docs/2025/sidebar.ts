import { SidebarItem } from "../.vitepress/type";

const Sidebar2025: SidebarItem = {
  text: "2025",
  items: [
    {
      text: " 前端开发 ",
      collapsed: true,
      items: [
        { text: " 从 React 到 Vue", link: "/2025/frontend/React" },
        { text: " 滚动条问题 ", link: "/2025/frontend/Scrollbar" },
        {
          text: " Webpack 插件 ",
          link: "/2025/frontend/WebpackPlugin",
        },
        {
          text: " Typescript 移植计划 ",
          link: "/2025/frontend/TypescriptNativePortToGo",
        },
        {
          text: " Typescript Enum 缺点 ",
          link: "/2025/frontend/Enum",
        },
        {
          text: " 调试本地 npm 包 ",
          link: "/2025/frontend/LocalNpmPackage",
        },
        {
          text: " Husky 替换方案",
          link: "/2025/frontend/Husky",
        },
      ],
    },
    {
      text: " 低代码 ",
      collapsed: true,
      items: [
        { text: " 初识低代码 ", link: "/2025/lowCode/lowCode" },
        { text: " 低代码痛点 ", link: "/2025/lowCode/painSpot" },
      ],
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
    // { text: " 入职感受 ", link: "/2025/Onboarding" },
    { text: " 自言自语 ", link: "/2025/SelfTalking" },
  ],
};

export default Sidebar2025;
