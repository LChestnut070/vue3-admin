<template>
  <!-- 刷新 -->
  <el-button icon="Refresh" circle @click="updateRefresh" />
  <!-- 全屏 -->
  <el-button icon="FullScreen" circle @click="fullScreen" />
  <!-- 设置 -->
  <el-button icon="Setting" circle />
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
import { useRoute, useRouter } from 'vue-router'

const layoutSettingStore = useLayoutSettingStore()
const userStore = useUserStore()
const $router = useRouter()
const $route = useRoute()
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
</script>

<style scoped lang="scss">
.el-dropdown {
  margin: 10px;
}
.el-avatar {
  margin-left: 10px;
}
</style>
