<template>
    <div 
        class="d-flex flex-column align-items-center pt-4" 
        style="min-height: 100vh;"
    >
        <b-avatar :src="profileSrc" size="10rem" class="mb-2"/>
        <h1>JIWAN KIM</h1>
        <hr class="w-100" />
            <recentSection/>
    </div>
</template>

<script>
import profile from '@/assets/img/profile_otter.png'
import recentSection from '@/views/home/recent/index.vue'

export default {
	components: {
        recentSection
	},
    data() {
        return {
            profileSrc: profile
        }
    }
}
</script>
