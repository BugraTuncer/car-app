import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'listing',
      component: () => import('@/features/listing/views/ListingView.vue')
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('@/features/detail/views/DetailView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
