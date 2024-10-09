<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import { useData, useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { nextTick, provide, ref } from 'vue';
import Comment from './components/Comment.vue';
const { Layout } = DefaultTheme;
const { isDark, lang, frontmatter } = useData()
const route = useRoute();
const initZoom = () => {
    // @ts-ignore
    new mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' });
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

const layoutClass = ref('')
if (frontmatter.value?.layoutClass) {
    layoutClass.value = frontmatter.value.layoutClass
}
</script>

<template>
    <Layout :class="layoutClass">
        <template #doc-after>
            <Comment />
        </template>
    </Layout>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
    z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
    z-index: 9999;
}

.VPSwitchAppearance {
    width: 22px !important;
}

.VPSwitchAppearance .check {
    transform: none !important;
}
</style>