import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/style/index.scss'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// ElementPlus暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// svg
import 'virtual:svg-icons-register'
// 全局组件
import globalComponent from '@/components/index.ts'
// permission
import '@/permission'
// 自定义指令
import { isHasBtn } from './directive/ishasbtn'
const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)
app.use(pinia)
app.use(globalComponent)
isHasBtn(app)
app.mount('#app')
