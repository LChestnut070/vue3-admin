<template>
  <el-form label-width="100">
    <!-- spu名称 -->
    <el-form-item label="SPU名称">
      <el-input
        v-model="spuFormParams.spuName"
        placeholder="请输入SPU名称"
      ></el-input>
    </el-form-item>
    <!-- spu品牌 -->
    <el-form-item label="SPU品牌">
      <el-select placeholder="请选择" v-model="spuFormParams.tmId">
        <el-option
          :value="item.id"
          :label="item.tmName"
          v-for="item in spuTrademarkList"
          :key="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <!-- spu描述 -->
    <el-form-item label="SPU描述">
      <el-input
        :rows="4"
        v-model="spuFormParams.description"
        type="textarea"
        placeholder="请输入SPU描述"
      ></el-input>
    </el-form-item>
    <!-- spu照片 -->
    <el-form-item label="SPU照片">
      <el-upload
        v-model:file-list="spuImgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :before-upload="handleBeforeUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="priview image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <!-- spu销售属性 -->
    <el-form-item label="SPU销售属性">
      <!-- 选择需要填写的销售属性 -->
      <el-select
        :placeholder="
          unSelectSaleAttr.length !== 0
            ? `还有${unSelectSaleAttr.length}个未选择`
            : '无'
        "
        v-model="readySaleAttrIdAndName"
        style="margin-right: 20px"
      >
        <el-option
          :label="item.name"
          :value="`${item.id}:${item.name}`"
          v-for="item in unSelectSaleAttr"
          :key="item.id"
        ></el-option>
      </el-select>
      <!-- 添加销售属性 -->
      <el-button
        type="primary"
        icon="plus"
        @click="addSaleAttr"
        :disabled="readySaleAttrIdAndName ? false : true"
      >
        添加属性值
      </el-button>
      <!-- 销售属性表格 -->
      <el-table border style="margin-top: 20px" :data="spuSaleAttrList">
        <!-- 序号 -->
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80"
        ></el-table-column>
        <!-- 销售属性名称 -->
        <el-table-column
          label="销售属性名称"
          prop="saleAttrName"
          width="150"
        ></el-table-column>
        <!-- 销售属性值 -->
        <el-table-column label="销售属性值">
          <template #default="{ row }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="item.id"
              closable
              style="margin-right: 10px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag === true"
              v-model="row.saleAttrValue"
              @blur="toLook(row)"
              size="small"
              style="width: 100px"
            ></el-input>

            <el-button
              type="success"
              icon="plus"
              size="small"
              v-else
              @click="toEdit(row)"
            ></el-button>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="80">
          <template #default="{ $index }">
            <el-button
              type="danger"
              icon="delete"
              @click="spuSaleAttrList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 保存取消 -->
    <el-form-item>
      <el-button
        type="primary"
        @click="confirm"
        :disabled="spuSaleAttrList.length > 0 ? false : true"
      >
        保存
      </el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  spu_recordsObj,
  spuTrademark_res,
  spuImageList_res,
  spuSaleAttrList_res,
  spuAllSaleAttrList_res,
  spuTrademark_obj,
  spuImageList_obj,
  spuSaleAttrList_obj,
  spuAllSaleAttrList_obj,
} from '@/api/product/spu/type'
import {
  reqGetSpuAllSaleAttrList,
  reqGetSpuTrademarkList,
  reqGetSpuImgList,
  reqGetSpuSaleAttrList,
} from '@/api/product/spu'
import { ElMessage } from 'element-plus'
import { reqAddOrUpdateSpu } from '@/api/product/spu/index'

// 需要向父组件传递的事件参数
const $emit = defineEmits(['changeScene'])
// 预览图片的地址
const dialogImageUrl = ref<string>('')
// 控制照片预览的dialog显示与隐藏
const dialogVisible = ref<boolean>(false)
// *****spu发送请求的数据格式
const spuFormParams = ref<spu_recordsObj>({
  // 三级分类id
  category3Id: '',
  // 描述
  description: '',
  // 照片墙数组
  spuImageList: [],
  // spu名称
  spuName: '',
  // 销售属性列表数组
  spuSaleAttrList: [],
  // spu品牌id
  tmId: '',
})
// 存储spu的品牌列表
const spuTrademarkList = ref<spuTrademark_obj[]>([])
// 存储spu的图片列表
const spuImgList = ref<spuImageList_obj[]>([])
// 存储spu的已有销售属性列表
const spuSaleAttrList = ref<spuSaleAttrList_obj[]>([])
// 存储spu的全部销售属性列表
const spuAllSaleAttrList = ref<spuAllSaleAttrList_obj[]>([])
// 收集准备添加的销售属性id与name
const readySaleAttrIdAndName = ref<string>('')

// computed:计算还未选择的属性
const unSelectSaleAttr = computed(() => {
  // // filter会筛选出值为true的,当已有属性不与当前的全部属性相等则会返回true(代表没有已有属性与全部属性重复),从而筛选出还未选择的值
  // return spuAllSaleAttrList.value.filter((item1) => {
  //   return spuSaleAttrList.value.every((item2) => {
  //     return item1.name !== item2.saleAttrName
  //   })
  // })
  return spuAllSaleAttrList.value.filter((item1) => {
    // filter会筛选出值为true的,如果没有重复的则返回true,代表还未选择
    return spuSaleAttrList.value.every((item2) => {
      if (item2.saleAttrName !== item1.name) {
        return true
      }
    })
  })
})
//
// -----初始化spu表单数据(修改SPU)
const initSpuForm_update = async (spuinfo: spu_recordsObj) => {
  // 将已有spu信息存储到要发请求的对象中
  spuFormParams.value = spuinfo
  // 获取spu的品牌列表
  const trade_res: spuTrademark_res = await reqGetSpuTrademarkList()
  if (trade_res.code === 200) {
    spuTrademarkList.value = trade_res.data
  }
  // 获取spu的图片列表
  const img_res: spuImageList_res = await reqGetSpuImgList(spuinfo.id as number)
  if (img_res.code === 200) {
    spuImgList.value = img_res.data.map((item) => {
      // 需要将数据变成elementplus能识别的才会渲染
      return {
        name: item.imgName,
        url: item.imgUrl,
      }
    })
  }
  // 获取spu的已有销售属性列表
  const saleattr_res: spuSaleAttrList_res = await reqGetSpuSaleAttrList(
    spuinfo.id as number,
  )
  if (saleattr_res.code === 200) {
    spuSaleAttrList.value = saleattr_res.data
  }
  // 获取spu的全部销售属性列表
  const allsaleattr_res: spuAllSaleAttrList_res =
    await reqGetSpuAllSaleAttrList()
  if (allsaleattr_res.code === 200) {
    spuAllSaleAttrList.value = allsaleattr_res.data
  }
}
// -----初始化spu表单数据(添加SPU)
const initSpuForm_add = async (cate3Id: number) => {
  // 清空常规数据
  Object.assign(spuFormParams.value, {
    category3Id: '',
    description: '',
    spuImageList: [],
    spuName: '',
    spuSaleAttrList: [],
    tmId: '',
  })
  // 清空照片墙数据
  spuImgList.value = []
  // 清空销售属性
  spuSaleAttrList.value = []
  // 清空id
  delete spuFormParams.value.id
  // 清空准备添加的销售属性id与name
  readySaleAttrIdAndName.value = ''
  // 赋值三级分类id
  spuFormParams.value.category3Id = cate3Id
  // 获取spu的品牌列表
  const trade_res: spuTrademark_res = await reqGetSpuTrademarkList()
  if (trade_res.code === 200) {
    spuTrademarkList.value = trade_res.data
  }
  // 获取spu的全部销售属性列表
  const allsaleattr_res: spuAllSaleAttrList_res =
    await reqGetSpuAllSaleAttrList()
  if (allsaleattr_res.code === 200) {
    spuAllSaleAttrList.value = allsaleattr_res.data
  }
}
// 上传照片之前事件
const handleBeforeUpload = (file: any) => {
  if (
    file.type === 'image/png' ||
    file.type === 'image/jpg' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/gif'
  ) {
    if (file.size / 1024 / 1024 > 4) {
      ElMessage.error('照片的大小只能小于4MB!')
      return false
    }
    return true
  } else {
    ElMessage.error('照片格式只能为JPG/JPEG/PNG/GIF!')
    return false
  }
}
// 查看照片事件
const handlePictureCardPreview = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
// 添加销售属性
const addSaleAttr = () => {
  // 将拆分后的数组解构
  const [baseSaleAttrId, saleAttrName] = readySaleAttrIdAndName.value.split(':')
  const newSaleAttr: spuSaleAttrList_obj = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 向表格添加新的销售属性
  spuSaleAttrList.value.push(newSaleAttr)
  // 清空准备添加的销售属性
  readySaleAttrIdAndName.value = ''
}
// 添加销售属性值(进入编辑模式)
const toEdit = (row: spuSaleAttrList_obj) => {
  row.flag = true
  row.saleAttrValue = ''
}
// 完成属性值编辑(进入查看模式)
const toLook = (row: spuSaleAttrList_obj) => {
  // 如果输入的属性值为空或第一个字符是空格
  if ((row.saleAttrValue as string)[0] === ' ' || !row.saleAttrValue) {
    ElMessage.error('输入的值不能为空且开头不能为空格!')
    row.flag = false
    return
  }
  // 如果输入的属性值重复
  const repeat = row.spuSaleAttrValueList.some((item) => {
    return item.saleAttrValueName === row.saleAttrValue
  })
  if (repeat === true) {
    ElMessage.error('输入的属性值与已有值重复!')
    row.flag = false
    return
  }
  // 将新增的属性值name和id push到spuSaleAttrValueList
  row.spuSaleAttrValueList.push({
    baseSaleAttrId: row.baseSaleAttrId as number,
    saleAttrValueName: row.saleAttrValue as string,
  })
  row.flag = false
}
// 取消
const cancel = () => {
  $emit('changeScene', {
    Scene: 0,
    flag: 'delete',
  })
}
// 保存
const confirm = async () => {
  // 整理照片参数
  spuFormParams.value.spuImageList = spuImgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: item.response ? item.response.data : item.url,
    }
  })
  // 整理销售属性参数
  spuFormParams.value.spuSaleAttrList = spuSaleAttrList.value
  // 发送请求
  const res = await reqAddOrUpdateSpu(spuFormParams.value)
  if (res.code === 200) {
    ElMessage.success(spuFormParams.value.id ? '修改成功!' : '添加成功!')
    $emit('changeScene', {
      Scene: 0,
      flag: spuFormParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage.error(spuFormParams.value.id ? '修改失败!' : '添加失败!')
  }
}

// 对外暴露方法
defineExpose({ initSpuForm_update, initSpuForm_add })
</script>

<style scoped></style>
