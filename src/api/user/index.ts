import request from '@/utils/request.ts'
import type {
  loginForm,
  loginResData,
  userinfoResData,
} from '@/api/user/type.ts'

enum API {
  Login_Url = '/admin/acl/index/login',
  Userinfo_Url = '/admin/acl/index/info',
  Logout_Url = '/admin/acl/index/logout',
}
export const reqLogin = (data: loginForm) => {
  return request<any, loginResData>({
    url: API.Login_Url,
    method: 'post',
    data,
  })
}
export const reqGetUserInfo = () => {
  return request<any, userinfoResData>({
    url: API.Userinfo_Url,
    method: 'get',
  })
}
export const reqLogout = () => {
  return request<any, any>({
    url: API.Logout_Url,
    method: 'post',
  })
}
