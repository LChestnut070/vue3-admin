<template>
  <div>
    <el-card style="height: 80px">
      <el-form
        :inline="true"
        style="display: flex; justify-content: space-between"
      >
        <el-form-item label="用户名">
          <el-input placeholder="请输入要搜索的用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <!-- 添加用户 -->
      <el-button type="primary" icon="plus" @click="addUser">添加</el-button>
      <!-- 删除用户 -->
      <el-button color="#ffbeb7" icon="delete" style="color: #fff">
        批量删除
      </el-button>
      <!-- 表格 -->
      <el-table :data="userList" border style="margin: 20px 0">
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
          prop="name"
          min-width="150"
        ></el-table-column>
        <!-- 用户名称 -->
        <el-table-column
          label="用户名称"
          prop="username"
          min-width="150"
        ></el-table-column>
        <!-- 用户角色 -->
        <el-table-column
          label="用户角色"
          prop="roleName"
          min-width="350"
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
          <template #default>
            <el-button type="primary" icon="user">分配角色</el-button>
            <el-button type="primary" icon="edit" @click="updateUser">
              编辑
            </el-button>
            <el-button type="primary" icon="delete">删除</el-button>
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

      <!-- 抽屉 -->
      <el-drawer v-model="drawer" size="40%" style="padding: 0 20px">
        <template #header>
          <h2>添加角色</h2>
        </template>
        <template #default>
          <el-form label-width="80">
            <!-- 输入用户姓名 -->
            <el-form-item label="用户姓名">
              <el-input
                placeholder="请输入用户姓名"
                v-model="userParams.name"
              ></el-input>
            </el-form-item>
            <!-- 输入用户昵称 -->
            <el-form-item label="用户名称">
              <el-input
                placeholder="请输入用户名称"
                v-model="userParams.username"
              ></el-input>
            </el-form-item>
            <!-- 输入用户密码 -->
            <el-form-item label="密码">
              <el-input
                placeholder="请输入用户密码"
                v-model="userParams.password"
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="confirm">确认添加</el-button>
          </div>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { reqGetUserList, reqAddOrUpdateUser } from '@/api/acl/user/index'
import { user_res, userRecords_obj } from '@/api/acl/user/type'
// 当前页
const pageNo = ref<number>(1)
// 每页数量
const limit = ref<number>(10)
// 总数目
const total = ref<number>(100)
// 用户列表
const userList = ref<userRecords_obj[]>([])
// 控制抽屉的显示与隐藏
const drawer = ref<boolean>()
// 需要新增|修改用户的参数
const userParams = ref<userRecords_obj>({
  username: '',
  password: '',
  name: '',
})

onMounted(() => {
  getUserList()
})

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

// 获取用户列表
const getUserList = async () => {
  const res: user_res = await reqGetUserList(pageNo.value, limit.value)
  if (res.code === 200) {
    total.value = res.data.total
    userList.value = res.data.records
  }
}
// 添加用户
const addUser = () => {
  drawer.value = true
}
// 修改用户
const updateUser = () => {
  drawer.value = true
}
// 抽屉取消按钮
function cancel() {
  drawer.value = false
}
// 抽屉确认按钮
function confirm() {
  drawer.value = false
  const res: any = reqAddOrUpdateUser(userParams.value)
  console.log(res)
}
</script>

<style scoped></style>
