/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:41:13
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-22 10:35:05
 */
const pkg = require('../../package.json')
export const isPro = (
  process.env.VUE_APP_ENV ||
  process.env.NODE_ENV ||
  ''
).includes('pro')
export interface IEventConfig {
  // 上报服务器的请求URL
  eventUrl: string
  // 用户clientId
  uid?: () => string
  // 是否启用调试模式 (默认值：false)
  debug?: boolean
  // 上报数据实现形式  (默认值：post)
  eventMethod?: string

  // 前端框架router实例
  router?: any
  // Vue构造器，用于对接Vue.config.errorHandler
  Vue?: any

  // 百度统计
  ba?: {
    // 是否启用
    enabled?: boolean
  }

  // 谷歌统计
  ga?: {
    // 是否启用
    enabled?: boolean
  }
}

// 配置
export const CONFIG = {
  // 插件名称
  pluginName: pkg.name,
  version: pkg.version,
  debug: false
}

// 默认配置
export const DEFAULT_CONFIG: IEventConfig = {
  uid: () => '',
  debug: false,
  eventUrl: '',
  eventMethod: 'post',
  ba: {
    enabled: isPro
  },
  ga: {
    enabled: isPro
  }
}
