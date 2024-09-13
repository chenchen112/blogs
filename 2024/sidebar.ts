import { SidebarConfigArray } from "vuepress/config";

const isProd = process.env.NODE_ENV === "production";

const Sidebar2024: SidebarConfigArray[number] = {
  title: "2024",
  children: [
    !isProd ? "" : "/2024/todo",
    "/2024/misc/Wechat",
    "/2024/misc/ClassName",
    "/2024/misc/Particle",
    "/2024/misc/JsQuestions",
    {
      title: "Vue",
      children: [
        "/2024/vue/Introduction",
        "/2024/vue/Essentials1",
        "/2024/vue/Essentials2",
        "/2024/vue/Essentials3",
        "/2024/vue/Component",
      ],
    },
    {
      title: "Lint 配置参考 ",
      children: [
        "/2024/lint/Eslint",
        "/2024/lint/Prettier",
        "/2024/lint/StyleLint",
      ],
    },
    {
      title: " 翻译 ",
      children: [
        "/2024/translation/SweepAndPrune",
        "/2024/translation/GarbageCollection",
      ],
    },
    {
      title: " 读书笔记 ",
      children: [
        {
          title: " 软技能：代码之外的生存指南 ",
          children: [
            "/2024/reading/SoftSkills/Career",
            "/2024/reading/SoftSkills/SelfMarketing",
            "/2024/reading/SoftSkills/Learning",
            "/2024/reading/SoftSkills/Productivity",
            "/2024/reading/SoftSkills/Financing",
            "/2024/reading/SoftSkills/Bodybuilding",
            "/2024/reading/SoftSkills/Spirit",
          ],
        },
      ],
    },
  ],
};

export default Sidebar2024;
