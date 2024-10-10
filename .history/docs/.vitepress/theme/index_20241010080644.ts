import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import "unocss";
import type { EnhanceAppContext } from "vitepress";
import "vitepress-theme-demoblock/dist/theme/styles/index.css";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import UnoCSSLayout from "./UnoCSSLayout.vue";
import DemoWrap from "./components/DemoWrap.vue";
import ListProjects from "./components/ListProjects.vue";
import "./styles/rainbow.css";
import "./styles/vars.css";
import { useRoute } from "vitepress";
import mediumZoom from "medium-zoom";
export default {
  ...DefaultTheme,
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
    return h(UnoCSSLayout, null, {});
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue);
    app.component("DemoWrap", DemoWrap);
    app.component("ListProjects", ListProjects);
  },
};
