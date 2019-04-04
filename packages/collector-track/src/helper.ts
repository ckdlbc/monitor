/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:41:55
 * @Last Modified by:   suliyu
 * @Last Modified time: 2018-08-29 21:41:55
 */
import { isObject } from '@stark/utils/lib/basicType/isObject'
import cache from './core/cache'
/**
 * 追踪事件（上报用户事件触发数据）
 * 可使用装饰器
 * @param {String} eventName 事件名称（必须）
 * @param {Function} vmFnProperties 事件属性函数或对象
 */
export const trackEvent = (
  eventName: string,
  vmFnProperties?: ((vm: any) => any) | ({ [key: string]: any })
) => {
  if (cache.loaded) {
    const properties = isObject(vmFnProperties) ? vmFnProperties : {}
    cache.instance.event.frameTrack(eventName, properties)
  }
  return (target: any, property: string, descriptor: PropertyDescriptor) => {
    const oldValue = descriptor.value
    descriptor.value = function() {
      let properties = {}
      if (typeof vmFnProperties === 'function') {
        const fn = vmFnProperties as (vm: any) => any
        properties = fn(this)
      }
      cache.instance.event.frameTrack(eventName, properties)
      return oldValue.apply(this, arguments)
    }
  }
}
