# Vitepress 扩展

## Twoslash

::: tip `@shikijs/vitepress-twoslash`

![NPM Version](https://img.shields.io/npm/v/@shikijs/vitepress-twoslash)

![NPM Downloads](https://img.shields.io/npm/dw/@shikijs/vitepress-twoslash)
:::

要在 Vitepress 中启用 TypeScript Twoslash（类型悬停显示），可以使用`@shikijs/vitepress-twoslash`插件来快速开始，它借助 Floating Vue 在容器外显示具有样式的类型信息。

```ts{1} twoslash
console.log('hello')
```

### 安装

```bash
npm i -D @shikijs/vitepress-twoslash
```

在 `.vitepress/config.mts` 配置文件中：

```ts{2,8} twoslash
// .vitepress/config.mts
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    codeTransformers: [
      transformerTwoslash() 
    ]
  }
})
```

::: details 说明
新的文件扩展：`.mts` 与 `.cts`
除了使用 `type` 字段来控制模块解析以外，你也可以显式的使用 TS4.5 新增的两个扩展名 `.mts` 与 `.cts` 来声明文件，就像 NodeJS 中一样，`.mjs` 始终会被视作 ESM，而 `.cjs` 始终会被视作 CJS，而这两个新扩展名也会对应的编译到 `.d.mts` + `.mjs` 或 `.d.cts` + `.cjs` 的形式。
:::

然后在你的 `.vitepress/theme/index.ts` 中，安装 Vue 插件并通过 `vitepress-plugin-twoslash/styles.css` 导入 CSS。

```ts{1,3,11} twoslash
import type { EnhanceAppContext } from 'vitepress'
// .vitepress/theme/index.ts
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import Theme from 'vitepress/theme'

import '@shikijs/vitepress-twoslash/style.css'

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue) 
  },
}
```
