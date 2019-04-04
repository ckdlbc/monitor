/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:38:00
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:39:14
 */
import Storage from '@stark/storage'
import { isFunction } from '@stark/utils/lib/basicType/isFunction'
import { extend } from '@stark/utils/lib/methods/object'
import * as UUID from 'uuidjs'
import { IBrowerConfig } from '../config/plugin'
import { domain, getClientInfo } from '../source/client'
import { cache } from './cache'
import { Monitor } from './monitor'
import { Router } from './router'
import { Session } from './session'

export class Collector {
  public router!: Router

  constructor(token: string, config?: IBrowerConfig) {
    // 防止多实例
    if ((window as any).browerCollector) {
      return (window as any).browerCollector
    }
    cache.config = { ...config, token }
    // 创建全局事件监听者
    cache.monitor = new Monitor()
    cache.storage = new Storage(token)
    ;(window as any).browerCollector = this
  }

  /**
   * 启动数据收集
   */
  public start() {
    if (cache.loaded) {
      return
    }
    cache.loaded = true
    // 创建session实例
    cache.session = new Session()
    // 创建框架Router实例
    this.router = cache.router = new Router(cache.config.router, this)
    // 开始监听
    cache.monitor.start()
    // 设置设备凭证
    this.setDeviceId()
  }

  /**
   * 获取唯一凭证（设备标记）
   */
  public getDeviceId() {
    return cache.storage.get('deviceId')
  }

  /**
   * 设置本地设备凭证
   * 若是首次访问（本地无设备凭证），上报用户首次访问网站事件
   */
  public setDeviceId() {
    if (!this.getDeviceId()) {
      // 生成凭证
      cache.storage.setOnce({ deviceId: UUID.generate() }, '')
      // 检测用户首次访问
      cache.monitor.emitActivate()
    }
  }

  /**
   * 收集的数据
   * @param eventName
   * @param properties
   */
  public getData(eventName: string, properties?: any) {
    // 重新在本地取数据读取到缓存
    cache.storage.load()
    // 当前触发的事件名称
    cache.eventName = eventName
    // 更新当前触发的时间
    cache.timeUpdate(eventName)
    // 更新当前触发的事件类型
    cache.dataTypeUpdate(eventName)
    // 用户clientId
    const uid = isFunction(cache.config.uid) ? cache.config.uid() : ''
    const sysData = {
      // 事件名称
      eventName,
      // 事件类型，se:系统事件，be:业务事件
      dataType: cache.dataType,
      // 事件触发时间
      time: cache.time,
      // 用户首次访问时间
      persistedTime: cache.storage.get('persistedTime'),
      // 客户端唯一凭证(设备凭证)
      deviceId: this.getDeviceId(),
      // 应用凭证
      token: cache.config.token,
      // 用户clientId
      uid,
      // 当前关闭的会话时长
      sessionTotalLength: cache.storage.get('sessionTotalLength'),
      // 当前会话id
      sessionUuid: cache.storage.get('sessionUuid'),
      // 当前页停留时间
      currentStayTime: cache.storage.get('currentStayTime'),
      // 上一页停留时间
      previousStayTime: cache.storage.get('previousStayTime'),
      // 当前页进入时间
      entryTime: cache.storage.get('entryTime'),
      // 上一页url
      parentUrl: cache.storage.get('parentUrl'),
      // 页面url
      currentUrl:
        cache.storage.get('routeRule') || window.location.href.split('?')[0]
    }
    // 合并客户端信息
    const sys = extend({}, sysData, getClientInfo())

    // 只有已访问页面后，sessionReferrer 重置
    cache.session.sessionReferrerReset(eventName)

    // 当启动单页面后，切换页面，refer为空，此时做处理
    if (cache.router.isSpa) {
      const sessionReferrer = cache.storage.get('sessionReferrer')
      if (sessionReferrer !== sys.referrer) {
        sys.referrer = sessionReferrer
        sys.referringDomain = domain(sessionReferrer)
      }
    }
    // 事件结束后的处理
    cache.session.eventEnd()

    return sys
  }
}
