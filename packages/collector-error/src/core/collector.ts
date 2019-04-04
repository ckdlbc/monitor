/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:40:27
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:48:58
 */
import BrowerCollector, {
  cache as collectCache
} from '@monitor/collector-brower'
import { Log } from '@stark/console'
import { isObject } from '@stark/utils/lib/basicType/isObject'
import { extend } from '@stark/utils/lib/methods/object'
import { CONFIG, DEFAULT_CONFIG, IErrorConfig } from '../config/plugin'
import { HttpError } from '../event/httpError'
import { notifyError } from '../event/notifyError'
import { resourceErrorListener } from '../event/resourceError'
import { uncaughtHandle } from '../event/uncaught'
import { promiseListener } from '../event/unhandledrejection'
import { vueInstall } from '../frame/vue'
import cache from './cache'
import graphqlClient from './graphql'

export class Collector {
  constructor(token: string, config?: IErrorConfig) {
    if (cache.loaded) {
      return
    }
    cache.loaded = true

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

    const { monitor } = collectCache
    cache.monitor = monitor
    cache.monitor.onError(this.log.bind(this))

    const httpError = new HttpError()
    resourceErrorListener()
    uncaughtHandle()
    promiseListener()

    this.initFrame()

    // 启动数据收集
    cache.collector.start()
    ;(window as any).notifyError = notifyError
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
   * log请求
   * @param eventName
   * @param params
   */
  public log(eventName: string, params: any) {
    const { errorType, ext, ...info } = params
    const data = {
      ext: ext || {},
      err: {
        errorType,
        info
      },
      sys: cache.collector.getData(eventName)
    }
    const url = this.getConfig('errorUrl')
    //  const method = this.getConfig('errorMethod')
    // sendRequest(url, method, data)
    graphqlClient(url, errorType, data)
  }

  /**
   * 设置配置
   * @param {Object} config
   */
  public setConfig(config: object) {
    if (isObject(config)) {
      cache.config = extend(cache.config, config)
      CONFIG.debug = CONFIG.debug || this.getConfig('debug')
    }
  }

  /**
   * 获取某个配置
   * @param {String} name
   */
  public getConfig(name: string) {
    return cache.config[name]
  }
}
