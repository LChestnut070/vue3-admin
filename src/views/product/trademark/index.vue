<template>
  <el-card class="box-card">
    <!-- 添加品牌按钮 -->
    <el-button type="primary" icon="plus" @click="addTrademark">
      添加品牌
    </el-button>

    <!-- 表格 -->
    <el-table border :data="trademarkList" style="margin: 20px 0">
      <!-- 序号 -->
      <el-table-column
        label="序号"
        width="80"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <!-- 品牌logo -->
      <el-table-column label="品牌LOGO">
        <template #default="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <!-- 品牌操作 -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" icon="edit" @click="updateTrademark(row)">
            编辑
          </el-button>
          <el-popconfirm
            :title="`确定要删除${row.tmName}吗?`"
            icon="delete"
            width="250"
            @confirm="confirmDelete(row.id)"
          >
            <template #reference>
              <el-button type="warning" icon="delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 10, 20]"
      layout=" prev, pager, next, jumper,->,total, sizes,"
      :total="total"
    />

    <!-- 对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="dialogForm.id ? '修改品牌' : '添加品牌'"
    >
      <!-- 表单区域 -->
      <el-form
        :model="dialogForm"
        style="width: 90%; margin: 0 auto"
        :rules="rules"
        ref="formRef"
      >
        <!-- 品牌名称 -->
        <el-form-item label="品牌名称" label-width="100" prop="tmName">
          <el-input v-model="dialogForm.tmName" autocomplete="off" />
        </el-form-item>
        <!-- 品牌LOGO -->
        <el-form-item label="品牌LOGO" label-width="100" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            v-loading="loading"
          >
            <img
              v-if="dialogForm.logoUrl"
              :src="dialogForm.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 取消确认 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import {
  reqGetTrademarkList,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark/index.ts'
import type {
  records,
  Records,
  trademarkRes,
} from '@/api/product/trademark/type'
import { UploadProps, ElMessage } from 'element-plus'

// 当前页
const pageNo = ref<number>(1)
// 每页数量
const limit = ref<number>(5)
// 总数
const total = ref<number>(0)
// 品牌列表
const trademarkList = ref<Records>([])
// 控制对话框现实与隐藏
const dialogFormVisible = ref(false)
// 对话框表单内容
const dialogForm = reactive<records>({
  tmName: '',
  logoUrl: '',
})
// 定义表单ref对象
const formRef = ref()
// 表单图片上传时加载效果开关
const loading = ref<boolean>(false)

// 自定义品牌名称表单校验规则
const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称必须大于两位'))
  }
}
// 自定义品牌logo表单校验规则
const validatorLogoUrl = (rules: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('请上传logo的图片'))
  }
}
// 表单校验列表
const rules = {
  tmName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorTmName,
    },
  ],
  logoUrl: [
    {
      required: true,
      validator: validatorLogoUrl,
    },
  ],
}

// **********
onMounted(() => {
  getTrademarkList()
})
// 监听当前页数
watch(
  () => pageNo.value,
  () => {
    getTrademarkList()
  },
)
// 监听每页的数量
watch(
  () => limit.value,
  () => {
    pageNo.value = 1
    getTrademarkList()
  },
)

//-----获取品牌列表
const getTrademarkList = async () => {
  const res: trademarkRes = await reqGetTrademarkList(pageNo.value, limit.value)
  if (res.code === 200) {
    total.value = res.data.total
    trademarkList.value = res.data.records
  }
}
// 添加品牌
const addTrademark = () => {
  dialogFormVisible.value = true
  // 清空数据
  dialogForm.logoUrl = ''
  dialogForm.tmName = ''
  dialogForm.id = 0
  // 也可使用formRef.value?.clearValidate()
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
// 修改品牌
const updateTrademark = (row: records) => {
  dialogFormVisible.value = true
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  Object.assign(dialogForm, row)
}
// 上传图片成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200) {
    // 关闭图片加载动画
    loading.value = false
    dialogForm.logoUrl = response.data
    // 清除logourl校验规则
    formRef.value.clearValidate('logoUrl')
  } else {
    loading.value = false
    ElMessage.error('上传图片失败,服务器发生错误')
  }
}
// 上传图片操作之前
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 开启图片加载动画
  loading.value = true
  if (
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 > 4) {
      ElMessage.error('上传的文件大小必须小于等于4MB!')
      return false
    } else {
      return true
    }
  } else {
    ElMessage.error('上传的文件格式必须是JPG/JPEG/PNG/GIF!')
    return false
  }
}
// 新建|修改品牌的取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}
// 新建|修改品牌的确认按钮
const confirm = async () => {
  try {
    // 手动触发整个表单的校验规则。如果规则的回调发生错误则不再执行后续代码(await抛出错误尽量使用trycatch接受错误,否则控制台会警告有错误未接收)
    await formRef.value.validate()
    const res: any = await reqAddOrUpdateTrademark(dialogForm)
    if (res.code === 200) {
      dialogFormVisible.value = false
      ElMessage.success(dialogForm.id ? '修改品牌成功' : '添加品牌成功')
      // 如果修改品牌或在第一页修改|添加品牌则在当前页刷新,如果在其他页面添加品牌则返回第一页(watch监听刷新)
      if (dialogForm.id || pageNo.value === 1) {
        getTrademarkList()
      } else {
        pageNo.value = 1
      }
    } else {
      ElMessage.error(dialogForm.id ? '修改品牌失败' : '添加品牌失败')
    }
  } catch (error) {
    console.log('error', error)
  }
}
// 删除品牌的确认按钮
const confirmDelete = async (id: number) => {
  const res = await reqDeleteTrademark(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    // 当前页的品牌数量是否不等于1或者已经是第一页,真则留在当前页刷新,假则返回上一页(watch监听刷新)
    if (trademarkList.value.length !== 1 || pageNo.value === 1) {
      getTrademarkList()
    } else {
      pageNo.value -= 1
    }
  } else {
    ElMessage.error('删除失败!')
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
