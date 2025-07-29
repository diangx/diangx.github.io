<template>
    <div id="app">
        <NavBar/>
        <!-- <nav>
            <router-link to="/home">Home</router-link> |
            <router-link to="/blog">Blog</router-link>
        </nav> -->
        <div :class="containerClass">
            <router-view/>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
	components: { NavBar },
    computed: {
        containerClass() { // remove class when project route
            const currentPath = this.$route.path
            return currentPath.startsWith('/project') ? '' : 'px-0 px-md-5'
        }
    }
}
</script>

<style>
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

nav {
    padding: 30px;
}

nav a {
    color: #2c3e50;
}

nav a.router-link-exact-active {
    font-weight: bold;
}
</style>
