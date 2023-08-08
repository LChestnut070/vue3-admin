<template>
  <div>
    <!-- 搜索区域 -->
    <el-card style="height: 80px">
      <el-form
        :inline="true"
        style="display: flex; justify-content: space-between"
      >
        <!-- 搜索输入框 -->
        <el-form-item label="角色名称">
          <el-input
            placeholder="请输入要搜索的角色"
            v-model="searchParams"
            @change="searchByRole"
          ></el-input>
        </el-form-item>
        <!-- 搜索按钮 -->
        <el-form-item>
          <el-button type="primary" @click="searchByRole">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card style="margin-top: 20px">
      <!-- 添加角色 -->
      <el-button type="primary" icon="plus" @click="addRoleBtn">
        添加角色
      </el-button>
      <!-- 表格 -->
      <el-table
        border
        :data="roleList"
        style="margin: 20px 0"
        v-loading="loading"
      >
        <!-- 序号 -->
        <el-table-column label="#" type="index"></el-table-column>
        <!-- id -->
        <el-table-column label="id" prop="id" width="100"></el-table-column>
        <!-- 角色名称 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <!-- 创建时间 -->
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <!-- 更新时间 -->
        <el-table-column label="更新时间" prop="updateTime"></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="320">
          <template #default="{ row }">
            <!-- 分配权限 -->
            <el-button
              type="primary"
              icon="user"
              @click="editPermissionBtn(row)"
            >
              分配权限
            </el-button>
            <!-- 编辑角色 -->
            <el-button type="primary" icon="edit" @click="updateRoleBtn(row)">
              编辑
            </el-button>
            <!-- 删除角色 -->
            <el-popconfirm
              width="250"
              :title="`确定要删除${row.roleName}吗?`"
              @confirm="deleteRoleBtn(row)"
            >
              <template #reference>
                <el-button type="primary" icon="delete">删除</el-button>
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
        layout="prev, pager, next, jumper,->,total, sizes"
        :total="total"
      />
    </el-card>

    <!-- 添加|修改角色对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="editRoleParams.id ? '编辑角色' : '添加角色'"
      @closed="editRoleHandleClosed"
    >
      <el-form :model="editRoleParams" :rules="editRoleRules" ref="editRoleRef">
        <el-form-item label="角色名称" :label-width="80" prop="roleName">
          <el-input v-model="editRoleParams.roleName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="editRoleConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配权限抽屉 -->
    <el-drawer v-model="drawerVisible" size="40%" @closed="drawerHandleclosed">
      <!-- 标题 -->
      <template #header>
        <h4>分配权限</h4>
      </template>
      <!-- 树形控件 -->
      <template #default>
        <el-tree
          :data="permissionList"
          show-checkbox
          node-key="id"
          :default-expanded-keys="checkedPermissionList"
          :default-checked-keys="checkedPermissionList"
          :props="defaultProps"
          ref="treeRef"
        />
      </template>
      <!-- 确认取消 -->
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="drawerConfirm">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import {
  reqAddOrUpdateRole,
  reqGetAllRoleList,
  reqPermissionByRole,
  reqSetPermissionByRole,
  reqDeleteRole,
} from '@/api/acl/role'
import {
  allroleList_res,
  roleListRecords_obj,
  permissionByRole_obj,
  permissionByRole_res,
} from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'
import { onMounted, ref, watch } from 'vue'

// -----INFO: 数据声明区域
// 当前页
const pageNo = ref<number>(1)
// 每页数量
const limit = ref<number>(5)
// 总数目
const total = ref<number>(0)
// 表格加载效果
const loading = ref<boolean>(false)
// 控制新增|修改角色的对话框的显示与隐藏
const dialogFormVisible = ref<boolean>(false)
// 控制分配权限的抽屉的显示与隐藏
const drawerVisible = ref<boolean>(false)
// 新增|修改角色的对话框的表单的ref
const editRoleRef = ref<any>()
// 抽屉的树形控件的ref
const treeRef = ref<any>()
// 角色列表
const roleList = ref<roleListRecords_obj[]>([])
// 菜单权限列表
const permissionList = ref<permissionByRole_obj[]>([])
// 默认勾选的权限列表
const checkedPermissionList = ref<number[]>([])
// 抽屉树形控件需要展示的数据
const defaultProps = {
  children: 'children',
  label: 'name',
}
// 需要搜索用户名字的参数
const searchParams = ref<string>('')
// 需要添加|修改角色的参数\
const editRoleParams = ref<roleListRecords_obj>({
  roleName: '',
  // id: 0,
})

// -----INFO: 生命周期事件区域
onMounted(() => {
  getAllRoleList()
})

// -----INFO: 监听事件区域
watch(
  () => pageNo.value,
  () => {
    getAllRoleList()
  },
)
watch(
  () => limit.value,
  () => {
    pageNo.value === 1 ? getAllRoleList() : (pageNo.value = 1)
  },
)

// -----INFO: 计算已勾选的权限区域
const filterCheckedPermission = (allArr: any, initArr: any) => {
  allArr.forEach((item: any) => {
    // 如果children数组长度大于0则继续递归,直到最后一层
    if (item.children.length > 0) {
      filterCheckedPermission(item.children, initArr)
    }
    // 只会往空数组push最后一个状态为已选中的children数组的id
    if (item.children.length === 0 && item.select === true) {
      initArr.push(item.id)
    }
  })
  return initArr
}

// -----INFO: 表格事件区域
// 获取角色列表
const getAllRoleList = async () => {
  loading.value = true
  // 发送请求
  const res: allroleList_res = await reqGetAllRoleList(
    pageNo.value,
    limit.value,
    searchParams.value,
  )
  if (res.code === 200) {
    // 此处需要断言total,否则分页器会识别total为字符串
    total.value = res.data.total as number
    roleList.value = res.data.records
    loading.value = false
  } else {
    ElMessage.error('获取角色列表失败,请稍后重试!')
    loading.value = false
  }
}
// 搜索角色
const searchByRole = () => {
  loading.value = true
  getAllRoleList()
}
// 重置搜索角色
const resetSearch = () => {
  loading.value = true
  searchParams.value = ''
  getAllRoleList()
}
// 添加角色的按钮事件
const addRoleBtn = () => {
  dialogFormVisible.value = true
}
// 编辑角色的按钮事件
const updateRoleBtn = (row: roleListRecords_obj) => {
  dialogFormVisible.value = true
  // 使用直接赋值会导致表格数据与表单数据绑定,关闭对话框后清空数据会清空当前行的表格数据
  // editRoleParams.value = row
  Object.assign(editRoleParams.value, row)
}
// 分配权限的按钮事件
const editPermissionBtn = async (row: roleListRecords_obj) => {
  drawerVisible.value = true
  Object.assign(editRoleParams.value, row)
  // 根据角色获取菜单权限
  const less_res: permissionByRole_res = await reqPermissionByRole(
    editRoleParams.value.id as number,
  )
  if (less_res.code === 200) {
    permissionList.value = less_res.data
    checkedPermissionList.value = filterCheckedPermission(
      permissionList.value,
      [],
    )
  }
}
// 删除角色的按钮事件
const deleteRoleBtn = async (row: roleListRecords_obj) => {
  const res = await reqDeleteRole(row.id as number)
  if (res.code === 200) {
    ElMessage.success('删除角色成功!')
    pageNo.value === 1 || roleList.value.length > 1
      ? getAllRoleList()
      : (pageNo.value = 1)
  } else {
    ElMessage.error('删除角色失败!')
  }
}

// -----INFO: 对话框事件区域
// 确认添加|修改角色
const editRoleConfirm = async () => {
  try {
    await editRoleRef.value.validate()
    const res: any = await reqAddOrUpdateRole(editRoleParams.value)
    if (res.code === 200) {
      ElMessage.success(
        editRoleParams.value.id ? '修改角色名称成功' : '添加角色名称成功',
      )
      dialogFormVisible.value = false
      // 如果当前页为第一页或为修改角色则留在当前页刷新,在其他页新增会回到第一页更新
      pageNo.value === 1 || editRoleParams.value.id
        ? getAllRoleList()
        : (pageNo.value = 1)
    } else {
      ElMessage.error(editRoleParams.value.id ? '修改角色失败' : '添加角色失败')
    }
  } catch (error) {
    console.log('err~QAQ', error)
  }
}
// 关闭对话框的动画结束后
const editRoleHandleClosed = () => {
  Object.assign(editRoleParams.value, {
    roleName: '',
  })
  delete editRoleParams.value.id
  setTimeout(() => editRoleRef.value.clearValidate(), 100)
}

// -----INFO: 抽屉事件区域
// 分配权限抽屉的确认事件
const drawerConfirm = async () => {
  const keys = treeRef.value.getCheckedKeys()
  const halfkeys = treeRef.value.getHalfCheckedKeys()
  const allkeys = keys.concat(halfkeys)

  const res = await reqSetPermissionByRole(
    editRoleParams.value.id as number,
    allkeys,
  )
  if (res.code === 200) {
    ElMessage.success('设置权限成功!')
  } else {
    ElMessage.error('设置权限失败!请稍后重试')
  }
  drawerVisible.value = false
  getAllRoleList()
}
// 抽屉关闭
const drawerHandleclosed = () => {
  checkedPermissionList.value = []
}

// -----INFO: 表单校验规则区域
// 自定义角色名称校验规则
const roleNameValidate = (rule: any, value: any, callback: any) => {
  if (value[0] === ' ') {
    // 如果角色名称开头为空格
    callback(new Error('角色名称开头不能为空格'))
  } else if (value.trim() === '') {
    // 如果角色名称为空
    callback(new Error('角色名称不能为空'))
  } else if (value.trim().length > 10) {
    // 如果角色名称长度大于10位
    callback(new Error('角色名称长度必须小于10位'))
  } else if (value[value.length - 1] === ' ') {
    // 如果角色名称结尾为空格
    callback(new Error('角色名称结尾不能有空格'))
  } else {
    callback()
  }
}
// 表单校验
const editRoleRules = {
  roleName: [
    {
      required: true,
      trigger: 'change',
      validator: roleNameValidate,
    },
  ],
}
</script>

<style scoped></style>
