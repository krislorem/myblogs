import { defineConfig, type DefaultTheme } from "vitepress";

export const zh = defineConfig({
  themeConfig: {
    nav: nav(),
    sidebar: {
      "/zh/": home_zh(),
      "/zh/guide/": guide_zh(),
      "/zh/component/": component_zh(),
      "/zh/api/": api_zh(),
      "/zh/example/": example_zh(),
      "/zh/faq/": faq_zh(),
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

export const search: DefaultTheme.AlgoliaSearchOptions["locales"] = {
  zh: {
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

function nav() {
  return [
    { text: "🏠 主页", link: "/zh/" },
    { text: "🧭 指南", link: "/zh/guide/" },
    { text: "🗀 组件", link: "/zh/components/" },
    { text: "🔗 API", link: "/zh/api/" },
    { text: "❔ FAQ", link: "/zh/faq/" },
    { text: "🌰 Examples", link: "/zh/markdown-examples/" },
  ];
}

function home_zh() {
  return [
    {
      text: "🏠 主页",
      collapsed: false,
      link: "/zh/",
    },
  ];
}

function guide_zh() {
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

function example_zh() {
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

function api_zh() {
  return [
    {
      text: "🔗 API",
      collapsed: true,
    },
  ];
}

function component_zh() {
  return [
    {
      text: "🗀 组件",
      collapsed: true,
    },
  ];
}

function faq_zh() {
  return [
    {
      text: "❔ FAQ",
      collapsed: true,
    },
  ];
}
