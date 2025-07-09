<template>
    <div 
        class="d-flex flex-column align-items-center pt-4" 
        style="min-height: 100vh;"
    >
        <b-avatar :src="profileSrc" size="10rem" class="mb-2"/>
        <h1>JIWAN KIM</h1>
    </div>
</template>

<script>
import profile from '@/assets/img/profile_inosuke.png'

export default {
    data() {
        return {
            profileSrc: profile
        }
    }
}
</script>
