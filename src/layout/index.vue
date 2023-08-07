<template>
  <div class="layout_container">
    <!-- 侧边栏 -->
    <div class="layout_slider" :class="{ fold: layoutSettingStore.fold }">
      <Logo></Logo>
      <el-scrollbar class="scrollbar">
        <el-menu
          :collapse="layoutSettingStore.fold"
          background-color="#001529"
          text-color="white"
          active-text-color="#ff8585"
          :default-active="useRoute().path"
        >
          <Menu :menuList="userStore"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 顶栏 -->
    <div class="layout_tabbar" :class="{ fold: layoutSettingStore.fold }">
      <TabBar></TabBar>
    </div>

    <!-- 主要区域 -->
    <div class="layout_main" :class="{ fold: layoutSettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/layout/logo/index.vue'
import Menu from '@/layout/menu/index.vue'
import useUserStore from '@/store/modules/user'
import { useRoute } from 'vue-router'
import Main from '@/layout/main/index.vue'
import TabBar from '@/layout/tabbar/index.vue'
import useLayoutSettingStore from '@/store/modules/setting'

// 获取全部路由以渲染侧边menu
const userStore = useUserStore().menuRoutes
// 获取侧边栏折叠收齐状态
const layoutSettingStore = useLayoutSettingStore()
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100%;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: calc(100% - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
    &.fold {
      width: $base-menu-min-width;
    }
  }
  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    transition: all 0.3s;
    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
  .layout_main {
    top: $base-tabbar-height;
    position: absolute;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: calc(100% - $base-tabbar-height);
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
