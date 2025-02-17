import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/index.vue')
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('../views/AboutView.vue')
  // }
  {
    path: '/mcs',
    name: 'mcs',
    component: () => import('../views/mcs-system/index.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router
