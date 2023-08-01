import { defineStore } from 'pinia'
import {
  reqGetCate1List,
  reqGetCate2List,
  reqGetCate3List,
} from '@/api/product/attr'
import type { cateRes } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 一级分类id
      cate1Id: '',
      // 二级分类id
      cate2Id: '',
      // 三级分类id
      cate3Id: '',
      // 一级分类列表
      cate1List: [],
      // 二级分类列表
      cate2List: [],
      // 三级分类列表
      cate3List: [],
    }
  },
  actions: {
    // 获取一级分类列表
    async getCate1List() {
      const res: cateRes = await reqGetCate1List()
      if (res.code === 200) {
        this.cate1List = res.data
      }
    },
    // 获取二级分类列表
    async getCate2List() {
      const res: cateRes = await reqGetCate2List(this.cate1Id)
      if (res.code === 200) {
        this.cate2List = res.data
      }
    },
    // 获取三级分类列表
    async getCate3List() {
      const res: cateRes = await reqGetCate3List(this.cate2Id)
      if (res.code === 200) {
        this.cate3List = res.data
      }
    },
  },
  getters: {},
})
export default useCategoryStore
