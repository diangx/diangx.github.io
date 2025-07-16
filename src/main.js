import Vue from "vue"
import App from "./App.vue"
import router from "./router"

import { BootstrapVue, IconsPlugin } from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import bash    from 'highlight.js/lib/languages/bash';
import shell   from 'highlight.js/lib/languages/shell';
import 'highlight.js/styles/github.css'

import "./assets/global.css"

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', shell);

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.directive('highlight', {
    inserted(el) {
        el.querySelectorAll('pre code').forEach(block => {
            hljs.highlightBlock(block)
        })
    },
    componentUpdated(el) {
        el.querySelectorAll('pre code').forEach(block => {
            hljs.highlightBlock(block)
        })
    }
})

new Vue({
    router,
    render: h => h(App),
}).$mount("#app")
