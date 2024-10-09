import { defineConfig } from "vitepress";
import { shared } from "./config/shared";
import { zh } from "./config/zh";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ...shared,
  locales: {
    root: { label: "简体中文", ...zh },
  },
});
