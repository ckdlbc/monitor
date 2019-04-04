/*
 * @Author: suliyu 
 * @Date: 2018-08-29 21:41:49 
 * @Last Modified by:   suliyu 
 * @Last Modified time: 2018-08-29 21:41:49 
 */
import { trackEvent } from '../helper'

export function vueInstall(Vue: any) {
  Vue.prototype.$trackEvent = trackEvent
}
