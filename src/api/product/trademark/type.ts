// 返回数据类型(通用)
export interface trademarkRes_common {
  code: number
  message: string
  ok: boolean
}

// 已有品牌的records数据(获取与修改通用)
export interface records {
  id?: number
  tmName: string
  logoUrl: string
}
export type Records = records[]

// 定义品牌的数据类型
export interface trademarkRes extends trademarkRes_common {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
