import request from '@/utils/request'
import {
  sku_obj,
  skuList_res,
  spu_recordsObj,
  spuAllSaleAttrList_res,
  spuImageList_res,
  spuRes,
  spuSaleAttrList_res,
  spuTrademark_res,
} from './type'

enum API {
  SpuList_Api = '/admin/product',
  TrademarkList_Api = '/admin/product/baseTrademark/getTrademarkList',
  SpuImgList_Api = '/admin/product/spuImageList',
  SpuSaleAttrList_Api = '/admin/product/spuSaleAttrList',
  SpuAllSaleAttrList_Api = '/admin/product/baseSaleAttrList',
  AddSpu_Api = '/admin/product/saveSpuInfo',
  UpdateSpu_Api = '/admin/product/updateSpuInfo',
  AddSku_Api = '/admin/product/saveSkuInfo',
  SkuList_Api = '/admin/product/findBySpuId',
  RemoveSpu_Api = '/admin/product/deleteSpu',
}
// 获取spu列表
export const reqGetSpuList = (
  page: number,
  limit: number,
  cate3Id: number | string,
) => {
  return request<any, spuRes>({
    url: API.SpuList_Api + `/${page}/${limit}?category3Id=${cate3Id}`,
    method: 'get',
  })
}
// 获取全部spu品牌
export const reqGetSpuTrademarkList = () => {
  return request<any, spuTrademark_res>({
    url: API.TrademarkList_Api,
    method: 'get',
  })
}
// 获取全部spu的sku图片
export const reqGetSpuImgList = (spuId: number) => {
  return request<any, spuImageList_res>({
    url: API.SpuImgList_Api + `/${spuId}`,
    method: 'get',
  })
}
// 获取已有spu的销售属性
export const reqGetSpuSaleAttrList = (spuId: number) => {
  return request<any, spuSaleAttrList_res>({
    url: API.SpuSaleAttrList_Api + `/${spuId}`,
    method: 'get',
  })
}
// 获取全部spu的销售属性
export const reqGetSpuAllSaleAttrList = () => {
  return request<any, spuAllSaleAttrList_res>({
    url: API.SpuAllSaleAttrList_Api,
    method: 'get',
  })
}
// 添加|更新spu
export const reqAddOrUpdateSpu = (data: spu_recordsObj) => {
  if (data.id) {
    return request<any, any>({
      url: API.UpdateSpu_Api,
      method: 'post',
      data,
    })
  } else {
    return request<any, any>({
      url: API.AddSpu_Api,
      method: 'post',
      data,
    })
  }
}

// 添加sku
export const reqAddSku = (data: sku_obj) => {
  return request<any, any>({
    url: API.AddSku_Api,
    method: 'post',
    data,
  })
}
// 获取sku列表
export const reqGetSkuList = (spuId: number) => {
  return request<any, skuList_res>({
    url: API.SkuList_Api + `/${spuId}`,
    method: 'get',
  })
}
// 删除sku
export const reqDeleteSpu = (spuId: number) => {
  return request<any, any>({
    url: API.RemoveSpu_Api + `/${spuId}`,
    method: 'delete',
  })
}
