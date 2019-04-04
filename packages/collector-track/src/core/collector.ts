/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:41:19
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-17 17:40:58
 */
import BrowerCollector, {
  cache as collectCache
} from '@monitor/collector-brower'
import { Log } from '@stark/console'
import { isObject } from '@stark/utils/lib/basicType/isObject'
import { extend } from '@stark/utils/lib/methods/object'
import { CONFIG, DEFAULT_CONFIG, IEventConfig } from '../config/plugin'
import { vueInstall } from '../frame/vue'

import cache from '../core/cache'
import EventTrack from '../core/evenTrack'

export class Collector {
  // 实例使用的配置
  public config: { [key: string]: any } = {}
  // event实例
  public event!: EventTrack
  constructor(token: string, config?: IEventConfig) {
    if (cache.loaded) {
      return
    }
    cache.loaded = true
    // 全局单例缓存
    cache.instance = this

    this.setConfig(extend({}, DEFAULT_CONFIG, CONFIG, config, { token }))

    // 日志
    cache.log = new Log({
      appName: this.getConfig('pluginName'),
      debug: this.getConfig('debug')
    })
    // 更新设置
    cache.log.assert(!token, '请输入正确的token')

    // 实例化数据收集者
    cache.collector = new BrowerCollector.Collector(token, {
      router: this.getConfig('router')
    })

    const { monitor, storage } = collectCache
    cache.monitor = monitor
    cache.storage = storage

    // 实例化追踪事件对象
    this.event = new EventTrack()

    // 框架支持
    this.initFrame()

    // 启动数据收集
    cache.collector.start()
  }

  /**
   * 框架支持
   */
  public initFrame() {
    const Vue = this.getConfig('Vue')
    // 支持vue.js
    if (Vue) {
      vueInstall(Vue)
    }
  }

  /**
   * 设置配置
   * @param {Object} config
   */
  public setConfig(config: object) {
    if (isObject(config)) {
      this.config = extend(this.config, config)
      CONFIG.debug = CONFIG.debug || this.getConfig('debug')
    }
  }

  /**
   * 获取某个配置
   * @param {String} name
   */
  public getConfig(name: string) {
    return this.config[name]
  }
}
