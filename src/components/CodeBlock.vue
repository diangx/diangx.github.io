<template>
    <div v-highlight>
        <pre class="bg-light border rounded overflow-auto text-start m-0"><code :class="['font-monospace', `language-${language}`]" v-text="codeContent"></code></pre>
    </div>
</template>

<script>
export default {
    name: 'CodeBlock',
    props: {
        codeContent: {
            type: String,
            required: true
        },
        language: {
            type: String,
            default: 'javascript'
        }
    }
}
</script>