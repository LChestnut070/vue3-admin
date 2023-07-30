import { RouteRecordRaw } from 'vue-router'

export interface UserState {
  // 定义user仓库数据
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}
