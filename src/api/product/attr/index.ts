import request from '@/utils/request'
import type { attrRes, attr_data, cateRes } from './type'

enum API {
  C1_Api = '/admin/product/getCategory1',
  C2_Api = '/admin/product/getCategory2',
  C3_Api = '/admin/product/getCategory3',
  Attr_Api = '/admin/product/attrInfoList/',
  AddOrUpdateAttr_Api = '/admin/product/saveAttrInfo',
  DeleteAttr_Api = '/admin/product/deleteAttr',
}
// 获取一级分类列表
export const reqGetCate1List = () => {
  return request<any, cateRes>({
    url: API.C1_Api,
    method: 'get',
  })
}
// 获取二级分类列表
export const reqGetCate2List = (cate1Id: number | string) => {
  return request<any, cateRes>({
    url: API.C2_Api + `/${cate1Id}`,
    method: 'get',
  })
}
// 获取三级分类列表
export const reqGetCate3List = (cate2Id: number | string) => {
  return request<any, cateRes>({
    url: API.C3_Api + `/${cate2Id}`,
    method: 'get',
  })
}
// 获取attr列表
export const reqGetAttrinfoList = (
  cate1Id: string | number,
  cate2Id: string | number,
  cate3Id: string | number,
) => {
  return request<any, attrRes>({
    url: API.Attr_Api + `${cate1Id}/${cate2Id}/${cate3Id}`,
    method: 'get',
  })
}
// 新增|修改attr
export const reqAddOrUpdateAttr = (data: attr_data) => {
  return request<any, any>({
    url: API.AddOrUpdateAttr_Api,
    method: 'post',
    data,
  })
}
// 删除attr
export const reqDeleteAttr = (attrId: number) => {
  return request<any, any>({
    url: API.DeleteAttr_Api + `/${attrId}`,
    method: 'delete',
  })
}
