<template>
    <div>
        <h3>Recent Updates</h3>
            <ol>
                <li v-for="item in commits" :key="item.slug">
                    <strong>{{ item.title }}</strong>
                        — {{ new Date(item.date).toLocaleString() }}<br/>
                    <small>{{ item.commit.message }}</small>
                </li>
            </ol>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import posts from '@/views/post/post.js'

export default {
    setup() {
        const commits = ref([])
        const owner = 'diangx'
        const repo  = 'diangx.github.io'

        onMounted(async () => {
            // show === true 인 항목만 처리
            const list = posts.filter(p => p.show)
            const results = await Promise.all(
                list.map(async p => {
                    const path = `src/views/post/${p.name}/index.vue`
                    const url  = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(path)}&per_page=1`
                    const res  = await fetch(url)
                    const data = await res.json()
                    const c    = data[0] || {}
                    return {
                        slug:   p.name,
                        title:  p.title,
                        date:   c.commit?.author.date || null,
                        commit: c.commit || { message: '정보 없음' }
                    }
                })
            )
            // 날짜 내림차순 정렬
            commits.value = results
                .filter(r => r.date)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
        })

        return { commits }
    }
}
</script>
