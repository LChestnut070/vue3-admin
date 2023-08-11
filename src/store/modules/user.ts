import { defineStore } from 'pinia'
import type {
  loginForm,
  loginResData,
  userinfoResData,
} from '@/api/user/type.ts'
import { reqGetUserInfo, reqLogin, reqLogout } from '@/api/user'
import type { UserState } from '@/store/modules/types/type.ts'
import { Get_Token, Remove_Token, Set_Token } from '@/utils/token.ts'
import { anyRoute, asyncRoute, constantRoutes } from '@/router/routes'
import router from '@/router'
// 引入lodash深拷贝
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cloneDeep from 'lodash/cloneDeep'

// 过滤路由
function filterRes(Routes: any, asyncRoutes: any) {
  return asyncRoutes.filter((item: any) => {
    if (Routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        // 递归出来的结果会覆盖children
        item.children = filterRes(Routes, item.children)
      }
      return true
    }
  })
}
const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: Get_Token(),
      // 路由
      menuRoutes: constantRoutes,
      // 用户名
      username: '',
      avatar: '',
      // 用户的按钮权限
      buttons: [],
    }
  },
  actions: {
    // 登录
    async userLogin(data: loginForm) {
      const res: loginResData = await reqLogin(data)
      if (res.code === 200) {
        this.token = res.data as string
        // 持久化存储
        Set_Token(res.data as string)
        return 'ok'
      } else {
        // promise默认返回的是undefined,也视为成功,故要手动返回一个错误
        return Promise.reject(new Error(res.data))
      }
    },
    // 获取用户信息
    async userInfo() {
      const res: userinfoResData = await reqGetUserInfo()
      if (res.code === 200) {
        this.username = res.data.name
        this.avatar = res.data.avatar
        this.buttons = res.data.buttons
        // 用户异步路由
        // 对全部异步路由进行深拷贝防止影响
        const userRoutes = filterRes(res.data.routes, cloneDeep(asyncRoute))
        // 重新赋值用户所有路由(用于菜单展示)
        this.menuRoutes = [...constantRoutes, ...userRoutes, ...anyRoute]
        // 将异步路由、任意路由全部添加到路由管理器中
        ;[...userRoutes, ...anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    //退出登录
    async userLogout() {
      const res: any = await reqLogout()
      if (res.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        Remove_Token()
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
  },
  getters: {},
})
export default useUserStore
