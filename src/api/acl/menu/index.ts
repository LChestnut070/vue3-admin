import request from '@/utils/request'
import { allPermission_obj, allPermission_res } from './type'

enum API {
  AllPermission_Api = '/admin/acl/permission',
  AddPermission_Api = '/admin/acl/permission/save',
  UpdatePermission_Api = '/admin/acl/permission/update',
  DeletePermission_Api = '/admin/acl/permission/remove',
}

// 获取全部菜单权限
export const reqGetAllPermissionList = () => {
  return request<any, allPermission_res>({
    url: API.AllPermission_Api,
    method: 'get',
  })
}
// 添加|修改菜单权限
export const reqAddOrUpdatePermission = (data: allPermission_obj) => {
  if (data.id) {
    return request<any, any>({
      url: API.UpdatePermission_Api,
      method: 'put',
      data,
    })
  } else {
    return request<any, any>({
      url: API.AddPermission_Api,
      method: 'post',
      data,
    })
  }
}
// 获取全部菜单权限
export const reqDeletePermission = (id: number) => {
  return request<any, any>({
    url: API.DeletePermission_Api + `/${id}`,
    method: 'delete',
  })
}
