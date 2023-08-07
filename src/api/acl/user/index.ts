import request from '@/utils/request'
import {
  user_res,
  userRecords_obj,
  allroleList_res,
  setuserrole_req,
} from './type'

enum API {
  AllUser_Api = '/admin/acl/user',
  AddUser_Api = '/admin/acl/user/save',
  UpdateUser_Api = '/admin/acl/user/update',
  AllRole_Api = '/admin/acl/user/toAssign',
  SetUserRole_Api = '/admin/acl/user/doAssignRole',
  DeleteUser_Api = '/admin/acl/user/remove',
  DeleteSomeUser_Api = '/admin/acl/user/batchRemove',
}

// 获取用户列表(如果带有用户姓名则为搜索)
export const reqGetUserList = (
  page: number,
  limit: number,
  username: string,
) => {
  return request<any, user_res>({
    url: API.AllUser_Api + `/${page}/${limit}/?username=${username}`,
    method: 'get',
  })
}
// 新增|修改用户
export const reqAddOrUpdateUser = (data: userRecords_obj) => {
  if (data.id) {
    // 修改用户
    return request<any, user_res>({
      url: API.UpdateUser_Api,
      method: 'put',
      data,
    })
  } else {
    // 新增用户
    return request<any, user_res>({
      url: API.AddUser_Api,
      method: 'post',
      data,
    })
  }
}

// 获取全部角色与当前角色
export const reqGetRoleList = (adminId: number) => {
  return request<any, allroleList_res>({
    url: API.AllRole_Api + `/${adminId}`,
    method: 'get',
  })
}
// 修改用户的角色
export const reqSetUserRole = (data: setuserrole_req) => {
  return request<any, any>({
    url: API.SetUserRole_Api,
    method: 'post',
    data,
  })
}

// 删除某个用户
export const reqDeleteUser = (id: number) => {
  return request<any, any>({
    url: API.DeleteUser_Api + `/${id}`,
    method: 'delete',
  })
}

// 删除多个用户
export const reqDeleteSomeUser = (idList: number[]) => {
  return request<any, any>({
    url: API.DeleteSomeUser_Api,
    method: 'delete',
    data: idList,
  })
}
