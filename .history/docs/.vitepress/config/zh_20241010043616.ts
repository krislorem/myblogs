import { defineConfig, type DefaultTheme } from "vitepress";

export const zh = defineConfig({
  description: "由 Vite 和 Vue 驱动的静态站点生成器",
  themeConfig: {
    nav: [
      { text: "🏠 主页", link: "/" },
      { text: "🧭 指南", link: "/guide/" },
      { text: "🗀 组件", link: "/components/" },
      { text: "🔗 API", link: "/api/" },
      { text: "❔ FAQ", link: "/faq/" },
      { text: "🌰 Examples", link: "/markdown-examples/" },
    ],

    sidebar: [
      {
        text: "🏠 主页",
        link: "/",
      },
      {
        text: "🌰 Examples",
        collapsed: true,
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
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
      {
        text: "🗀 组件",
        collapsed: true,
      },
      {
        text: "🔗 API",
        collapsed: true,
      },
      {
        text: "❔ FAQ",
        collapsed: true,
      },
    ],
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

export const search: DefaultTheme.AlgoliaSearchOptions["locales"] = {
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
};
