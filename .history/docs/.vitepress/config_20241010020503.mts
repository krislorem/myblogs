import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  base: "/",
  cleanUrls: true,
  title: "Myblog",
  description: "前端学习博客",
  ignoreDeadLinks: true,
  markdown: {
    codeTransformers: [
      //@ts-ignore
      transformerTwoslash(),
    ],
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
  head: [["link", { rel: "icon", href: "/vue3.png" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local",
    },
    outline: "deep",
    outlineTitle: "目录",
    logo: "../assets/vue3.png",
    returnToTopLabel: "返回顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题切换",
    footer: {
      message:
        'Release under the <a href="https://github.com/krislorem/myblogs/blob/main/LICENSE">MIT License</a>.',
      copyright:
        'Copyright © 2024-present <a href="https://github.com/krislorem">krislorem</a>.',
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    editLink: {
      pattern: "https://github.com/krislorem/myblogs/edit/main/docs/:path",
    },
    nav: [
      { text: "🏠 主页", link: "/" },
      { text: "🧭 指南", link: "/guide/" },
      { text: "🗀 组件", link: "/components/" },
      { text: "🔗 API", link: "/api/" },
      { text: "❔ FAQ", link: "/faq/" },
      { text: "🌰 Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
      {
        text: "快速开始",
        collapsed: true,
        items: [
          { text: "Vitepress 扩展", link: "/guide/" },
          { text: "Markdown 扩展", link: "/guide/MarkdownEx" },
          { text: "VueUse", link: "/guide/VueUse" },
          { text: "Element Plus", link: "/guide/ElementPlus" },
          { text: "搜索", link: "/guide/search" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/krislorem/myblogs" },
    ],
  },
  sitemap: {
    hostname: "",
  },
});
