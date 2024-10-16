# gitTalk 评论

## 配置

![Alt text](image.png){data-zoomable}

在 `.docs/theme/components/` 中创建组件脚本如下：

```ts twoslash
import md5 from 'blueimp-md5'
import Gitalk from 'gitalk'
import 'gitalk/dist/gitalk.css'
import { useData, useRouter } from 'vitepress'
import { nextTick, onMounted, ref, watch } from 'vue'

const { page } = useData()
const { route } = useRouter()

// 配置（需要自己修改）
const gitDefault = {
    clientID: 'Ov23ctCjnQpTLvqdBtJG', // !需要改成自己的clientID
    clientSecret: 'f6bd95de9582ebd7115374677b39fe12311d40ea', // !需要改成自己的clientSecret
    repo: 'myblogs', // !需要改成自己创建的评论仓库
    owner: 'krislorem', // !需要改成自己的用户名
    admin: ['krislorem'], // !需要改成自己的用户名
    id: md5(page.value.relativePath),
    language: 'zh-CN',
    distractionFreeMode: false,
}

const showFlag = ref(true)
// 渲染评论组件
onMounted(() => {
    watch(
        () => route.path,
        () => {
            showFlag.value = false
            nextTick(() => {
                showFlag.value = true
                setTimeout(() => {
                    // 初始化评论组件配置
                    const gitalk = new Gitalk({ ...gitDefault, id: md5(page.value.relativePath) })

                    gitalk.render('comment-container')
                    // 点赞前检查登录状态
                    const commentContainer: HTMLElement | null =
                        document.getElementById('comment-container')

                    commentContainer?.addEventListener('click', (event: Event) => {
                        if (!window.localStorage.getItem('GT_ACCESS_TOKEN')) {
                            alert('点赞前，请先登录')
                            event.preventDefault()
                        }
                    })

                    // 提交评论后重置输入框高度
                    commentContainer?.addEventListener('click', (event: Event) => {
                        const gtTextarea: HTMLElement | null =
                            document.querySelector('.gt-header-textarea')
                        if (gtTextarea) {
                            ; (gtTextarea as HTMLInputElement).style.height = '72px'
                        }
                    })

                    // 点击预览时切换评论按钮可见性
                    commentContainer?.addEventListener('click', (event: Event) => {
                        const commentButton: HTMLElement | null = document.querySelector(
                            '.gt-header-controls .gt-btn-public'
                        )
                        if (commentButton) {
                            commentButton.classList.toggle('hide')
                        }
                    })
                }, 0)
            })
        },
        { immediate: true }
    )
})
```

导入组件

```vue
<template>
  <Layout :class="layoutClass">
    <template #doc-after>
      <Comment />
    </template>
  </Layout>
</template>
```

在仓库中随便开启一个Issues;
登陆后即可看到如下效果:

![Alt text](image-1.png){data-zoomable}
