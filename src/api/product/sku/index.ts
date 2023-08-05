import request from '@/utils/request'
import { sku_res, skuinfo_res } from './type'

//
enum API {
  SkuList_Api = '/admin/product/list',
  CancelSale_Api = '/admin/product/cancelSale',
  OnSale_Api = '/admin/product/onSale',
  Skuinfo_Api = '/admin/product/getSkuInfo',
  DeleteSku_Api = '/admin/product/deleteSku',
}

// 获取sku列表
export const reqGetSkuInfoList = (page: number, limit: number) => {
  return request<any, sku_res>({
    url: API.SkuList_Api + `/${page}/${limit}`,
    method: 'get',
  })
}

// 上架商品
export const reqOnSale = (skuId: number) => {
  return request<any, any>({
    url: API.OnSale_Api + `/${skuId}`,
    method: 'get',
  })
}
// 下架商品
export const reqCancelSale = (skuId: number) => {
  return request<any, any>({
    url: API.CancelSale_Api + `/${skuId}`,
    method: 'get',
  })
}
// 获取sku详细信息
export const reqGetSkuInfo = (skuId: number) => {
  return request<any, skuinfo_res>({
    url: API.Skuinfo_Api + `/${skuId}`,
    method: 'get',
  })
}
// 删除sku
export const reqDeleteSku = (skuId: number) => {
  return request<any, any>({
    url: API.DeleteSku_Api + `/${skuId}`,
    method: 'delete',
  })
}
