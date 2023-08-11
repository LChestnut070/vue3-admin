import pinia from '@/store'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore(pinia)

export const isHasBtn = (app: any) => {
  app.directive('hasbtn', {
    // el:哪个元素调用了此指令,option:传入的值
    mounted(el: any, option: any) {
      // 如果用户按钮权限不包含传入的值,那么移除这个元素
      console.log(userStore.buttons)

      if (!userStore.buttons.includes(option.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
