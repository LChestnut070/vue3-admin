// 登录接口请求参数类型
export interface loginForm {
  username: string
  password: string
}

// 接口响应数据类型(通用)
export interface resData_common {
  code: number
  ok: boolean
  message: string
}
// 登录接口响应数据类型
export interface loginResData extends resData_common {
  data: string
}

// 用户信息响应数据类型
export interface userinfoResData extends resData_common {
  data: {
    avatar: string
    name: string
    roles: string[]
    buttons: string[]
    routes: string[]
  }
}
