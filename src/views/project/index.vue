<template>
    <div 
        class="d-flex justify-content-center align-items-start pt-4" 
        style="min-height: 100vh;"
    >
        <div class="row w-100 justify-content-center no-gutters">
            <div
                v-for="projects in cards"
                :key="projects.slug"
                class="col-lg-7 mb-4"
            >
                <router-link
                    :to="{ name: projects.name }"
                    class="text-reset text-decoration-none d-block"
                >
                <b-card no-body class="overflow-hidden w-100">
                    <b-row no-gutters>
                        <b-col cols="12" md="4">
                            <b-card-img v-if="projects.img"
                                :src="projects.img"
                                :alt="projects.title"
        
                            />
                        </b-col>
                        
                        <b-col cols="12" md="8">
                            <b-card-body :title="projects.title">
                                <b-card-text>
                                    <div>
                                        <b-badge
                                            class="ml-1"
                                            v-for="(tag, idx) in projects.tag"
                                            :key="idx"
                                            :variant="tagColor(tag)"
                                        >
                                            {{ tag }}
                                        </b-badge>
                                    </div>
                                    {{ projects.sub_title }}
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
import projects from './project.js'

export default {
    data() {
        return {
            cards : projects.filter(p => p.show)
        }
    },
    methods: {
        tagColor(tag) {
            const colorMap = {
                openwrt: 'primary',
                stock: 'danger',
                development: 'info',
                story: 'success',
                default: 'secondary'
            }
            return colorMap[tag.toLowerCase()] || colorMap.default
        }
    }
}
</script>
