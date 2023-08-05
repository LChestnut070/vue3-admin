<template>
  <div>
    <el-table border :data="skuInfoList" ref="tableRef" v-loading="loading">
      <!-- 序号 -->
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80"
      ></el-table-column>
      <!-- 名称 -->
      <el-table-column
        label="名称"
        prop="skuName"
        min-width="250"
      ></el-table-column>
      <!-- 描述 -->
      <el-table-column
        label="描述"
        prop="skuDesc"
        min-width="300"
      ></el-table-column>
      <!-- 默认图片 -->
      <el-table-column label="默认图片" width="130">
        <template #default="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <!-- 重量 -->
      <el-table-column
        label="重量(g)"
        prop="weight"
        width="80"
      ></el-table-column>
      <!-- 价格 -->
      <el-table-column
        label="价格(元)"
        prop="price"
        width="80"
      ></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" fixed="right" width="250">
        <template #default="{ row }">
          <!-- 点击进行上架与下架 -->
          <el-button
            :type="row.isSale === 1 ? 'success' : 'info'"
            :icon="row.isSale === 1 ? 'bottom' : 'top'"
            size="small"
            v-if="true"
            @click="updateSaleState(row)"
            :title="
              row.isSale === 1
                ? '点击进行下架,当前已上架'
                : '点击进行上架,当前已下架'
            "
          ></el-button>
          <!-- 修改商品 -->
          <el-button
            type="primary"
            icon="edit"
            size="small"
            title="修改Sku信息"
            @click="updateSkuinfo"
          ></el-button>
          <!-- 展示商品信息 -->
          <el-button
            type="warning"
            icon="InfoFilled"
            size="small"
            @click="showSkuInfo(row)"
          ></el-button>
          <!-- 删除商品 -->
          <el-popconfirm
            :title="`确定要删除${row.skuName}吗?`"
            @confirm="deleteSku(row)"
          >
            <template #reference>
              <el-button type="danger" icon="delete" size="small"></el-button>
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

    <!-- 抽屉 -->
    <el-drawer
      v-model="drawer"
      title="查看商品详情"
      size="50%"
      style="padding: 20px"
    >
      <!-- 名称 -->
      <el-row style="margin-bottom: 20px">
        <el-col :span="8">
          <div>名称</div>
        </el-col>
        <el-col :span="16" style="line-height: 20px">
          {{ drawerSkuinfo.skuName }}
        </el-col>
      </el-row>
      <!-- 描述 -->
      <el-row style="margin-bottom: 20px">
        <el-col :span="8">
          <div>描述</div>
        </el-col>
        <el-col :span="16" style="line-height: 20px">
          {{ drawerSkuinfo.skuDesc }}
        </el-col>
      </el-row>
      <!-- 价格 -->
      <el-row style="margin-bottom: 20px">
        <el-col :span="8">
          <div>价格</div>
        </el-col>
        <el-col :span="16">{{ drawerSkuinfo.price }}</el-col>
      </el-row>
      <!-- 平台属性 -->
      <el-row style="margin-bottom: 20px">
        <el-col :span="8">
          <div>平台属性</div>
        </el-col>
        <el-col :span="16">
          <el-tag
            v-for="item in drawerSkuinfo.skuAttrValueList"
            :key="item.id"
            style="margin: 0 5px 5px 0"
          >
            {{ item.attrName }}:&nbsp;{{ item.valueName }}
          </el-tag>
        </el-col>
      </el-row>
      <!-- 销售属性 -->
      <el-row style="margin-bottom: 20px">
        <el-col :span="8">
          <div>销售属性</div>
        </el-col>
        <el-col :span="16">
          <el-tag
            v-for="item in drawerSkuinfo.skuSaleAttrValueList"
            :key="item.id"
            style="margin: 0 5px 5px 0"
          >
            {{ item.saleAttrName }} :&nbsp; {{ item.saleAttrValueName }}
          </el-tag>
        </el-col>
      </el-row>
      <!-- 商品图片 -->
      <el-row style="margin-bottom: 20px">
        <el-col :span="8">
          <div>商品图片</div>
        </el-col>
        <el-col :span="16">
          <el-carousel
            trigger="click"
            height="170px"
            type="card"
            indicator-position="outside"
          >
            <el-carousel-item
              v-for="item in drawerSkuinfo.skuImageList"
              :key="item.id"
            >
              <img
                :src="item.imgUrl"
                alt=""
                style="width: 100%; height: 100%"
              />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  reqGetSkuInfoList,
  reqOnSale,
  reqCancelSale,
  reqGetSkuInfo,
  reqDeleteSku,
} from '@/api/product/sku/index'
import { sku_res, skuRecords_obj, skuinfo_res } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
// 当前页
const pageNo = ref<number>(1)
// 每页数量
const limit = ref<number>(10)
// 总数目
const total = ref<number>(0)
// sku信息列表
const skuInfoList = ref<skuRecords_obj[]>([])
// tabel表格的加载效果
const loading = ref(false)
// 控制抽屉的显示与隐藏
const drawer = ref<boolean>()
// 需要在抽屉展示的商品数据
const drawerSkuinfo = ref<skuRecords_obj>({
  id: 0,
  isSale: 0,
  category3Id: '',
  price: '',
  skuDefaultImg: '',
  skuDesc: '',
  spuId: '',
  tmId: '',
  weight: '',
  skuName: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuImageList: [],
})
// 表格的ref实例对象
const tableRef = ref<any>()
onMounted(() => {
  getSkuInfoList()
})

// 监听当前页数的变化
watch(
  () => pageNo.value,
  () => {
    getSkuInfoList()
  },
)
// 监听每页的数量
watch(
  () => limit.value,
  () => {
    pageNo.value === 1 ? getSkuInfoList() : (pageNo.value = 1)
  },
)

// 获取sku信息列表
const getSkuInfoList = async () => {
  const res: sku_res = await reqGetSkuInfoList(pageNo.value, limit.value)
  if (res.code === 200) {
    total.value = res.data.total
    skuInfoList.value = res.data.records
  }
  tableRef.value
}
// 改变商品状态(上架与下架)
const updateSaleState = async (row: skuRecords_obj) => {
  loading.value = true
  // 如果商品为已下架状态,进行上架操作
  if (row.isSale === 0) {
    const onres: any = await reqOnSale(row.id)
    if (onres.code === 200) {
      ElMessage.success('商品上架成功')
      getSkuInfoList().then(() => (loading.value = false))
    } else {
      ElMessage.error('商品上架失败')
      loading.value = false
    }
  } else {
    // 如果商品为已上架状态,进行下架操作
    const cancelres = await reqCancelSale(row.id)
    if (cancelres.code === 200) {
      ElMessage.success('商品下架成功')
      getSkuInfoList().then(() => (loading.value = false))
    } else {
      ElMessage.error('商品下架失败')
      loading.value = false
    }
  }
}
// 更新商品信息
const updateSkuinfo = () => {
  ElMessage.info('该功能还在开发中!')
}
// 展示商品信息
const showSkuInfo = async (row: skuRecords_obj) => {
  drawer.value = true
  drawerSkuinfo.value.skuName = row.skuName
  drawerSkuinfo.value.price = row.price as string
  drawerSkuinfo.value.skuDesc = row.skuDesc
  const res: skuinfo_res = await reqGetSkuInfo(row.id)
  if (res.code === 200) {
    drawerSkuinfo.value = res.data
  }
}
// 删除商品
const deleteSku = async (row: skuRecords_obj) => {
  loading.value = true
  const res = await reqDeleteSku(row.id)
  if (res.code === 200) {
    ElMessage.success('删除商品成功!')
    loading.value = false
    if (skuInfoList.value.length > 1 || pageNo.value === 1) {
      getSkuInfoList()
    } else {
      pageNo.value = 1
    }
  } else {
    loading.value = false
    ElMessage.error('删除商品失败!')
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
