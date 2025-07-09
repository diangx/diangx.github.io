import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function getComponent(name) {
    return () => import(
        /* webpackChunkName: "[request]" */
        `@/views/${name}`
    )
}

const routes = [
    { path: "/", redirect: "/home" }, // DEFAULT HOME
    {
        path: "/home",
        name: "home",
        component: getComponent('home/index.vue'),
    },
    {
        path: "/post",
        name: "post",
        component: getComponent("post/index.vue"),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
