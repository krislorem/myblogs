import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig } from "vitepress";
import { search as zhSearch } from "./zh";
export const shared = defineConfig({
  title: "Myblog",
  description: "前端学习博客",
  ignoreDeadLinks: true,
  rewrites: {
    "/:rest*": "zh/:rest*",
  },
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
    // https://vitepress.dev/reference/default-theme-config
    logo: "/vue3.png",
    socialLinks: [
      { icon: "github", link: "https://github.com/krislorem/myblogs" },
    ],
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },
    search: {
      provider: "algolia",
      options: {
        appId: "8J64VVRP8K",
        apiKey: "52f578a92b88ad6abde815aae2b0ad7c",
        indexName: "vitepress",
        locales: {
          ...zhSearch,
        },
      },
    },
  },
});
