<template>
  <div class="d-flex justify-content-center">
    <article class="markdown-body container py-4 mx-auto bg-transparent text-dark rounded" style="max-width:1004px; width: 100%;">
      <h1 v-if="meta.title" class="mb-4 text-start">{{ meta.title }}</h1>
      <p v-if="meta.date" class="text-muted mb-4 text-start">
        {{ formatDate(meta.date) }}
      </p>
      <div v-html="html"></div>
    </article>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'

// raw-loader를 통해 모든 post 하위 index.md 파일을 문자열로 로드할 수 있는 컨텍스트
const mdContext = require.context(
  '!!raw-loader!@/views/post',
  true,
  /index\.md$/
)

export default {
  name: 'MarkdownPage',
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  data() {
    const key = `./${this.slug}/index.md`
    let rawModule = ''
    try {
      rawModule = mdContext(key)
    } catch (e) {
      console.warn(`MarkdownPage: '${key}' not found.`)
    }
    // rawModule이 모듈 객체면 default 속성에, 아니면 그대로 string
    const raw = typeof rawModule === 'string'
      ? rawModule
      : (rawModule.default || '')

    // frontmatter 추출 (--- ... ---)
    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/) || []
    const meta = {}
    let content = raw
    if (fmMatch[1]) {
      fmMatch[1].split(/\r?\n/).forEach(line => {
        const [k, ...vals] = line.split(':')
        meta[k.trim()] = vals.join(':').trim().replace(/^"|"$/g, '')
      })
      content = raw.slice(fmMatch[0].length)
    }

    // Markdown → HTML
    const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
    const html = md.render(content)
    return { meta, html }
  },
  methods: {
    formatDate(dateStr) {
      const d = new Date(dateStr)
      return d.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
/* 추가 스타일이 필요하다면 여기에 작성 */
</style>
