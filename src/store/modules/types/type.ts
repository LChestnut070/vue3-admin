import type { cateObj } from '@/api/product/attr/type'
import { RouteRecordRaw } from 'vue-router'

export interface UserState {
  // 定义user仓库数据
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}
export interface CategoryState {
  // 定义category仓库数据
  cate1Id: string | number
  cate2Id: string | number
  cate3Id: string | number
  cate1List: cateObj[]
  cate2List: cateObj[]
  cate3List: cateObj[]
}
