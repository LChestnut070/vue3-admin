<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12"></el-col>
      <el-col :span="12">
        <el-form
          class="login-form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到SHOP MANAGER</h2>
          <!--账号-->
          <el-form-item prop="username">
            <el-input
              placeholder="请输入用户名"
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              style="width: 100%"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user.ts'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getHours } from '@/utils/time.ts'

const userStore = useUserStore()
const $router = useRouter()
const $route = useRoute()

// 收集表单数据
const loginForm = reactive({ username: 'admin', password: 'atguigu123' })
// 是否正在登录
const loading = ref(false)
// 自定义账号校验规则
const validatorUserName = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少为5位'))
  }
}
// 自定义密码校验规则
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少为6位'))
  }
}
// 表单校验规则
const rules = {
  username: [
    {
      validator: validatorUserName,
      trigger: 'change',
    },
  ],
  password: [
    {
      validator: validatorPassword,
      trigger: 'change',
    },
  ],
}
// ref表单对象
const loginForms = ref()

//登录
const login = async () => {
  loading.value = true
  userStore
    .userLogin(loginForm)
    .then(() => {
      // 登录成功
      const redirect: any = $route.query.redirect
      // 重定向
      $router.push({ path: redirect || '/' })
      ElNotification({
        type: 'success',
        title: `Hi,${getHours()}好`,
        message: '欢迎回来',
        duration: 4500,
      })
    })
    .catch((err: Error) => {
      // 登录失败
      ElNotification({
        type: 'error',
        message: err.message,
        duration: 1300,
      })
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped lang="scss">
.login-container {
  background: url('@/assets/images/background.jpg') no-repeat;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  .login-form {
    position: relative;
    padding: 30px;
    top: 30vh;
    width: 80%;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    h1 {
      font-size: 40px;
      color: white;
    }
    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }
  }
}
</style>
