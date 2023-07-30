import SvgIcon from '@/components/SvgIcon/index.vue'
import Category from '@/components/Category/index.vue'
import type { App, Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 为对象形式,属性名只有name,属性值只有形为component的的数组(component是从vue获取的)
const components: { [name: string]: Component } = { SvgIcon, Category }
export default {
  install(app: App) {
    // 获取key,然后全部挂载
    Object.keys(components).forEach((key: string) => {
      // components为对象,且属性名为动态,所以只能使用[key]
      app.component(key, components[key])
    })
    // 解构出每个图标,key结构结果为组件名称,component结构结果为组件本体
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
