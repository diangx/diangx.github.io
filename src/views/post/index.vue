<template>
    <div 
        class="d-flex justify-content-center align-items-start pt-4" 
        style="min-height: 100vh;"
    >
        <div class="row w-100 justify-content-center no-gutters">
            <div
                v-for="posts in cards"
                :key="posts.slug"
                class="col-12 col-lg-9 mb-4"
            >
                <router-link
                    :to="{ name: posts.name }"
                    class="text-reset d-block"
                >
                <b-card no-body class="overflow-hidden w-100">
                    <b-row no-gutters>
                        <b-col cols="12" md="4">
                            <b-card-img
                                :src="posts.img"
                                :alt="posts.title"
        
                            />
                        </b-col>
                        
                        <b-col cols="12" md="8">
                            <b-card-body :title="posts.title">
                                <b-card-text>
                                    {{ posts.sub_title }}
                                </b-card-text>
                            </b-card-body>
                        </b-col>
                    </b-row>
                </b-card>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import posts from './post.js'

export default {
    data() {
        return {
            cards : posts.filter(p => p.show)
        }
    }
}
</script>
