import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { title: 'Homepage' },
    component: () => import(/* webpackChunkName: "home" */ '@/views/Homepage.vue')
  },
  {
    path: '/search',
    name: 'search',
    meta: { title: 'Search results' },
    component: () => import(/* webpackChunkName: "search" */ '@/views/ResultsPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
