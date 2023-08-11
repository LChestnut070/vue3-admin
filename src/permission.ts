import router from '@/router/index'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 在非vue和store页面下如果想使用store必须引入pinia
import pinia from './store'
import useUserStore from './store/modules/user'
import setting from './setting'
import { ElMessage } from 'element-plus'

const userStore = useUserStore(pinia)
// 取消进度条小圈
nprogress.configure({ showSpinner: false })

router.beforeEach(async (to: any, from: any, next: any) => {
  nprogress.start()
  const token = userStore.token
  const username = userStore.username
  if (token) {
    // 如果有token
    // 如果去的是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      ElMessage({
        type: 'warning',
        message: '已经登录过了哦,请勿再次登录QAQ',
      })
    } else {
      if (username) {
        next()
      } else {
        // 如果有token且没有用户信息(第一次登录和页面刷新之后token还在但是用户信息没了)(token是会过期的但不会消失,所以如果将用户信息持久化存储,等token过期后将无法获取到新的用户信息)
        await userStore
          .userInfo()
          .then(() => {
            // 获取用户信息后放行
            next({ ...to, replace: true })
          })
          .catch(async () => {
            ElMessage({
              type: 'error',
              message: '登录状态已过期,请重新登录',
            })
            //如果获取用户信息失败,则表明token过期或token被修改,则需要重新获取token和用户信息
            await userStore.userLogout()
            next({
              path: '/login',
              query: { redirect: to.path },
            })
          })
      }
    }
  } else {
    // 如果没有token
    // 如果去的是登录页
    if (to.path === '/login') {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.path },
      })
    }
  }
})

router.afterEach((to: any) => {
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.done()
})
