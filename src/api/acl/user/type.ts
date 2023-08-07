// 返回数据类型(通用)
export interface userRes_common {
  code: number
  message: string
  ok: boolean
}

// 用户的records对象
export interface userRecords_obj {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: null
  roleName?: string
}

// 用户的res对象
export interface user_res extends userRes_common {
  data: {
    records: userRecords_obj[]
    total: number
    size: number
    current: number
    pages: number
  }
}

// 当前角色与全部角色的对象
export interface roles_obj {
  createTime: string
  updateTime: string
  roleName: string
  remark: null
  id: number
}

// 全部角色和当前角色res对象
export interface allroleList_res extends userRes_common {
  data: {
    assignRoles: roles_obj[]
    allRolesList: roles_obj[]
  }
}

// 设置用户角色
export interface setuserrole_req {
  userId: number
  roleIdList: number[]
}
