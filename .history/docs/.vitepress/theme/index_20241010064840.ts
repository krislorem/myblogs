import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import type { EnhanceAppContext } from "vitepress";
import "vitepress-theme-demoblock/dist/theme/styles/index.css";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import "./styles/vars.css";
export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue);
  },
};
