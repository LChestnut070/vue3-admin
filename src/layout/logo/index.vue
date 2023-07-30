<template>
  <div class="logo" v-if="setting.logoShow">
    <img :src="setting.logo" alt="" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting.ts'
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  padding: 0 10px;
  img {
    height: 40px;
    width: 40px;
  }
  p {
    margin-left: 10px;
    color: white;
    font-size: $base-menu-logo-fontsize;
  }
}
</style>
