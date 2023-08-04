<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin-top: 20px">
      <!-- 表格展示区域 -->
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="plus"
          :disabled="cateStore.cate3Id ? false : true"
          @click="addAttrBtn"
        >
          添加平台属性
        </el-button>
        <el-table border style="margin-top: 20px" :data="attrList">
          <!-- 序号 -->
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
          ></el-table-column>
          <!-- 属性名称 -->
          <el-table-column
            label="属性名称"
            width="120"
            prop="attrName"
          ></el-table-column>
          <!-- 属性值名称 -->
          <el-table-column label="属性值名称">
            <template #default="{ row }">
              <el-tag
                v-for="item in row.attrValueList"
                :key="item.id"
                style="margin: 5px"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="130">
            <template #default="{ row }">
              <!-- 修改 -->
              <el-button
                type="warning"
                icon="edit"
                @click="updateAttrBtn(row)"
              ></el-button>
              <!-- 删除 -->
              <el-popconfirm
                :title="`确定要删除${row.attrName}吗?`"
                @confirm="deleteAttrBtn(row.id)"
              >
                <template #reference>
                  <el-button type="danger" icon="delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 表单填写区域 -->
      <div v-show="scene === 1">
        <el-form :inline="true">
          <!-- 属性名称 -->
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 添加属性值 -->
        <el-button
          icon="plus"
          type="primary"
          :disabled="attrParams.attrName[0] === ' ' || !attrParams.attrName"
          @click="addAttrValueBtn"
        >
          添加属性值
        </el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table
          border
          style="margin: 20px 0"
          :data="attrParams.attrValueList"
        >
          <!-- 序号 -->
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          ></el-table-column>
          <!-- 属性值名称 -->
          <el-table-column label="属性值名称">
            <template #default="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                @blur="toLook(row, $index)"
                v-if="row.flag"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template #default="{ $index }">
              <el-button
                type="danger"
                @click="attrParams.attrValueList.splice($index, 1)"
                icon="delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="attrParams.attrValueList.length === 0 ? true : false"
        >
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import {
  reqAddOrUpdateAttr,
  reqGetAttrinfoList,
  reqDeleteAttr,
} from '@/api/product/attr/index'
import { nextTick, onUnmounted, reactive, ref, watch } from 'vue'
import type { attrRes, attr_data, attrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'

// 分类仓库
const cateStore = useCategoryStore()
// attr列表
const attrList = ref<attr_data[]>([])
// 控制表格与表单显示
const scene = ref<number>(0)
// 新增|修改发请求所需要的参数
const attrParams = reactive<attr_data>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3,
})
// input数组,用于触发自动聚焦事件
const inputArr: any = ref([])

// 监听三级分类id
watch(
  () => cateStore.cate3Id,
  () => {
    // 重新选择一级二级分类时清空表格
    attrList.value = []
    // 防止重新选择一级二级分类发送错误请求
    if (!cateStore.cate3Id) return
    getAttrList()
  },
)

// 跳转到其他页时清空仓库数据
onUnmounted(() => {
  cateStore.$reset()
})

// -----获取attr数组
const getAttrList = async () => {
  const { cate1Id, cate2Id, cate3Id } = cateStore
  const res: attrRes = await reqGetAttrinfoList(cate1Id, cate2Id, cate3Id)
  if (res.code === 200) {
    attrList.value = res.data
  }
}
// 点击添加属性的按钮
const addAttrBtn = () => {
  scene.value = 1
  // 清空请求的数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: cateStore.cate3Id,
    categoryLevel: 3,
  })
  // 清空id
  delete attrParams.id
}
// 点击修改属性的按钮
const updateAttrBtn = (row: attr_data) => {
  scene.value = 1
  // 直接使用Object.assign(attrParams, row)为浅拷贝,哪怕不点击保存,row表格的数据也会变化
  // 利用JSON.stringify 将js对象序列化（JSON字符串），再使用JSON.parse来反序列化(还原)js对象
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 点击删除属性的按钮
const deleteAttrBtn = async (attrId: number) => {
  const res = await reqDeleteAttr(attrId)
  if (res.code === 200) {
    ElMessage.success('删除成功!')
    getAttrList()
  } else {
    ElMessage.error('删除失败!')
  }
}
// 取消
const cancel = () => {
  scene.value = 0
}
// 点击添加属性值的按钮
const addAttrValueBtn = () => {
  attrParams.attrValueList.push({
    valueName: '',
    // 控制编辑模式与查看模式的开关
    flag: true,
  })
  nextTick(() => {
    // 让表格最后一组自动聚焦
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
// 属性值输入框失去焦点事件
const toLook = (row: attrValue, index: number) => {
  // 如果输入的值为空或第一个字符为空格
  if (row.valueName[0] === ' ' || row.valueName === '') {
    // 清空无效数据
    attrParams.attrValueList.splice(index, 1)
    ElMessage.error('属性值不能为空且开头字符不能为空!')
    return
  }
  // 如果输入的值的最后一个字符为空格
  if (row.valueName[row.valueName.length - 1] === ' ') {
    // 清空无效数据
    attrParams.attrValueList.splice(index, 1)
    ElMessage.error('属性值结尾字符不能为空!')
    return
  }
  // 如果当前输入值与已有值重复
  const repeat = attrParams.attrValueList.find((item) => {
    // 当find查找数组到当前行时自动跳过当前行
    if (row != item) {
      return row.valueName === item.valueName
    }
  })
  if (repeat) {
    // 清空无效数据
    attrParams.attrValueList.splice(index, 1)
    ElMessage.error('输入的属性值与已有的属性值重复!')
    return
  }
  row.flag = false
}
// 属性值文本框点击事件
const toEdit = (row: attrValue, index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[index].focus()
  })
}
// 保存
const save = async () => {
  const res = await reqAddOrUpdateAttr(attrParams)
  if (res.code === 200) {
    scene.value = 0
    ElMessage.success(attrParams.id ? '修改成功!' : '添加成功!')
    getAttrList()
  } else {
    ElMessage.error(attrParams.id ? '修改失败!' : '添加失败!')
  }
}
</script>

<style scoped></style>
