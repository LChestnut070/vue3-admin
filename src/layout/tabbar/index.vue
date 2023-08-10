<template>
  <div class="tabbar">
    <!-- 左侧 -->
    <div class="tabbar_left">
      <BreadCrumb></BreadCrumb>
    </div>
    <!-- 右侧 -->
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>
<script setup lang="ts">
import BreadCrumb from '@/layout/tabbar/breadcrumb/index.vue'
import Setting from '@/layout/tabbar/setting/index.vue'
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  // border-bottom: 1px solid #4a4a4a;
  // background: linear-gradient(to right, #ccc, #e4d4d4, #bbbbbb);
  .tabbar_left {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
