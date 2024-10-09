import { defineConfig } from "vitepress";
import { shared } from "./config/shared";

export default defineConfig({
  base: "/zh/",
  ...shared,
  locales: {
    root: { label: "简体中文", lang: "zh" },
  },
});
