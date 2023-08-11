<template>
  <el-card>
    <el-table
      :data="permissionList"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      stripe
      v-loading="loading"
      :indent="parseInt('25')"
    >
      <!-- 名称 -->
      <el-table-column prop="name" label="名称" sortable />
      <!-- 权限值 -->
      <el-table-column prop="code" label="权限值" sortable />
      <!-- 层级 -->
      <el-table-column prop="level" label="层级" width="60" />
      <!-- 修改时间 -->
      <el-table-column
        prop="updateTime"
        label="修改时间"
        sortable
        width="180"
      />
      <!-- 操作 -->
      <el-table-column label="操作" min-width="100">
        <template #default="{ row }">
          <!-- 添加功能|添加菜单 -->
          <el-button
            type="primary"
            :disabled="row.children.length > 0 ? false : true"
            title="添加当前菜单的子菜单"
            @click="addBtn(row)"
          >
            {{ row.level > 2 ? '添加功能' : '添加菜单' }}
          </el-button>
          <!-- 编辑 -->
          <el-button type="warning" @click="updateBtn(row)">编辑</el-button>
          <!-- 删除 -->
          <el-popconfirm
            width="250"
            :title="`确定要删除${row.name}吗?`"
            @confirm="deleteBtn(row)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="editPermissionParams.id ? '修改菜单' : '添加菜单'"
      @closed="dialogHandleCloesd"
    >
      <!-- 表单 -->
      <el-form :model="editPermissionParams">
        <!-- 名称 -->
        <el-form-item label="名称" :label-width="80">
          <el-input
            v-model="editPermissionParams.name"
            autocomplete="name"
            placeholder="请输入名称"
          />
        </el-form-item>
        <!-- 权限值 -->
        <el-form-item label="权限值" :label-width="80">
          <el-input
            v-model="editPermissionParams.code"
            autocomplete="code"
            placeholder="请输入权限值"
          />
        </el-form-item>
      </el-form>
      <!-- 确认取消 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="dialogConfirm"
            :loading="buttonLoading"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import {
  reqGetAllPermissionList,
  reqAddOrUpdatePermission,
  reqDeletePermission,
} from '@/api/acl/menu'
import {
  allPermission_obj,
  allPermission_res,
  allPermission_req,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

// -----INFO: 数据声明区域
// 菜单权限列表
const permissionList = ref<allPermission_obj[]>([])
// 控制对话框的显示与隐藏
const dialogFormVisible = ref<boolean>(false)
// 控制表格加载效果
const loading = ref<boolean>(false)
// 控制按钮的加载效果
const buttonLoading = ref<boolean>(false)
// 新增|修改菜单权限的参数
const editPermissionParams = ref<allPermission_req>({
  pid: 0,
  name: '',
  code: '',
  level: 0,
  // id: 0,
})

// -----INFO: 生命周期事件区域
onMounted(() => {
  getAllPermissionList()
})

// -----INFO: 表格事件区域
// 获取全部菜单权限
const getAllPermissionList = async () => {
  loading.value = true
  const res: allPermission_res = await reqGetAllPermissionList()
  if (res.code === 200) {
    permissionList.value = res.data
    loading.value = false
  } else {
    ElMessage.error('获取菜单权限失败!')
    loading.value = false
  }
}
// 添加菜单|功能的按钮
const addBtn = async (row: allPermission_obj) => {
  dialogFormVisible.value = true
  editPermissionParams.value.pid = row.pid
  // 添加子菜单需要+1层级
  editPermissionParams.value.level = row.level + 1
}
// 编辑菜单
const updateBtn = (row: allPermission_obj) => {
  dialogFormVisible.value = true
  editPermissionParams.value.name = row.name
  editPermissionParams.value.code = row.code
  editPermissionParams.value.id = row.id
  editPermissionParams.value.pid = row.pid
  editPermissionParams.value.level = row.level
}
// 删除菜单
const deleteBtn = async (row: allPermission_obj) => {
  const res = await reqDeletePermission(row.id as number)
  if (res.code === 200) {
    ElMessage.success('删除成功!')
    getAllPermissionList()
  } else {
    ElMessage.error('删除失败!')
  }
}

// -----INFO: 对话框事件区域
// 对话框确认
const dialogConfirm = async () => {
  buttonLoading.value = true
  const res = await reqAddOrUpdatePermission(editPermissionParams.value)
  if (res.code === 200) {
    buttonLoading.value = false
    ElMessage.success(editPermissionParams.value.id ? '修改成功!' : '添加成功!')
    getAllPermissionList()
    dialogFormVisible.value = false
  } else {
    ElMessage.error(editPermissionParams.value.id ? '修改失败' : '添加失败!')
    buttonLoading.value = false
  }
}
// 对话框关闭
const dialogHandleCloesd = () => {
  Object.assign(editPermissionParams.value, {
    pid: 0,
    name: '',
    code: '',
    level: 0,
    // id: 0,
  })
  delete editPermissionParams.value.id
}
</script>

<style scoped></style>
