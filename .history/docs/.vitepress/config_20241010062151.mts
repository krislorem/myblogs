import { defineConfig } from "vitepress";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
export default defineConfig({
  locales: {
    root: { label: "简体中文", lang: "zh-CN", link: "/" },
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
    lineNumbers: true,
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
    ],
    search: {
      provider: "algolia",
      options: {
        appId: "8J64VVRP8K",
        apiKey: "52f578a92b88ad6abde815aae2b0ad7c",
        indexName: "vitepress",
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
      message: "基于 MIT 许可发布",
      copyright: `版权所有 © 2024-${new Date().getFullYear()} 尤雨溪`,
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
        { text: "Markdown Examples", link: "/markdown-examples" },
        { text: "Runtime API Examples", link: "/api-examples" },
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
