/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:41:46
 * @Last Modified by:   suliyu
 * @Last Modified time: 2018-08-29 21:41:46
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
  cache.log.group('上报埋点')
  cache.log.log('埋点动作：', data.sys.eventName)
  cache.log.log('埋点数据：', data)
  cache.log.groupEnd()
  return instance({
    method,
    url,
    data
  }).then(() => {
    if (callback && isFunction(callback)) {
      callback()
    }
  })
}
export default sendRequest
