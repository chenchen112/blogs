import { SidebarItem } from "../.vitepress/type";

const Sidebar2024: SidebarItem = {
  text: "2024",
  items: [
    { text: " 微信登录 ", link: "/2024/misc/Wechat" },
    { text: " 压缩 ClassName", link: "/2024/misc/ClassName" },
    { text: "Three.js 粒子效果 ", link: "/2024/misc/Particle" },
    {
      text: " 安全赋值运算符提案 ",
      link: "/2024/misc/SafeAssignment",
    },
    {
      text: "Vue",
      collapsed: true,
      items: [
        { text: " 前言 ", link: "/2024/vue/Introduction" },
        { text: " 基础篇（一）", link: "/2024/vue/Essentials1" },
        { text: " 基础篇（二）", link: "/2024/vue/Essentials2" },
        { text: " 基础篇（三） ", link: "/2024/vue/Essentials3" },
        { text: " 深入组件 ", link: "/2024/vue/Component" },
        { text: " 组件复用 ", link: "/2024/vue/Reusability" },
      ],
    },
    {
      text: "Lint 配置参考 ",
      collapsed: true,
      items: [
        { text: "Eslint", link: "/2024/lint/Eslint" },
        { text: "Prettier", link: "/2024/lint/Prettier" },
        { text: "StyleLint", link: "/2024/lint/StyleLint" },
      ],
    },
    {
      text: " 翻译 ",
      collapsed: true,
      items: [
        { text: " 碰撞检测算法 ", link: "/2024/translation/SweepAndPrune" },
        {
          text: " 记一次 JS 内存泄漏 ",
          link: "/2024/translation/GarbageCollection",
        },
      ],
    },
    {
      text: " 读书笔记 ",
      collapsed: true,
      items: [
        {
          text: " 软技能：代码之外的生存指南 ",
          collapsed: true,
          items: [
            {
              text: " 第一篇：职业 ",
              link: "/2024/reading/SoftSkills/Career",
            },
            {
              text: " 第二篇：自我营销  ",
              link: "/2024/reading/SoftSkills/SelfMarketing",
            },
            {
              text: " 第三篇：学习 ",
              link: "/2024/reading/SoftSkills/Learning",
            },
            {
              text: " 第四篇：生产力  ",
              link: "/2024/reading/SoftSkills/Productivity",
            },
            {
              text: " 第五篇：理财 ",
              link: "/2024/reading/SoftSkills/Financing",
            },
            {
              text: " 第六篇：健身  ",
              link: "/2024/reading/SoftSkills/Bodybuilding",
            },
            {
              text: " 第七篇：精神 ",
              link: "/2024/reading/SoftSkills/Spirit",
            },
          ],
        },
      ],
    },
    { text: " 待办事项 ", link: "/2024/todo" },
  ],
};

export default Sidebar2024;
