import { defineConfig } from "vitepress";
import { shared } from "./config/shared";
import { zh } from "./config/zh";

export default defineConfig({
  ...shared,
  locales: {
    zh: { label: "简体中文", lang: "zh", link: "/zh/", ...zh },
  },
});
