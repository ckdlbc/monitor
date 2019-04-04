/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:39:42
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:42:44
 */
import { isObject } from '@stark/utils/lib/basicType/isObject'
import { cache } from './cache'
import { Collector } from './collector'
import { spa } from './spa'

export class Router {
  // 路由模式
  public mode: string = 'history'
  // 框架router实例
  public router: any
  // collector
  public collector!: Collector
  // 是否为spa
  public isSpa: boolean = false
  constructor(router: any, collector: Collector) {
    this.collector = collector
    this.router = router
    this.identifyRoute()
  }

  /**
   * 自动识别路由
   */
  private identifyRoute() {
    if (this.isVue()) {
      this.mode = this.router.mode || this.mode
      this.isSpa = true
      this.detectionRoute()
      this.spaInit()
    }
  }

  /**
   * 检测路由变化
   */
  private detectionRoute() {
    this.router.beforeEach((to: any, from: any, next: any) => {
      const { matched } = to
      let routeRule = ''
      if (matched[matched.length - 1]) {
        routeRule = (matched[matched.length - 1].path || '/').split(':')[0]
        routeRule =
          routeRule[routeRule.length - 1] === '/'
            ? routeRule.slice(0, routeRule.length - 1)
            : routeRule
      }
      const parentUrl = window.location.href
      routeRule = `${window.location.origin}${
        this.router.mode === 'hash' ? '/#' : ''
      }${routeRule}`
      cache.storage.set({
        routeRule,
        parentUrl
      })
      next()
    })
  }

  /**
   * 是否为 vue router
   */
  private isVue() {
    return (
      this.router &&
      this.router.apps &&
      this.router.options &&
      this.router.mode &&
      isObject(this.router.currentRoute)
    )
  }

  /**
   * 单页面应用
   * 影响PV
   */
  private spaInit() {
    spa.init({
      mode: this.mode,
      callbackFn: () => cache.monitor.emitPv()
    })
  }
}
