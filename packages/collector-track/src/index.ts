/*
 * @Author: suliyu 
 * @Date: 2018-08-29 21:41:58 
 * @Last Modified by:   suliyu 
 * @Last Modified time: 2018-08-29 21:41:58 
 */
import 'url-search-params-polyfill'
import { Collector } from './core/collector'
export { Collector as EventCollector } from './core/collector'

import { trackEvent } from './helper'
export * from './helper'
export { IEventConfig } from './config/plugin'

export default {
  Collector,
  trackEvent
}
