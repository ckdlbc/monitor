/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:39:33
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:36:53
 */
import Storage from '@stark/storage'
import { EVENT_TYPES, SYSTEM_EVENTS } from '../config/eventType'
import { Monitor } from './monitor'
import { Router } from './router'
import { Session } from './session'

class Cache {
  // 是否已实例化
  public loaded: boolean = false
  public storage!: Storage
  public session!: Session
  public monitor!: Monitor
  public router!: Router
  public config: any
  // 当前触发的事件类型
  public dataType!: string
  // 当前触发的事件名称
  public eventName!: string
  // 事件触发时间
  public time!: number

  /**
   * 更新当前触发的事件类型
   * @param eventName
   */
  public dataTypeUpdate(eventName: string) {
    let dataType = EVENT_TYPES.BUSSINESS_EVENT_TYPE
    Object.values(SYSTEM_EVENTS).forEach(key => {
      if (key === eventName) {
        dataType = EVENT_TYPES.SYSTEM_EVENT_TYPE
      }
    })
    cache.dataType = dataType
  }

  /**
   * 更新当前触发的时间
   * @param eventName
   */
  public timeUpdate(eventName: string) {
    // 会话有时间差
    // 触发的事件若是会话结束，触发时间要重新设置
    // 若事件id为会话关闭，需要删除传入的自定义属性
    cache.time = eventName.includes(SYSTEM_EVENTS.SESSION_CLOSE)
      ? cache.storage.get('sessionCloseTime')
      : new Date().getTime()
  }
}

export const cache = new Cache()
