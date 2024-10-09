import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import type { EnhanceAppContext } from "vitepress";
import "vitepress-theme-demoblock/dist/theme/styles/index.css";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import "./styles/vars.css";
import "./styles/rainbow.css";
import "uno.css";
import { useRoute } from "vitepress";
import Theme from "vitepress/theme";
import mediumZoom from "medium-zoom";
import DemoWrap from "./components/DemoWrap.vue";
import ListProjects from "./components/ListProjects.vue";
export default {
  ...DefaultTheme,
  Layout,
  setup() {
    const route = useRoute();
    const initZoom = () => {
      // @ts-ignore
      new mediumZoom("[data-zoomable]", { background: "var(--vp-c-bg)" });
    };
    // @ts-ignore
    onMounted(() => {
      initZoom();
    });
    // @ts-ignore
    watch(
      () => route.path,
      // @ts-ignore
      () => nextTick(() => initZoom())
    );
  },
  Layout: () => {
    return h(Layout, null, {});
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue);
    app.component("DemoWrap", DemoWrap);
    app.component("ListProjects", ListProjects);
  },
};
