// spu通用
export interface spuRes_common {
  code: number
  message: string
  ok: boolean
}
// spu返回数据类型
export interface spuRes extends spuRes_common {
  data: {
    current: number
    pages: number
    records: spu_recordsArr
    searchCount: boolean
    size: number
    total: number
  }
}

// records数组
export type spu_recordsArr = spu_recordsObj[]

// records对象
export interface spu_recordsObj {
  category3Id: number | string
  description: string
  id?: number
  // 照片墙数组
  spuImageList: null | spuImageList_obj[]
  spuName: string
  // 销售属性列表数组
  spuSaleAttrList: null | spuSaleAttrList_obj[]
  // 品牌id
  tmId: number | string
}

// spu的品牌data对象
export interface spuTrademark_obj {
  id: number
  tmName: string
  logoUrl: string
}
// spu的品牌res类型
export interface spuTrademark_res extends spuRes_common {
  data: spuTrademark_obj[]
}

// spuImageList对象
export interface spuImageList_obj {
  id?: number
  imgName?: string
  imgUrl?: string
  spuId?: number
  createTime?: string
  updateTime?: string
  name?: string
  url?: string
  isDefalut?: boolean
}

// spuImageList的res类型
export interface spuImageList_res extends spuRes_common {
  data: spuImageList_obj[]
}

// 已有spu销售属性res类型
export interface spuSaleAttrList_res extends spuRes_common {
  data: spuSaleAttrList_obj[]
}

// 已有spu销售属性对象
export interface spuSaleAttrList_obj {
  baseSaleAttrId: number | string
  id?: number
  saleAttrName: string
  spuId?: number
  spuSaleAttrValueList: spuSaleAttrValueList_arr
  createTime?: string
  updateTime?: string
  flag?: boolean
  saleAttrValue?: string
  attrIdAndValueId?: string
}

// 已有spu销售属性值数组
export type spuSaleAttrValueList_arr = spuSaleAttrValueList_obj[]

// 已有spu销售属性值对象
export interface spuSaleAttrValueList_obj {
  baseSaleAttrId: number
  id?: number
  isChecked?: string
  saleAttrName?: string
  saleAttrValueName: string
  spuId?: number
  createTime?: string
  updateTime?: string
}

// 全部spu销售属性res类型
export interface spuAllSaleAttrList_res extends spuRes_common {
  data: spuAllSaleAttrList_obj[]
}
// 全部spu销售属性res
export interface spuAllSaleAttrList_obj {
  id: number | string
  name: string | string
}

// sku的平台属性对象
export interface skuAttrValueList_obj {
  attrId: number
  valueId: number
}

// sku的平台属性数组
export type skuAttrValueList_arr = skuAttrValueList_obj[]

// sku的销售属性对象
export interface skuSaleAttrValueList_obj {
  saleAttrId: number | string
  saleAttrValueId: number | string
}

// sku的销售属性数组
export type skuSaleAttrValueList_arr = skuSaleAttrValueList_obj[]

// 新增sku发送请求的类型
export interface sku_obj {
  category3Id: number | string
  price: number | string
  skuDefaultImg: string
  skuDesc: string
  spuId: number | string
  tmId: number | string
  weight: string | string
  skuName: string
  // sku平台属性
  skuAttrValueList: skuAttrValueList_arr
  // sku图片列表
  // skuImageList: skuImgList_arr
  // sku销售属性
  skuSaleAttrValueList: skuSaleAttrValueList_arr
}

// sku列表的res
export interface skuList_res extends spuRes_common {
  data: sku_obj[]
}
