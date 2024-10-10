import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig } from "vitepress";
export default defineConfig({
  locales: {
    root: { label: "简体中文", lang: "zh-CN", link: "/" },
    en: { label: "English", lang: "en-US", link: "/en/" },
  },
  title: "Myblog",
  description: "前端学习博客",
  ignoreDeadLinks: true,
  cleanUrls: true,
  metaChunk: true,
  markdown: {
    math: true,
    codeTransformers: [
      //@ts-ignore
      transformerTwoslash(),
    ],

    theme: {
      light: "vitesse-light",
      dark: "vitesse-black",
    },
    lineNumbers: false,
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },

  sitemap: {
    hostname: "https://vitepress.dev",
    transformItems(items) {
      return items.filter((item) => !item.url.includes("migration"));
    },
  },

  /* prettier-ignore */
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/vue3.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'root' }],
    ['meta', { property: 'og:title', content: 'VitePress | Vite & Vue Powered Static Site Generator' }],
    ['meta', { property: 'og:site_name', content: 'VitePress' }],
    ['meta', { property: 'og:image', content: 'https://vitepress.dev/vitepress-og.jpg' }],
    ['meta', { property: 'og:url', content: 'https://vitepress.dev/' }],
    ['script', { src: 'https://cdn.usefathom.com/script.js', 'data-site': 'AZBRSFGG', 'data-spa': 'auto', defer: '' }]
  ],

  themeConfig: {
    i18nRouting: true,
    logo: "/vue3.png",
    aside: "true",
    socialLinks: [
      { icon: "github", link: "https://github.com/krislorem/myblogs" },
      {
        link: "",
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.59.59 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>`,
        },
      },
      {
        link: "",
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m12 14.316l7.454-5.88l-2.022-1.625L12 11.1l-.004.003l-5.432-4.288l-2.02 1.624l7.452 5.88Zm0-7.247l2.89-2.298L12 2.453l-.004-.005l-2.884 2.318l2.884 2.3Zm0 11.266l-.005.002l-9.975-7.87L0 12.088l.194.156l11.803 9.308l7.463-5.885L24 12.085l-2.023-1.624Z"/></svg>`,
        },
      },
      {
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="currentColor" d="M488.6 104.1c16.7 18.1 24.4 39.7 23.3 65.7v202.4c-.4 26.4-9.2 48.1-26.5 65.1c-17.2 17-39.1 25.9-65.5 26.7H92.02c-26.45-.8-48.21-9.8-65.28-27.2C9.682 419.4.767 396.5 0 368.2V169.8c.767-26 9.682-47.6 26.74-65.7C43.81 87.75 65.57 78.77 92.02 78h29.38L96.05 52.19c-5.75-5.73-8.63-13-8.63-21.79c0-8.8 2.88-16.06 8.63-21.797C101.8 2.868 109.1 0 117.9 0q13.2 0 21.9 8.603L213.1 78h88l74.5-69.397C381.7 2.868 389.2 0 398 0q13.2 0 21.9 8.603c5.7 5.737 8.6 12.997 8.6 21.797c0 8.79-2.9 16.06-8.6 21.79L394.6 78h29.3c26.4.77 48 9.75 64.7 26.1m-38.8 69.7c-.4-9.6-3.7-17.4-10.7-23.5c-5.2-6.1-14-9.4-22.7-9.8H96.05c-9.59.4-17.45 3.7-23.58 9.8c-6.14 6.1-9.4 13.9-9.78 23.5v194.4c0 9.2 3.26 17 9.78 23.5s14.38 9.8 23.58 9.8H416.4c9.2 0 17-3.3 23.3-9.8s9.7-14.3 10.1-23.5zm-264.3 42.7c6.3 6.3 9.7 14.1 10.1 23.2V273c-.4 9.2-3.7 16.9-9.8 23.2c-6.2 6.3-14 9.5-23.6 9.5s-17.5-3.2-23.6-9.5s-9.4-14-9.8-23.2v-33.3c.4-9.1 3.8-16.9 10.1-23.2s13.2-9.6 23.3-10c9.2.4 17 3.7 23.3 10m191.5 0c6.3 6.3 9.7 14.1 10.1 23.2V273c-.4 9.2-3.7 16.9-9.8 23.2s-14 9.5-23.6 9.5s-17.4-3.2-23.6-9.5c-7-6.3-9.4-14-9.7-23.2v-33.3c.3-9.1 3.7-16.9 10-23.2s14.1-9.6 23.3-10c9.2.4 17 3.7 23.3 10"/></svg>`,
        },
        link: "",
      },
    ],
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            placeholder: "搜索文档",
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                searchBox: {
                  resetButtonTitle: "清除查询条件",
                  resetButtonAriaLabel: "清除查询条件",
                  cancelButtonText: "取消",
                  cancelButtonAriaLabel: "取消",
                },
                startScreen: {
                  recentSearchesTitle: "搜索历史",
                  noRecentSearchesText: "没有搜索历史",
                  saveRecentSearchButtonTitle: "保存至搜索历史",
                  removeRecentSearchButtonTitle: "从搜索历史中移除",
                  favoriteSearchesTitle: "收藏",
                  removeFavoriteSearchButtonTitle: "从收藏中移除",
                },
                errorScreen: {
                  titleText: "无法获取结果",
                  helpText: "你可能需要检查你的网络连接",
                },
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                  searchByText: "搜索提供者",
                },
                noResultsScreen: {
                  noResultsText: "无法找到相关结果",
                  suggestedQueryText: "你可以尝试查询",
                  reportMissingResultsText: "你认为该查询应该有结果？",
                  reportMissingResultsLinkText: "点击反馈",
                },
              },
            },
          },
        },
      },
    },
    nav: nav(),
    sidebar: {
      "/": home(),
      "/guide/": guide(),
      "/component/": component(),
      "/api/": api(),
      "/example/": example(),
      "/faq/": faq(),
    },

    editLink: {
      pattern: "https://github.com/krislorem/myblogs/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    footer: {
      message:
        '基于 <a href="https://github.com/krislorem/myblogs/blob/main/LICENSE">MIT 许可</a> 发布',
      copyright: `版权所有 © 2024-${new Date().getFullYear()} <a href="https://githubb.com/krislorem">krislorem</a>`,
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    outline: {
      label: "页面导航",
    },
    outlineTitle: "目录",
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },

    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
});
function nav() {
  return [
    { text: "🏠 主页", link: "/" },
    { text: "🧭 指南", link: "/guide/" },
    { text: "🗀 组件", link: "/components/" },
    { text: "🔗 API", link: "/api/" },
    { text: "❔ FAQ", link: "/faq/" },
    { text: "🌰 Examples", link: "/example/markdown-examples/" },
  ];
}

function home() {
  return [
    {
      text: "🏠 主页",
      collapsed: false,
      link: "/",
    },
  ];
}

function guide() {
  return [
    {
      text: "🧭 指南",
      collapsed: true,
      items: [
        { text: "Vitepress 扩展", link: "/guide/" },
        { text: "Markdown 扩展", link: "/guide/MarkdownEx" },
        { text: "VueUse", link: "/guide/VueUse" },
        { text: "Element Plus", link: "/guide/ElementPlus" },
        { text: "搜索", link: "/guide/search" },
        { text: "gitTalk 评论", link: "/guide/gitTalk" },
      ],
    },
  ];
}

function example() {
  return [
    {
      text: "🌰 Examples",
      collapsed: true,
      items: [
        { text: "Markdown Examples", link: "/example/markdown-examples" },
        { text: "Runtime API Examples", link: "/example/api-examples" },
      ],
    },
  ];
}

function api() {
  return [
    {
      text: "🔗 API",
      collapsed: true,
    },
  ];
}

function component() {
  return [
    {
      text: "🗀 组件",
      collapsed: true,
    },
  ];
}

function faq() {
  return [
    {
      text: "❔ FAQ",
      collapsed: true,
    },
  ];
}
