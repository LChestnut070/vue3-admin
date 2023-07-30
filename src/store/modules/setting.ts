import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('Setting', {
  state: () => {
    return {
      // 侧边menu是否收齐折叠
      fold: false,
      // 刷新状态
      refresh: false,
    }
  },
})

export default useLayoutSettingStore
