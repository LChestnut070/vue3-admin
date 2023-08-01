// 返回数据类型(通用)
export interface cateRes_common {
  code: number
  message: string
  ok: boolean
}

// 分类的数组data的对象数据类型
export interface cateObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

// 分类的数组data数据
export interface cateRes extends cateRes_common {
  data: cateObj[]
}

//attr列表的数据
export interface attr_data {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: attrValueList
}

//数组attrvaluelist列表的数据
export interface attrValue {
  attrId?: number
  valueName: string
  id?: number
  // 控制编辑模式与查看模式的开关
  flag?: boolean
}

// attrvalue的列表
export type attrValueList = attrValue[]
// attr列表
export type attrList = attr_data[]
// attr的数据类型
export interface attrRes extends cateRes_common {
  data: attr_data[]
}
