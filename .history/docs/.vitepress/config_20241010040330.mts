// import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
// import { defineConfig } from "vitepress";
// // https://vitepress.dev/reference/site-config
// export default defineConfig({
//   cleanUrls: true,
//   title: "Myblog",
//   description: "前端学习博客",
//   ignoreDeadLinks: true,
//   markdown: {
//     codeTransformers: [
//       //@ts-ignore
//       transformerTwoslash(),
//     ],
//     theme: {
//       light: "vitesse-light",
//       dark: "vitesse-black",
//     },
//     lineNumbers: true,
//     container: {
//       tipLabel: "提示",
//       warningLabel: "警告",
//       dangerLabel: "危险",
//       infoLabel: "信息",
//       detailsLabel: "详细信息",
//     },
//   },
//   metaChunk: true,
//   head: [["link", { rel: "icon", href: "/vue3.png" }]],
//   themeConfig: {
//     // https://vitepress.dev/reference/default-theme-config
//     search: {
//       provider: "local",
//       options: {
//         locales: {
//           zh: {
//             translations: {
//               button: {
//                 buttonText: "搜索文档",
//                 buttonAriaLabel: "搜索文档",
//               },
//               modal: {
//                 noResultsText: "无法找到相关结果",
//                 resetButtonTitle: "清除查询条件",
//                 footer: {
//                   selectText: "选择",
//                   navigateText: "切换",
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//     i18nRouting: true,
//     outline: { label: "页面导航" },
//     outlineTitle: "目录",
//     logo: "/vue3.png",
//     returnToTopLabel: "返回顶部",
//     sidebarMenuLabel: "菜单",
//     darkModeSwitchLabel: "主题切换",
//     footer: {
//       message:
//         'Release under the <a href="https://github.com/krislorem/myblogs/blob/main/LICENSE">MIT License</a>.',
//       copyright: `Copyright © 2024-${new Date().getFullYear()} <a href="https://github.com/krislorem">krislorem</a>.`,
//     },
//     docFooter: {
//       prev: "上一页",
//       next: "下一页",
//     },
//     editLink: {
//       pattern: "https://github.com/krislorem/myblogs/edit/main/docs/:path",
//       text: "在 GitHub 上编辑此页",
//     },
//     lastUpdated: {
//       text: "最后更新于",
//       formatOptions: {
//         dateStyle: "short",
//         timeStyle: "medium",
//       },
//     },
//     langMenuLabel: "多语言",
//     darkModeSwitchTitle: "主题",
//     lightModeSwitchTitle: "切换到深色模式",
//     nav: [
//       { text: "🏠 主页", link: "/zh/" },
//       { text: "🧭 指南", link: "/zh/guide/" },
//       { text: "🗀 组件", link: "/zh/components/" },
//       { text: "🔗 API", link: "/zh/api/" },
//       { text: "❔ FAQ", link: "/zh/faq/" },
//       { text: "🌰 Examples", link: "/zh/markdown-examples/" },
//     ],

//     sidebar: [
//       {
//         text: "🏠 主页",
//         link: "/zh/",
//       },
//       {
//         text: "🌰 Examples",
//         collapsed: true,
//         items: [
//           { text: "Markdown Examples", link: "/zh/markdown-examples" },
//           { text: "Runtime API Examples", link: "/zh/api-examples" },
//         ],
//       },
//       {
//         text: "🧭 指南",
//         collapsed: true,
//         items: [
//           { text: "Vitepress 扩展", link: "/zh/guide/" },
//           { text: "Markdown 扩展", link: "/zh/guide/MarkdownEx" },
//           { text: "VueUse", link: "/zh/guide/VueUse" },
//           { text: "Element Plus", link: "/zh/guide/ElementPlus" },
//           { text: "搜索", link: "/zh/guide/search" },
//         ],
//       },
//       {
//         text: "🗀 组件",
//         collapsed: true,
//       },
//       {
//         text: "🔗 API",
//         collapsed: true,
//       },
//       {
//         text: "❔ FAQ",
//         collapsed: true,
//       },
//     ],

//     socialLinks: [
//       { icon: "github", link: "https://github.com/krislorem/myblogs" },
//     ],
//   },
//   sitemap: {
//     hostname: "",
//   },
// });
