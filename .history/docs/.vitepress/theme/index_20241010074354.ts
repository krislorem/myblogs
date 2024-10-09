import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import "unocss";
import type { EnhanceAppContext } from "vitepress";
import "vitepress-theme-demoblock/dist/theme/styles/index.css";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import DemoWrap from "./components/DemoWrap.vue";
import ListProjects from "./components/ListProjects.vue";
import "./styles/rainbow.css";
import "./styles/vars.css";
export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue);
    app.component("DemoWrap", DemoWrap);
    app.component("ListProjects", ListProjects);
  },
};
