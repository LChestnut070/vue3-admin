<template>
  <!-- 侧边栏展开按钮 -->
  <div @click="changeMenu">
    <el-icon size="18" class="fold_icon">
      <component :is="layoutSettingStore.fold ? 'Expand' : 'Fold'"></component>
    </el-icon>
  </div>

  <!-- 面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="item in $route.matched"
      :key="item.path"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon class="breadcrumb_icon">
        <component :is="item.meta.icon" v-if="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'

const $route = useRoute()
// 获取layout设置仓库
const layoutSettingStore = useLayoutSettingStore()

// 点击改变菜单宽度
const changeMenu = () => {
  layoutSettingStore.fold = !layoutSettingStore.fold
}
</script>

<style scoped lang="scss">
.fold_icon {
  margin: 17px;
  margin-right: 25px;
}
.breadcrumb_icon {
  margin-right: 2px;
  vertical-align: bottom;
}
</style>
