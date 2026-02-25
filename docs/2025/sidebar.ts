import { SidebarItem } from "../.vitepress/type";

const Sidebar2025: SidebarItem = {
  text: "2025",
  items: [
    {
      text: "前端开发",
      collapsed: true,
      items: [
        { text: "从 React 到 Vue", link: "/2025/frontend/React" },
        {
          text: "Vue 响应式失效",
          link: "/2025/frontend/VueReactive",
        },
        {
          text: "组件销毁时的请求取消",
          link: "/2025/frontend/AbortController",
        },
        {
          text: "业务组件库",
          link: "/2025/frontend/Components",
        },
        {
          text: "入门 TailwindCSS 4.0",
          link: "/2025/frontend/TailwindCSS4.0",
        },
        {
          text: "入门 Vite 7.0",
          link: "/2025/frontend/Vite7.0",
        },
        {
          text: "使用 pdf.js 实现 PDF 预览",
          link: "/2025/frontend/PDF",
        },
        {
          text: "初探 Web3.0",
          link: "/2025/frontend/Web3.0",
        },
        {
          text: "Webpack 插件",
          link: "/2025/frontend/WebpackPlugin",
        },
        { text: " 滚动条问题 ", link: "/2025/frontend/Scrollbar" },
        {
          text: "Typescript 移植计划",
          link: "/2025/frontend/TypescriptNativePortToGo",
        },
        {
          text: "Typescript Enum 缺点",
          link: "/2025/frontend/Enum",
        },
        {
          text: "调试本地 npm 包",
          link: "/2025/frontend/LocalNpmPackage",
        },
        {
          text: "Husky 替换方案",
          link: "/2025/frontend/Husky",
        },
      ],
    },
    {
      text: "低代码",
      collapsed: true,
      items: [
        { text: "初识低代码", link: "/2025/lowCode/lowCode" },
        { text: "低代码痛点", link: "/2025/lowCode/painSpot" },
      ],
    },
    {
      text: "读书笔记",
      collapsed: true,
      items: [
        { text: "优质文章", link: "/2025/reading/index" },
        { text: "代码整洁之道", link: "/2025/reading/CleanCode" },
      ],
    },
    // { text: " 入职感受 ", link: "/2025/Onboarding" },
    { text: "自言自语", link: "/2025/SelfTalking" },
  ],
};

export default Sidebar2025;
