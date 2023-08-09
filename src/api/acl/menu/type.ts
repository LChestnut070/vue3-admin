// 返回数据类型(通用)
export interface roleRes_common {
  code: number
  message: string
  ok: boolean
}
// 根据角色获取菜单权限data的对象
export interface allPermission_obj {
  createTime?: string
  updateTime?: string
  pid: number
  name: string
  code: string
  toCode?: string
  type?: number
  status?: null
  level: number
  children?: allPermission_obj[]
  select?: boolean
  id?: number
}
// 获取菜单权限的res
export interface allPermission_res extends roleRes_common {
  data: allPermission_obj[]
}
// 发请求需要的参数类型
export interface allPermission_req {
  pid: number
  name: string
  code: string
  level: number
  id?: number
}
