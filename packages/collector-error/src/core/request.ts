/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:35:57
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:49:16
 */
import { isFunction } from '@stark/utils/lib/basicType/isFunction'
import axios from 'axios'
import cache from './cache'

const instance = axios.create()

const sendRequest = (
  url: string,
  method: string,
  data: any,
  callback?: () => void
) => {
  cache.log.group('上报错误')
  cache.log.error('错误动作：', data.err.errorType)
  cache.log.error('错误数据：', data)
  cache.log.groupEnd()
  return instance({
    method,
    url,
    data
  })
    .then(() => {
      if (callback && isFunction(callback)) {
        callback()
      }
    })
    .catch(err => {})
}
export default sendRequest
