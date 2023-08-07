<template>
  <div>
    <!-- 搜索区域 -->
    <el-card style="height: 80px">
      <!-- 搜索 -->
      <el-form
        :inline="true"
        style="display: flex; justify-content: space-between"
      >
        <el-form-item label="用户名">
          <el-input
            placeholder="请输入要搜索的用户名"
            v-model="searchParams"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchByUser">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card style="margin-top: 20px">
      <!-- 添加用户 -->
      <el-button type="primary" icon="plus" @click="addUser">添加</el-button>
      <!-- 批量删除用户 -->
      <el-popconfirm
        title="确定进行批量删除吗?"
        width="250"
        icon="delete"
        @confirm="deleteSomeUser"
      >
        <template #reference>
          <el-button
            color="#ffbeb7"
            icon="delete"
            style="color: #fff"
            :disabled="deleteSomeUserParams.length > 0 ? false : true"
          >
            批量删除
          </el-button>
        </template>
      </el-popconfirm>

      <!-- 表格 -->
      <el-table
        :data="userList"
        border
        style="margin: 20px 0"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <!-- 选择 -->
        <el-table-column type="selection"></el-table-column>
        <!-- 序号 -->
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <!-- id -->
        <el-table-column label="id" prop="id"></el-table-column>
        <!-- 用户名字 -->
        <el-table-column
          label="用户名字"
          prop="username"
          min-width="150"
        ></el-table-column>
        <!-- 用户名称 -->
        <el-table-column
          label="用户名称"
          prop="name"
          min-width="150"
        ></el-table-column>
        <!-- 用户角色 -->
        <el-table-column
          label="用户角色"
          prop="roleName"
          min-width="350"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 创建时间 -->
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="170"
        ></el-table-column>
        <!-- 更新时间 -->
        <el-table-column
          label="更新时间"
          prop="updateTime"
          width="170"
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" fixed="right" width="330">
          <template #default="{ row }">
            <!-- 分配角色 -->
            <el-button type="primary" icon="user" @click="setRole(row)">
              分配角色
            </el-button>
            <!-- 编辑用户 -->
            <el-button type="primary" icon="edit" @click="updateUser(row)">
              编辑
            </el-button>
            <!-- 删除用户 -->
            <el-popconfirm
              :title="`确定要删除${row.username}吗?`"
              @confirm="deleteUser(row)"
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

      <!-- 用户抽屉 -->
      <el-drawer
        v-model="userdrawer"
        size="40%"
        style="padding: 0 20px"
        @closed="userdrawerHandleClosed"
      >
        <!-- 标题展示 -->
        <template #header>
          <h2>{{ userParams.id ? '修改用户' : '新增用户' }}</h2>
        </template>
        <!-- 表单填写 -->
        <template #default>
          <el-form
            label-width="80"
            :model="userParams"
            :rules="formRules"
            ref="formRef"
          >
            <!-- 抽屉输入用户姓名 -->
            <el-form-item label="用户姓名" prop="username">
              <el-input
                placeholder="请输入用户姓名"
                v-model="userParams.username"
              ></el-input>
            </el-form-item>
            <!-- 抽屉输入用户昵称 -->
            <el-form-item label="用户名称" prop="name">
              <el-input
                placeholder="请输入用户名称"
                v-model="userParams.name"
              ></el-input>
            </el-form-item>
            <!-- 抽屉输入用户密码 -->
            <el-form-item label="密码" prop="password" v-if="!userParams.id">
              <el-input
                placeholder="请输入用户密码"
                v-model="userParams.password"
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- 确认取消 -->
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="userConfirm">
              {{ userParams.id ? '确认修改' : '确认添加' }}
            </el-button>
          </div>
        </template>
      </el-drawer>

      <!-- 角色抽屉 -->
      <el-drawer
        v-model="roledrawer"
        size="40%"
        style="padding: 0 20px"
        @closed="roledrawerHandleClosed"
      >
        <!-- 标题 -->
        <template #header>
          <h1>分配角色用户</h1>
        </template>
        <!-- 表单 -->
        <template #default>
          <el-form>
            <!-- 用户名字 -->
            <el-form-item label="用户名字">
              <el-input
                :disabled="true"
                v-model="userParams.username"
                placeholder="请输入用户名字"
              ></el-input>
            </el-form-item>
            <!-- 角色列表 -->
            <el-form-item label="角色列表">
              <!-- 全选 -->
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              >
                全选
              </el-checkbox>
              <!-- 复选框组 -->
              <el-checkbox-group
                v-model="checkedRoleList"
                @change="handleCheckedChange"
              >
                <el-checkbox
                  v-for="role in roleList"
                  :key="role.id"
                  :label="role"
                >
                  {{ role.roleName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </template>
        <!-- 确认取消 -->
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="roleConfirm">确认修改</el-button>
          </div>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import {
  reqGetUserList,
  reqAddOrUpdateUser,
  reqGetRoleList,
  reqSetUserRole,
  reqDeleteUser,
  reqDeleteSomeUser,
} from '@/api/acl/user/index'
import {
  user_res,
  userRecords_obj,
  allroleList_res,
  roles_obj,
  setuserrole_req,
} from '@/api/acl/user/type'
import { ElMessage, ElNotification } from 'element-plus'
import useUserStore from '@/store/modules/user'

// -----INFO: 数据声明区域
// 当前页
const pageNo = ref<number>(1)
// 每页数量
const limit = ref<number>(5)
// 总数目
const total = ref<number>(100)
// 用户列表
const userList = ref<userRecords_obj[]>([])
// 角色列表
const roleList = ref<roles_obj[]>([])
// 被选中的角色的列表
const checkedRoleList = ref<roles_obj[]>([])
// 控制增|改用户的抽屉的显示与隐藏
const userdrawer = ref<boolean>(false)
// 控制分配角色的抽屉的显示与隐藏
const roledrawer = ref<boolean>(false)
// 控制角色抽屉的复选框的状态
const checkAll = ref<boolean>()
// 控制角色抽屉的复选框的状态(不确定状态样式)
const isIndeterminate = ref<boolean>()
// 控制表格加载效果
const loading = ref<boolean>()
// 表单的ref实例对象
const formRef = ref<any>()
// 存储用户的仓库数据
const userStore = useUserStore()
// 需要搜索用户名字的参数
const searchParams = ref<string>('')
// 需要新增|修改用户的参数
const userParams = ref<userRecords_obj>({
  username: '',
  password: '',
  name: '',
})
// 需要分配角色的参数
const roleParams = ref<setuserrole_req>({
  userId: 0,
  roleIdList: [],
})
// 需要删除多个用户的参数
const deleteSomeUserParams = ref<userRecords_obj[]>([])

// -----INFO: 生命周期事件区域
onMounted(() => {
  getUserList()
})

// -----INFO: 监听事件区域
// 监听当前页数的变化
watch(
  () => pageNo.value,
  () => {
    getUserList()
  },
)
// 监听每页的数量
watch(
  () => limit.value,
  () => {
    pageNo.value === 1 ? getUserList() : (pageNo.value = 1)
  },
)

// -----INFO: 表格事件区域
// 获取用户列表
const getUserList = async () => {
  loading.value = true
  // 如果搜索词为空则获取全部用户,有搜索词则搜索指定内容
  const res: user_res = await reqGetUserList(
    pageNo.value,
    limit.value,
    searchParams.value,
  )
  if (res.code === 200) {
    total.value = res.data.total
    userList.value = res.data.records
    loading.value = false
  } else {
    ElMessage.error('获取用户失败!请刷新重试!')
    loading.value = false
  }
}
// 搜索用户
const searchByUser = () => {
  loading.value = true
  getUserList()
}
// 重置搜索用户
const resetSearch = () => {
  loading.value = true
  searchParams.value = ''
  getUserList()
}
// 添加用户
const addUser = () => {
  userdrawer.value = true
  // WARN:清除遗留的表单校验(第一次没有表单组件,所以需要使用nexttick等dom加载完毕再清除),也可以在抽屉关闭后调用此事件
  // nextTick(() => {
  //   formRef.value.clearValidate()
  // })
}
// 修改用户
const updateUser = (row: userRecords_obj) => {
  userdrawer.value = true
  // WARN:为了点击修改用户后立即校验一次表单,需要等待抽屉组件加载完毕后再传值才能校验触发
  nextTick(() => Object.assign(userParams.value, row))
}
// 删除单个用户
const deleteUser = async (row: userRecords_obj) => {
  loading.value = true
  const res = await reqDeleteUser(row.id as number)
  if (res.code === 200) {
    ElMessage.success('删除用户成功!')
    pageNo.value === 1 ? getUserList() : (pageNo.value = 1)
  } else {
    ElMessage({
      type: 'error',
      message: res.message,
    })
    loading.value = false
  }
}
// 表格点击多选框事件(删除多个用户前的赋值)
const handleSelectionChange = (val: userRecords_obj[]) => {
  deleteSomeUserParams.value = val
  // 尽量避免在每次点击多选框的时候使用map,节约性能
  // deleteSomeUserParams.value = val.map((item) => {
  //   return item.id as number
  // })
}
// 删除多个用户
const deleteSomeUser = async () => {
  loading.value = true
  // 整理参数
  const params: number[] = deleteSomeUserParams.value.map((item) => {
    return item.id as number
  })
  // 发送请求
  const res: any = await reqDeleteSomeUser(params)
  if (res.code === 200) {
    ElMessage.success('删除多个用户成功!')
    pageNo.value === 1 ? getUserList() : (pageNo.value = 1)
  } else {
    ElMessage({
      type: 'error',
      message: res.data,
    })
    loading.value = false
  }
}
// 分配角色
const setRole = async (row: userRecords_obj) => {
  roledrawer.value = true
  userParams.value.username = row.username
  userParams.value.id = row.id
  const res: allroleList_res = await reqGetRoleList(row.id as number)
  if (res.code === 200) {
    // 全部角色
    roleList.value = res.data.allRolesList
    // 当前角色
    checkedRoleList.value = res.data.assignRoles
    checkAll.value = roleList.value.length === checkedRoleList.value.length
    isIndeterminate.value =
      checkedRoleList.value.length > 0 &&
      checkedRoleList.value.length < roleList.value.length
  } else {
    ElMessage.error('获取用户角色失败!请稍后重试!')
  }
}

// -----INFO: 抽屉事件区域
// 抽屉全选复选框的点击事件(角色抽屉)
const handleCheckAllChange = (val: boolean) => {
  // val为点击之后checkbox的选中状态
  checkedRoleList.value = val ? roleList.value : []
  // 清除不确定状态
  isIndeterminate.value = false
}
// 抽屉复选框组的点击事件(角色抽屉)
const handleCheckedChange = (value: string[]) => {
  // value为点击复选框后,已被选中的复选框组
  const checkedCount = value.length
  // 已经选中的角色数量与全部的角色的数量如果相等返回true与false
  checkAll.value = checkedCount === roleList.value.length
  // 已经选中的角色数量大于0且小于全部的角色的数量返回true与false
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < roleList.value.length
}
// 用户抽屉取消按钮
const cancel = () => {
  userdrawer.value = false
  roledrawer.value = false
}
// 关闭用户抽屉(动画完成后)
const userdrawerHandleClosed = () => {
  // 清空数据
  Object.assign(userParams.value, {
    id: '',
    username: '',
    password: '',
    name: '',
  })
  // WARN:表单校验规则(可能)并不是在数据改变后立即触发,所以如果清空数据后立即使用清除校验可能造成清除事件在规则触发事件之前,造成clearValidate无效,可以使用延时器对清除事件手动延后
  setTimeout(() => {
    formRef.value.clearValidate()
  }, 100)
}
// 关闭角色抽屉(动画完成后)
const roledrawerHandleClosed = () => {
  // 关闭抽屉后清空全部数据
  checkAll.value = false
  isIndeterminate.value = false
  userParams.value.username = ''
  checkedRoleList.value = []
}
// 用户抽屉确认按钮
const userConfirm = async () => {
  try {
    // 使用await后尽量接收错误,否则vue会出警告
    // 手动触发表单校验,await出错后不再执行后面程序
    await formRef.value.validate()
    userdrawer.value = false
    // 显示loading效果
    loading.value = true
    const res: any = await reqAddOrUpdateUser(userParams.value)
    // 如果修改|添加成功
    if (res.code === 200) {
      ElMessage.success(userParams.value.id ? '修改成功!' : '添加成功!')
      // 如果为修改
      if (userParams.value.id) {
        // 如果修改的为当前登录的用户,则立即重新登录
        if (userStore.username === userParams.value.name) {
          ElNotification({
            type: 'error',
            message: '检测到当前账号的密码已被修改,即将重新登录...',
            duration: 3000,
          })
          // 重新加载页面,如果密码更改则重新登录
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        } else {
          // 如果修改的是其他用户则留在当前页刷新
          getUserList()
        }
      } else {
        // 如果为新增立即刷新,不在第一页则跳转到第一页刷新
        pageNo.value === 1 ? getUserList() : (pageNo.value = 1)
      }
    } else {
      // 如果修改|添加失败
      ElMessage.error(
        userParams.value.id ? '修改成功!' : '添加失败!可能是用户名称重复',
      )
      loading.value = false
    }
  } catch (error) {
    console.log('err!!', error)
  }
}
// 角色抽屉确认按钮
const roleConfirm = async () => {
  // 打开加载效果,关闭抽屉
  loading.value = true
  roledrawer.value = false
  // 收集发设置角色请求的参数
  roleParams.value.userId = userParams.value.id as number
  roleParams.value.roleIdList = checkedRoleList.value.map((item) => item.id)
  // 发请求
  const res = await reqSetUserRole(roleParams.value)
  if (res.code === 200) {
    ElMessage.success('分配角色成功!')
    pageNo.value === 1 ? getUserList() : (pageNo.value = 1)
  } else {
    ElMessage.error('分配角色失败!请稍后重试!')
    loading.value = false
  }
}

// -----INFO: 表单校验规则区域
// 自定义用户姓名校验规则
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value[0] === ' ') {
    // 如果用户姓名开头为空格
    callback(new Error('用户姓名开头不能为空格'))
  } else if (value.trim() === '') {
    // 如果用户姓名为空
    callback(new Error('用户姓名不能为空'))
  } else if (value.trim().length < 5 || value.trim().length > 16) {
    // 如果用户姓名长度未在5-16位
    callback(new Error('用户姓名长度必须在5-16位之间'))
  } else if (value[value.length - 1] === ' ') {
    // 如果用户姓名结尾为空格
    callback(new Error('用户姓名结尾不能有空格'))
  } else {
    callback()
  }
}
// 自定义用户昵称校验规则
const validatename = (rule: any, value: any, callback: any) => {
  if (value[0] === ' ') {
    // 如果用户昵称开头为空格
    callback(new Error('用户昵称开头不能为空格'))
  } else if (value.trim() === '') {
    // 如果用户昵称为空
    callback(new Error('用户昵称不能为空'))
  } else if (value.trim().length < 5 || value.trim().length > 16) {
    // 如果用户昵称长度未在5-16位
    callback(new Error('用户昵称长度必须在5-16位之间'))
  } else if (value[value.length - 1] === ' ') {
    // 如果用户昵称结尾为空格
    callback(new Error('用户昵称结尾不能有空格'))
  } else {
    callback()
  }
}
// 自定义用户密码校验规则
const validatePassword = (rule: any, value: any, callback: any) => {
  // \w表示匹配a-zA-Z0-9和下划线,{6,16}表示匹配长度为6-16
  const reg = /^\w{6,16}$/.test(value)
  if (!reg) {
    callback(new Error('密码只能由6到16位由大小写字母、数字和下划线组成!'))
  } else {
    callback()
  }
}
// 自定义表单校验
const formRules = {
  // 使用change时,因为关闭抽屉时清空表单数据也会触发change事件,所以会额外触发一次表单验
  username: [
    {
      required: true,
      trigger: 'change',
      validator: validateUsername,
    },
  ],
  name: [
    {
      required: true,
      trigger: 'change',
      validator: validatename,
    },
  ],
  password: [
    {
      required: true,
      trigger: 'change',
      validator: validatePassword,
    },
  ],
}
</script>

<style>
.el-tooltip__popper {
  max-width: 800px;
}
</style>
