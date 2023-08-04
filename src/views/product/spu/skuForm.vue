<template>
  <el-form label-width="80">
    <!-- SKU名称 -->
    <el-form-item label="SKU名称">
      <el-input
        placeholder="请输入SKU名称"
        v-model="skuFormParams.skuName"
      ></el-input>
    </el-form-item>
    <!-- 价格(元) -->
    <el-form-item label="价格(元)">
      <el-input
        placeholder="请输入价格"
        type="number"
        v-model="skuFormParams.price"
      ></el-input>
    </el-form-item>
    <!-- 重量(g) -->
    <el-form-item label="重量(g)">
      <el-input
        placeholder="请输入重量"
        type="number"
        v-model="skuFormParams.weight"
      ></el-input>
    </el-form-item>
    <!-- SKU描述 -->
    <el-form-item label="SKU描述">
      <el-input
        placeholder="请输入SKU描述"
        type="textarea"
        rows="4"
        v-model="skuFormParams.skuDesc"
      ></el-input>
    </el-form-item>
    <!-- 平台属性 -->
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item
          :label="item.attrName"
          v-for="item in skuPlatformAttrList"
          :key="item.id"
          style="margin-bottom: 20px"
        >
          <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
            <el-option
              :label="value.valueName"
              :value="`${value.id}:${value.attrId}`"
              v-for="value in item.attrValueList"
              :key="value.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!-- 销售属性 -->
    <el-form-item label="销售属性">
      <el-form>
        <el-form-item
          :label="item.saleAttrName"
          v-for="item in skuSaleAttrList"
          :key="item.id"
        >
          <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
            <el-option
              :label="value.saleAttrValueName"
              :value="`${value.id}:${value.baseSaleAttrId}`"
              v-for="value in item.spuSaleAttrValueList"
              :key="value.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!-- 商品图片 -->
    <el-form-item label="商品图片">
      <el-table border :data="skuImgList" ref="tableRef">
        <!-- 复选框选择 -->
        <el-table-column
          width="80"
          align="center"
          type="selection"
        ></el-table-column>
        <!-- 图片 -->
        <el-table-column label="图片">
          <template #default="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 120px; height: 120px" />
          </template>
        </el-table-column>
        <!-- 名称 -->
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-tag type="success" size="large" v-if="row.isDefalut">
              已设为默认
            </el-tag>
            <el-button type="warning" @click="setDefaultImg(row)" v-else>
              设为默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 保存取消 -->
    <el-form-item>
      <el-button type="primary" @click="confirm">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reqGetAttrinfoList } from '@/api/product/attr'
import { attrRes, attr_data } from '@/api/product/attr/type'
import {
  reqAddSku,
  reqGetSpuImgList,
  reqGetSpuSaleAttrList,
} from '@/api/product/spu'
import {
  sku_obj,
  spuImageList_obj,
  spuImageList_res,
  spuSaleAttrList_obj,
  spuSaleAttrList_res,
  spu_recordsObj,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

// 需要向父组件传递的事件参数
const $emit = defineEmits(['changeScenes'])
// *****发送请求需要的参数
const skuFormParams = reactive<sku_obj>({
  category3Id: 0,
  price: '',
  skuDefaultImg: '',
  skuDesc: '',
  spuId: '',
  tmId: '',
  weight: '',
  skuName: '',
  // sku平台属性
  skuAttrValueList: [],
  // sku销售属性
  skuSaleAttrValueList: [],
})
// 存储平台属性列表
const skuPlatformAttrList = ref<attr_data[]>([])
// 存储销售属性列表
const skuSaleAttrList = ref<spuSaleAttrList_obj[]>([])
// 存储sku的图片列表
const skuImgList = ref<spuImageList_obj[]>([])
// 获取sku的图片表格实例
const tableRef = ref<any>()

// -----初始化sku表单数据
const initSkuForm = async (
  cate1Id: number | string,
  cate2Id: number | string,
  cate3Id: number | string,
  spuinfo: spu_recordsObj,
) => {
  skuFormParams.category3Id = cate3Id
  skuFormParams.spuId = spuinfo.id as number
  skuFormParams.tmId = spuinfo.tmId
  // 获取平台属性列表
  const attr_res: attrRes = await reqGetAttrinfoList(cate1Id, cate2Id, cate3Id)
  if (attr_res.code === 200) {
    skuPlatformAttrList.value = attr_res.data
  }
  // 获取销售属性列表
  const saleattr_res: spuSaleAttrList_res = await reqGetSpuSaleAttrList(
    spuinfo.id as number,
  )
  if (saleattr_res.code === 200) {
    skuSaleAttrList.value = saleattr_res.data
  }
  // 获取照片列表
  const img_res: spuImageList_res = await reqGetSpuImgList(spuinfo.id as number)
  if (img_res.code === 200) {
    skuImgList.value = img_res.data
  }
}

// 设置默认图片
const setDefaultImg = (row: spuImageList_obj) => {
  console.log(row)

  // 排他操作
  skuImgList.value.forEach((item) => {
    item.isDefalut = false
    return tableRef.value.toggleRowSelection(item, false)
  }) // 也可实现
  // tableRef.value.clearSelection()
  row.isDefalut = true
  tableRef.value.toggleRowSelection(row, true)

  skuFormParams.skuDefaultImg = row.imgUrl as string
}

// 取消
const cancel = () => {
  $emit('changeScenes', 0)
}
// 保存
const confirm = async () => {
  // 整理平台属性
  const fixattr = skuPlatformAttrList.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      // 第一次prev为空数组,之后为上一次返回的prev值(回调函数返回的值)
      prev.push({
        attrId,
        valueId,
      })
    }
    // 需要return出push后的结果,以供下一次push使用
    return prev
  }, [])
  skuFormParams.skuAttrValueList = fixattr
  // 整理销售属性
  const saleattr = skuSaleAttrList.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [saleAttrId, saleAttrValueId] = next.attrIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })
    }
    return prev
  }, [])
  skuFormParams.skuSaleAttrValueList = saleattr
  const res = await reqAddSku(skuFormParams)
  if (res.code === 200) {
    ElMessage.success('添加SKU成功!')
    $emit('changeScenes', 0)
  } else {
    ElMessage.error('添加SKU失败!')
  }
}

// 对外暴露方法
defineExpose({ initSkuForm })
</script>

<style scoped></style>
