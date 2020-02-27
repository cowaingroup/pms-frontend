import {request} from '../request'
import {requestUrl} from '../requestUrl'
import {requestParam} from '../requestParam'
import isInteger from 'lodash/isInteger'
import http from '@/utils/httpRequest'

// 获取列表
export function list (params) {
  return request({
    url: requestUrl('/wms/wmsindoc/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取信息
export function info (id) {
  return request({
    url: requestUrl('/wms/wmsindoc/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 添加
export function actIn (params) {
  return request({
    url: requestUrl('/wms/wmsindoc/actIn'),
    method: 'post',
    data: requestParam(params)
  })
}
//推荐库位
export function allocate (params) {
  return request({
    url: requestUrl('/wms/wmsindoc/alloLocation'),
    method: 'post',
    data: requestParam(params)
  })
}

// 修改
export function update (params) {
  return request({
    url: requestUrl('/wms/wmsindoc/update'),
    method: 'post',
    data: requestParam(params)
  })
}

// 删除
export function del (params) {
  return request({
    url: requestUrl('/wms/wmsindoc/deleteIn'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 回传
export function returnErp (params) {
  return request({
    url: requestUrl('/wms/wmsindoc/returnErp'),
    method: 'post',
    data: requestParam(params, 'post')
  })
}


// 导出数据
export function downloadExcel (params) {
  return http({
    url: requestUrl('/wms/wmsindoc/exportExcel'),
    method: 'post',
    params: requestParam(params, 'get'),
    responseType: 'blob'
  })
}
