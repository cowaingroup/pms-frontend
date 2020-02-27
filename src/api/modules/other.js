import {request} from '../request'
import {requestUrl} from '../requestUrl'

// 获取列表
export function getWarehouseList () {
  return request({
    url: requestUrl('/selectNav'),
    method: 'get'
  })
}
