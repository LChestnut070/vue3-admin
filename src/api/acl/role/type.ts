// 返回数据类型(通用)
export interface roleRes_common {
  code: number
  message: string
  ok: boolean
}

// 当前角色与全部角色的对象
export interface roleListRecords_obj {
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null
  id?: number
}

// 全部角色的res
export interface allroleList_res extends roleRes_common {
  data: {
    records: roleListRecords_obj[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: true
    pages: number
  }
}
// 根据角色获取菜单权限data的对象
export interface permissionByRole_obj {
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children: permissionByRole_obj[]
  select: boolean
  id: number
}

// 根据角色获取菜单权限的res
export interface permissionByRole_res extends roleRes_common {
  data: permissionByRole_obj[]
}
