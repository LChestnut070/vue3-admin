<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin-top: 20px">
      <!-- 表格展示区域 -->
      <div v-show="scene === 0">
        <!-- 添加spu -->
        <el-button
          type="primary"
          icon="plus"
          @click="addSpuBtn"
          :disabled="!cateStore.cate3Id"
        >
          添加SPU
        </el-button>

        <el-table border style="margin-top: 20px" :data="spuList">
          <!-- 序号 -->
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80"
          ></el-table-column>
          <!-- spu名称 -->
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <!-- spu描述 -->
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="300">
            <template #default="{ row }">
              <!-- 添加SPU -->
              <el-button
                type="primary"
                title="添加SKU"
                icon="plus"
                @click="addSkuBtn(row)"
              ></el-button>
              <!-- 修改SPU -->
              <el-button
                type="info"
                title="修改SPU"
                icon="edit"
                @click="updateSpuBtn(row)"
              ></el-button>
              <!-- 查看SKU列表 -->
              <el-button
                type="warning"
                title="查看SKU列表"
                icon="view"
                @click="showSkuListBtn(row)"
              ></el-button>
              <!-- 删除SPU -->
              <el-popconfirm
                :title="`确定要删除${row.spuName}吗?`"
                @confirm="deleteSkuBtn(row)"
                width="250"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    title="删除SPU"
                    icon="delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          style="margin-top: 20px"
          :total="total"
          v-model:current-page="pageNo"
          v-model:page-size="limit"
          :page-sizes="[3, 5, 10, 20]"
          layout="prev, pager, next, jumper, ->, total,sizes"
        ></el-pagination>
      </div>
      <!-- 添加|修改spu -->
      <SpuForm
        v-show="scene === 1"
        @changeScene="changeScene"
        ref="spuRef"
      ></SpuForm>
      <!-- 添加Sku -->
      <SkuForm
        v-show="scene === 2"
        @changeScenes="changeScenes"
        ref="skuRef"
      ></SkuForm>
    </el-card>
    <!-- 展示sku的dialog -->
    <el-dialog v-model="dialogTableVisible" title="SKU列表">
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column prop="skuName" label="SKU名字" />
        <el-table-column prop="price" label="SKU价格" width="200" />
        <el-table-column prop="weight" label="SKU重量" width="150" />
        <el-table-column label="SKU图片" width="200">
          <template #default="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import {
  reqGetSpuList,
  reqGetSkuList,
  reqDeleteSpu,
} from '@/api/product/spu/index'
import useCategoryStore from '@/store/modules/category'
import type {
  spu_recordsArr,
  spu_recordsObj,
  skuList_res,
  sku_obj,
} from '@/api/product/spu/type'
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'
import { ElMessage } from 'element-plus'

// 控制表格与表单显示
const scene = ref<number>(0)
// 控制对话框显示与隐藏
const dialogTableVisible = ref<boolean>(false)
// 当前页
const pageNo = ref<number>(1)
// 每页数量
const limit = ref<number>(5)
// 总数目
const total = ref<number>(0)
// 分类的仓库
const cateStore = useCategoryStore()
// spu列表
const spuList = ref<spu_recordsArr>([])
// sku列表
const skuList = ref<sku_obj[]>([])
// 控制对话框表格的加载效果
const loading = ref<boolean>(true)
// spu组件的vc实例
const spuRef = ref<any>()
// sku组件的vc实例
const skuRef = ref<any>()

// 跳转到其他页时清空仓库数据
onUnmounted(() => {
  cateStore.$reset()
})

// 监听三级分类id
watch(
  () => cateStore.cate3Id,
  () => {
    spuList.value = []
    if (cateStore.cate3Id) getSpuList()
  },
)
// 监听当前页数
watch(
  () => pageNo.value,
  () => {
    getSpuList()
  },
)
// 监听每页的数量
watch(
  () => limit.value,
  () => {
    pageNo.value = 1
  },
)

// -----获取spu数组
const getSpuList = async () => {
  if (!cateStore.cate3Id) return
  const res = await reqGetSpuList(pageNo.value, limit.value, cateStore.cate3Id)

  if (res.code === 200) {
    spuList.value = res.data.records
    total.value = res.data.total
  }
}
// 添加SPU的按钮
const addSpuBtn = () => {
  scene.value = 1
  spuRef.value.initSpuForm_add(cateStore.cate3Id)
}
// 添加SKU的按钮
const addSkuBtn = (row: spu_recordsObj) => {
  scene.value = 2
  skuRef.value.initSkuForm(
    cateStore.cate1Id,
    cateStore.cate2Id,
    cateStore.cate3Id,
    row,
  )
}
// 修改SPU的按钮
const updateSpuBtn = (row: spu_recordsObj) => {
  scene.value = 1
  // 通过ref调用spu组件内部的方法进行传参
  spuRef.value.initSpuForm_update(row)
}
// 查看SKU列表的按钮
const showSkuListBtn = async (row: spu_recordsObj) => {
  // 清空sku列表
  skuList.value = []
  dialogTableVisible.value = true
  loading.value = true
  const res: skuList_res = await reqGetSkuList(row.id as number)
  if (res.code === 200) {
    skuList.value = res.data
    loading.value = false
  }
}
// 删除SPU的按钮
const deleteSkuBtn = async (row: spu_recordsObj) => {
  const res: any = await reqDeleteSpu(row.id as number)
  if (res.code === 200) {
    ElMessage.success('删除SPU成功!')
    if (spuList.value.length > 1 || pageNo.value === 1) {
      getSpuList()
    } else {
      pageNo.value -= 1
    }
  } else {
    ElMessage.error('删除SPU失败!')
  }
}
// 改变场景(由spu组件传入)
const changeScene = (obj: any) => {
  scene.value = obj.Scene
  if (obj.flag === 'add') {
    pageNo.value = 1
  } else {
    getSpuList()
  }
}
// 改变场景(由sku组件传入)
const changeScenes = (num: number) => {
  scene.value = num
  getSpuList()
}
</script>

<style scoped></style>
