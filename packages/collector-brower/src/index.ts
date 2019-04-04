/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:40:10
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:44:35
 */
export { domain, getClientInfo } from './source/client'
import { Collector } from './core/collector'
export { Collector as BrowerCollector } from './core/collector'
export { Monitor } from './core/monitor'

export * from './core/cache'
export * from './config/eventType'
export { IBrowerConfig } from './config/plugin'

export default {
  Collector
}
