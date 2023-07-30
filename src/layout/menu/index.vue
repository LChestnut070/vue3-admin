<!-- eslint-disable vue/no-reserved-component-names -->
<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item :index="item.path" v-if="item.meta.show" @click="goRoute">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 只有一个子路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        v-if="item.children[0].meta.show"
        :index="item.children[0].path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 多个子路由 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menu-list="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps(['menuList'])
const $router = useRouter()
const goRoute = (vc: any) => {
  $router.push(vc.index)
}
</script>
<script lang="ts">
export default {
  // 注: 通过递归组件实现子路由多次渲染,当有多个子路由时,调用当前组件的if进行渲染
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Menu',
}
</script>
<style scoped lang="scss"></style>
