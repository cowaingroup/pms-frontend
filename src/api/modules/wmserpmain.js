import {request} from '../request'
import {requestUrl} from '../requestUrl'
import {requestParam} from '../requestParam'
import isInteger from 'lodash/isInteger'

// 获取列表
export function list (params) {
  return request({
    url: requestUrl('/wms/wmserpmain/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取信息
export function info (id) {
  return request({
    url: requestUrl('/wms/wmserpmain/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 添加
export function add (params) {
  return request({
    url: requestUrl('/wms/wmserpmain/save'),
    method: 'post',
    data: requestParam(params)
  })
}

// 修改
export function update (params) {
  return request({
    url: requestUrl('/wms/wmserpmain/update'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 删除
export function del (params) {
  return request({
    url: requestUrl('/wms/wmserpmain/delete'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 分配
export function allocate (params) {
  return request({
    url: requestUrl('/wms/wmserpmain/allocate'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 分配结果
export function allocateResult (params) {
  return request({
    url: requestUrl('/wms/wmserpmain/allocateResult'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 回传
export function returnErp (params) {
  return request({
    url: requestUrl('/wms/wmserpmain/returnErp'),
    method: 'post',
    data: requestParam(params, 'post')
  })
}
