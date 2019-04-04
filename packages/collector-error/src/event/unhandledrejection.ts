/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:40:39
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:49:31
 */
import { ERROR_TYPES } from '../config/error'
import cache from '../core/cache'
export function promiseListener() {
  if (window.addEventListener) {
    window.addEventListener('unhandledrejection', (data: any) => {
      const reason = (data && data.reason) || ''
      try {
        const params = {
          errorType: ERROR_TYPES.UNHANDLEDREJECTION,
          name: ERROR_TYPES.UNHANDLEDREJECTION,
          message: JSON.stringify(reason),
          timeStamp: data && data.timeStamp
        }
        cache.monitor.emitError(params)
      } catch (err) {
        console.error(err)
      }
    })
  }
}
