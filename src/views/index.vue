<template>
    <div>
        <whoami-page></whoami-page>
        <project-page></project-page>
    </div>
</template>

<script>
import whoamiPage from './whoami/index.vue'
import projectPage from './project/index.vue'

export default {
    components :{
        whoamiPage,
        projectPage
    },
    data() {
        return {
            name : "김지완"
        }
    },
}
</script>