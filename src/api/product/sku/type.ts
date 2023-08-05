// spu通用
export interface skuRes_common {
  code: number
  message: string
  ok: boolean
}
// sku的平台属性对象
export interface skuAttrValueList_obj {
  id?: number
  attrId: number
  valueId: number
  attrName: string
  valueName: string
}

// sku的销售属性对象
export interface skuSaleAttrValueList_obj {
  id?: number
  saleAttrId: number | string
  saleAttrValueId: number | string
  saleAttrName: string
  saleAttrValueName: string
}

// 新增sku发送请求的类型
export interface skuRecords_obj {
  id: number
  isSale: number
  category3Id: number | string
  price: number | string
  skuDefaultImg: string
  skuDesc: string
  spuId: number | string
  tmId: number | string
  weight: string | string
  skuName: string
  skuAttrValueList: skuAttrValueList_obj[]
  skuSaleAttrValueList: skuSaleAttrValueList_obj[]
  skuImageList: skuImgList_obj[]
}

// sku列表的res
export interface sku_res extends skuRes_common {
  data: {
    records: skuRecords_obj[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// sku详细信息图片对象
export interface skuImgList_obj {
  id: number
  imgName: string
  imgUrl: string
  skuId: number
  createTime: string
  updateTime: string
  isDefalut: string
  spuImgId: number
}

export interface skuinfo_res extends skuRes_common {
  data: skuRecords_obj
}
