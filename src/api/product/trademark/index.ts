import request from '@/utils/request'
import type { trademarkRes, records } from './type'
enum API {
  GetTrademarkList_Api = '/admin/product/baseTrademark',
  AddTrademark_Api = '/admin/product/baseTrademark/save',
  UpdateTrademark_Api = '/admin/product/baseTrademark/update',
  DeleteTrademark_Api = '/admin/product/baseTrademark/remove',
}
// 获取品牌列表
export const reqGetTrademarkList = (page: number, limit: number) => {
  return request<any, trademarkRes>({
    url: API.GetTrademarkList_Api + `/${page}/${limit}`,
    method: 'get',
  })
}
// 新增|修改品牌
export const reqAddOrUpdateTrademark = (data: records) => {
  if (data.id) {
    // 如果有id代表修改
    return request<any, any>({
      url: API.UpdateTrademark_Api,
      method: 'put',
      data,
    })
  } else {
    // 没有id代表新增
    return request<any, any>({
      url: API.AddTrademark_Api,
      method: 'post',
      data,
    })
  }
}
// 删除品牌
export const reqDeleteTrademark = (id: number) => {
  return request<any, any>({
    url: API.DeleteTrademark_Api + `/${id}`,
    method: 'delete',
  })
}
