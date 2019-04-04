/*
 * 监控 Vue.js
 * @Author: suliyu
 * @Date: 2018-08-29 18:00:25
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:49:38
 */
import { notifyError } from '../event/notifyError'

function formatComponentName(vm: any) {
  if (vm.$root === vm) {
    return 'root'
  }
  const name = vm._isVue
    ? (vm.$options && vm.$options.name) ||
      (vm.$options && vm.$options._componentTag)
    : vm.name
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options && vm.$options.__file
      ? ' at ' + (vm.$options && vm.$options.__file)
      : '')
  )
}

function errorHandler(err: Error, vm: any, info: string) {
  const componentName = formatComponentName(vm)
  const propsData = vm.$options && vm.$options.propsData
  notifyError(err, {
    metaData: {
      componentName,
      propsData,
      info
    }
  })
}

export function vueInstall(Vue: any) {
  if (Vue.config) {
    Vue.config.errorHandler = errorHandler
    Vue.prototype.$notifyError = notifyError
  }
}
