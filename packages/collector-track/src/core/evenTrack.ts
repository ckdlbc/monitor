/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:41:43
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-02-18 16:48:43
 */
import { SYSTEM_EVENTS } from '@monitor/collector-brower'
import { isUndefined } from '@stark/utils/lib/basicType/isUndefined'
import { JSONDecode, JSONEncode } from '@stark/utils/lib/methods/json'
import { extend } from '@stark/utils/lib/methods/object'
import { CONFIG } from '../config/plugin'
import BaiduAnalytics from '../frame/ba'
import GoogleAnalytics from '../frame/ga'
import cache from './cache'
import sendRequest from './request'

export default class EventTrack {
  public ba!: BaiduAnalytics
  public ga!: GoogleAnalytics
  constructor() {
    this.initFrame()
    const frameTrack = this.frameTrack.bind(this)
    cache.monitor.onActivate(frameTrack)
    cache.monitor.onSessionStart(frameTrack)
    cache.monitor.onSessionClose(frameTrack)
    cache.monitor.onPv(frameTrack)
  }

  /**
   * 初始化第三方插件
   */
  public initFrame() {
    if (cache.instance.getConfig('ba').enabled) {
      this.ba = new BaiduAnalytics()
    }
    if (cache.instance.getConfig('ga').enabled) {
      this.ga = new GoogleAnalytics()
    }
  }

  /**
   *  第三方插件的pv事件绑定
   * @param eventName
   * @param properties
   * @param eventType
   */
  public frameTrack(eventName: string, properties?: any, eventType?: string) {
    this.trackEvent(eventName, properties, eventType)
    if (
      !cache.instance.getConfig('ga').enabled &&
      !cache.instance.getConfig('ba').enabled
    ) {
      return
    }
    if (eventName === SYSTEM_EVENTS.PV) {
      const url = window.location.pathname
      try {
        this.ba.trackPageview(url)
        this.ga.trackPageview(cache.collector.router.isSpa ? url : '')
      } catch (e) {}
    } else {
      const eventAction = (JSONDecode(JSONEncode(properties)) || {}).buttonName || {}
      const spm = new URLSearchParams(window.location.search).get('spm') || ''

      this.ba.sendEvent(eventName, eventAction, spm)
      this.ga.sendEvent(eventName, eventAction, spm)
    }
  }
  /**
   * 追踪事件（上报用户事件触发数据）
   * @param {String} eventName 事件名称（必须）
   * @param {Object} properties 事件属性
   * @param {String} eventType 自定义事件类型
   */
  public trackEvent(eventName: string, properties?: any, eventType?: string) {
    if (isUndefined(eventName)) {
      cache.log.error('上报数据需要一个事件名称')
      return
    }
    // 事件属性
    properties = properties || {}
    // 标记：传入的属性另存一份
    let userSetProperties = JSONDecode(JSONEncode(properties)) || {}

    // 设置通用的事件属性
    userSetProperties = extend({}, userSetProperties)

    // 用户clientId
    const uid = cache.instance.getConfig('uid')()
    // spm
    const params = new URLSearchParams(window.location.search)
    const spm = params.get('spm')

    // 系统上报数据
    const sysData = {
      // sdk类型 （js，小程序、安卓、IOS、server、pc）
      sdkType: 'js',
      // 引入的sdk版本
      sdkVersion: CONFIG.version,
      // 页面打开场景, 默认 Browser
      pageOpenScene: 'Browser',
      // 用户clientID
      uid,
      spm
    }
    // 合并客户端信息
    const sys = extend(
      {},
      sysData,
      cache.collector.getData(eventName, properties)
    )
    // 事件自定义属性
    const ext = userSetProperties

    const truncatedData = { sys, ext }

    const url = cache.instance.getConfig('eventUrl')
    const method = cache.instance.getConfig('eventMethod')

    sendRequest(url, method, truncatedData)
  }
}
