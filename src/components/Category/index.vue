<template>
  <el-card :body-style="{ padding: '20px' }">
    <el-form :inline="true">
      <!-- 一级分类 -->
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene === 1 ? true : false"
          placeholder="请选择"
          v-model="categoryStore.cate1Id"
          @change="cate1HandleChange"
        >
          <el-option
            v-for="c1 in categoryStore.cate1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <!-- 二级分类 -->
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene === 1 ? true : false"
          placeholder="请选择"
          v-model="categoryStore.cate2Id"
          @change="cate2HandleChange"
        >
          <el-option
            v-for="c2 in categoryStore.cate2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>
      <!-- 三级分类 -->
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene === 1 ? true : false"
          placeholder="请选择"
          v-model="categoryStore.cate3Id"
        >
          <el-option
            v-for="c3 in categoryStore.cate3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, defineProps } from 'vue'
import useCategoryStore from '@/store/modules/category'

defineProps(['scene'])
const categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.getCate1List()
})

// 一级分类选择器触发
const cate1HandleChange = () => {
  // 清空cate1id、cate2id和c3列表
  categoryStore.cate2Id = ''
  categoryStore.cate3Id = ''
  categoryStore.cate3List = []
  categoryStore.getCate2List()
}

// 二级分类选择器触发
const cate2HandleChange = () => {
  // 清空cate3id
  categoryStore.cate3Id = ''
  categoryStore.getCate3List()
}
</script>
<script lang="ts"></script>
<style scoped></style>
