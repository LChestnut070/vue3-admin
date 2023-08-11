<template>
  <div class="box_404">
    <img src="../../assets/images/error_images/404.png" />
    <button @click="goHome">回到首页</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const $router = useRouter()
const goHome = () => {
  $router.push('/')
}
</script>

<style scoped lang="scss">
.box_404 {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%; /* 限制图片宽度不超过容器宽度 */
    height: auto; /* 让图片高度根据宽度等比例缩放 */
  }
}
</style>
