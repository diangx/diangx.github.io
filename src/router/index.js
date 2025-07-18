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
    {
        path: "/post/nlbwmon",
        name: "nlbwmon",
        component: getComponent("post/nlbwmon/index.vue"),
    },
    {
        path: "/post/macfilter",
        name: "macfilter",
        component: getComponent("post/macfilter/index.vue"),
    },
    {
        path: "/post/gitcommand",
        name: "gitcommand",
        component: getComponent("post/gitcommand/index.vue"),
    },
    {
        path: "/post/stock/nike",
        name: "stock/nike",
        component: getComponent("post/stock/nike/index.vue"),
    }
];

const router = new VueRouter({
    routes,
});

export default router;
