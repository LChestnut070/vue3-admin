<template>
  <!-- 刷新 -->
  <el-button icon="Refresh" circle @click="updateRefresh" />
  <!-- 全屏 -->
  <el-button icon="FullScreen" circle @click="fullScreen" />
  <!-- 设置 -->
  <el-popover placement="bottom" title="主题设置" :width="250" trigger="hover">
    <template #reference>
      <el-button class="m-2" icon="setting" circle></el-button>
    </template>
    <template #default>
      <el-form>
        <!-- 主题颜色 -->
        <el-form-item label="主题颜色">
          <el-color-picker
            size="small"
            v-model="color"
            show-alpha
            :predefine="predefineColors"
            @change="colorChange"
          />
        </el-form-item>
        <!-- 暗黑模式 -->
        <el-form-item label="暗黑模式">
          <el-switch
            active-text="打开"
            inactive-text="关闭"
            active-icon="MoonNight"
            inactive-icon="Sunny"
            inline-prompt
            v-model="darkSwitch"
            @change="changeDark"
          />
        </el-form-item>
      </el-form>
    </template>
  </el-popover>
  <!-- 头像 -->
  <el-avatar :src="userStore.avatar" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      <span>{{ userStore.username }}</span>
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        <el-dropdown-item>Action 2</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { ElNotification } from 'element-plus'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 布局设置的仓库
const layoutSettingStore = useLayoutSettingStore()
// 用户的仓库
const userStore = useUserStore()
// $router
const $router = useRouter()
// $route
const $route = useRoute()
// 颜色选择器
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// 控制暗黑模式的开关
const darkSwitch = ref<boolean>()
// 点击刷新状态
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
// 点击全屏状态
const fullScreen = () => {
  // 全屏状态
  console.log(document.fullscreenElement)
  const isFull = document.fullscreenElement
  if (isFull) {
    // 只能使用dom提供的方法退出和进入全屏
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}
// 退出登录
const logout = async () => {
  await useUserStore()
    .userLogout()
    .then(() => {
      ElNotification({
        type: 'success',
        message: '退出登录成功',
      })
      $router.push({
        name: 'Login',
        query: { redirect: $route.path },
      })
    })
    .catch((err) => {
      ElNotification({
        type: 'error',
        message: '退出失败!!' + err,
      })
    })
}
// 暗黑模式切换
const changeDark = () => {
  const html = document.documentElement
  // 判断根节点是否有dark类名
  darkSwitch.value ? (html.className = 'dark') : (html.className = '')
}
// 主题颜色切换
const colorChange = () => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<style scoped lang="scss">
.el-dropdown {
  margin: 10px;
}
.el-avatar {
  margin-left: 10px;
}
</style>
