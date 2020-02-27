import {request} from '../request'
import {requestUrl} from '../requestUrl'
import {requestParam} from '../requestParam'
import isInteger from 'lodash/isInteger'

// 获取列表
export function list (params) {
  return request({
    url: requestUrl('/wms/wmsmergedoc/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取信息
export function info (id) {
  return request({
    url: requestUrl('/wms/wmsmergedoc/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 添加
export function insertMerge (params) {
  return request({
    url: requestUrl('/wms/wmsmergedoc/insertMerge'),
    method: 'post',
    params: requestParam(params)
  })
}

// 添加
export function add (params) {
  return request({
    url: requestUrl('/wms/wmsmergedoc/save'),
    method: 'post',
    data: requestParam(params)
  })
}
// 执行入库
export function actIn (params) {
  return request({
    url: requestUrl('/wms/wmsmergedoc/actIn'),
    method: 'post',
    data: requestParam(params)
  })
}
// 修改
export function update (params) {
  return request({
    url: requestUrl('/wms/wmsmergedoc/update'),
    method: 'post',
    data: requestParam(params)
  })
}

// 删除
export function del (params) {
  return request({
    url: requestUrl('/wms/wmsmergedoc/delete'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}
