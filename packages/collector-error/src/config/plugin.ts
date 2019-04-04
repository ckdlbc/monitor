/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:40:22
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:46:33
 */
const pkg = require('../../package.json')
import { notDev } from '@stark/utils/lib/client/env'

// 配置
export const CONFIG = {
  // 插件名称
  pluginName: pkg.name,
  version: pkg.version,
  debug: false
}

// 默认配置
export const DEFAULT_CONFIG: IErrorConfig = {
  uid: () => '',
  debug: notDev(),
  errorUrl: '',
  errorMethod: 'post'
}

export interface IErrorConfig {
  // 上报服务器的请求URL
  errorUrl: string
  // 用户clientId
  uid?: () => string
  // 是否启用调试模式 (默认值：false)
  debug?: boolean
  // 上报数据实现形式  (默认值：post)
  errorMethod?: string

  // 前端框架router实例
  router?: any
  // Vue构造器，用于对接Vue.config.errorHandler
  Vue?: any
}
