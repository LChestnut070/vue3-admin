import { defineStore } from 'pinia'
import type {
  loginForm,
  loginResData,
  userinfoResData,
} from '@/api/user/type.ts'
import { reqGetUserInfo, reqLogin, reqLogout } from '@/api/user'
import type { UserState } from '@/store/modules/types/type.ts'
import { Get_Token, Remove_Token, Set_Token } from '@/utils/token.ts'
import { constantRoutes } from '@/router/routes'

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: Get_Token(),
      // 路由
      menuRoutes: constantRoutes,
      // 用户名
      username: '',
      avatar: '',
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
