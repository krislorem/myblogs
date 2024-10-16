# VueUse

## 暗黑主题切换

### 动画过渡组件

```ts twoslash
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { nextTick, provide, ref } from 'vue';
const { isDark } = useData()
const { Layout } = DefaultTheme
const { frontmatter } = useData()
const layoutClass = ref('')
if (frontmatter.value?.layoutClass) {
  layoutClass.value = frontmatter.value.layoutClass
}

function enableTransitions() {
  return 'startViewTransition' in document
    && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )}px at ${x}px ${y}px)`,
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    },
  )
})
```

### 效果

![Alt text](20241010_133154.gif){data-zoomable}
