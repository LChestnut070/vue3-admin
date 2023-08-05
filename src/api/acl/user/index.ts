import request from '@/utils/request'
import { user_res, userRecords_obj } from './type'

enum API {
  AllUser_Api = '/admin/acl/user',
  AddUser_Api = '/admin/acl/user/save',
  UpdateUser_Api = '/admin/acl/user/update',
}

// 获取用户列表
export const reqGetUserList = (page: number, limit: number) => {
  return request<any, user_res>({
    url: API.AllUser_Api + `/${page}/${limit}`,
    method: 'get',
  })
}
// 新增|修改用户
export const reqAddOrUpdateUser = (data: userRecords_obj) => {
  if (data.id) {
    // 修改用户
    return request<any, user_res>({
      url: API.AllUser_Api,
      method: 'post',
      data,
    })
  } else {
    // 新增用户
    return request<any, user_res>({
      url: API.UpdateUser_Api,
      method: 'put',
      data,
    })
  }
}
// 修改用户
