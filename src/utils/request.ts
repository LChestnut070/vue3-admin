import useUserStore from '@/store/modules/user'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

//请求拦截器
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
})

//响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // axios返回的错误(如超时等)
    if (
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      error.message.includes('timeout')
    ) {
      ElMessage({
        message: '请求超时，请稍后重试',
        type: 'error',
        duration: 3 * 1000,
      })
    }

    // 后端接口返回的错误
    let msg = ''
    const status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject('响应出现错误' + error)
  },
)

export default request
