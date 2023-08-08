import request from '@/utils/request'
import {
  allroleList_res,
  roleListRecords_obj,
  permissionByRole_res,
} from './type'

enum API {
  AllRoleList_Api = '/admin/acl/role',
  AddRole_Api = '/admin/acl/role/save',
  UpdateRole_Api = '/admin/acl/role/update',
  PermissionByRole_Api = '/admin/acl/permission/toAssign',
  SetPermissionByRole_Api = '/admin/acl/permission/doAssign',
  DeleteRole_Api = '/admin/acl/role/remove',
}

// 获取全部角色
export const reqGetAllRoleList = (
  page: number,
  limit: number,
  roleName: string,
) => {
  return request<any, allroleList_res>({
    url: API.AllRoleList_Api + `/${page}/${limit}/?roleName=${roleName}`,
    method: 'get',
  })
}

// 添加角色
export const reqAddOrUpdateRole = (data: roleListRecords_obj) => {
  if (!data.id) {
    return request<any, any>({
      url: API.AddRole_Api,
      method: 'post',
      data,
    })
  } else {
    return request<any, any>({
      url: API.UpdateRole_Api,
      method: 'put',
      data,
    })
  }
}

// 根据角色获取授权的菜单权限与全部菜单权限
export const reqPermissionByRole = (roleId: number) => {
  return request<any, permissionByRole_res>({
    url: API.PermissionByRole_Api + `/${roleId}`,
    method: 'get',
  })
}
// 根据角色分配权限
export const reqSetPermissionByRole = (
  roleId: number,
  permissionId: number[],
) => {
  return request<any, any>({
    url:
      API.SetPermissionByRole_Api +
      `/?roleId=${roleId}&permissionId=${permissionId}`,
    method: 'post',
  })
}
// 删除已有角色
export const reqDeleteRole = (id: number) => {
  return request<any, any>({
    url: API.DeleteRole_Api + `/${id}`,
    method: 'delete',
  })
}
