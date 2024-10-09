import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",
  cleanUrls: true,
  title: "Myblog",
  description: "前端学习博客",
  ignoreDeadLinks: true,
  markdown: {
    theme: {
      light: "vitesse-light",
      dark: "vitesse-black",
    },
    lineNumbers: true,
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      { text: "指南", link: "/guide/" },
      { text: "组件", link: "/components/" },
      { text: "API", link: "/api/" },
      { text: "FAQ", link: "/faq/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
