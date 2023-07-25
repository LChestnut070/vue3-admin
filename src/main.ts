import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

const qwq = function q() {
  console.log('我是修改的内容')
}
qwq()
