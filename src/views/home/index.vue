<template>
  <div>
    <el-card>
      <div class="user_box">
        <div class="user_box_left">
          <img :src="userStore.avatar" />
        </div>
        <div class="user_box_right">
          <span>中午好{{ userStore.username }}</span>
          <i>硅谷甄选运营</i>
        </div>
      </div>
    </el-card>
    <div class="bottom">
      <svg-icon name="welcome" width="600px" height="500px"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
</script>

<style scoped lang="scss">
.user_box {
  display: flex;
  .user_box_left {
    width: 150px;
    height: 150px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .user_box_right {
    display: flex;
    margin-left: 20px;
    flex-direction: column;
    justify-content: space-around;
    span {
      font-size: 25px;
    }
    i {
      font-style: italic;
      color: cadetblue;
      font-weight: 200;
    }
  }
}
.bottom {
  display: flex;
  justify-content: center;
}
</style>
