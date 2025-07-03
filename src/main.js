import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/global.css"; // ← 여기에 추가

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");
