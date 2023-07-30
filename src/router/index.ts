import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from '@/router/routes.ts'
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 滚动行为
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
    }
  },
})
export default router
