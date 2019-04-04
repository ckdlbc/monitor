/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:39:45
 * @Last Modified by:   suliyu
 * @Last Modified time: 2018-08-29 21:39:45
 */
import * as UUID from 'uuidjs'
import { SYSTEM_EVENTS } from '../config/eventType'
import { cache } from './cache'

export class Session {
  constructor() {
    const data = {
      updatedTime: 0,
      // 打开会话时间
      sessionStartTime: 0,
      // 上一页停留时间
      previousStayTime: 0,
      // 当前页停留时间
      currentStayTime: 0,
      // 当前页进入时间
      entryTime: 0,
      // 首次访问应用时间
      persistedTime: this.getTime(),
      // 上一页url
      parentUrl: '/',
      // 当前页的referrer
      sessionReferrer: document.referrer
    }
    const { sessionReferrer, persistedTime, ...otherData } = data
    cache.storage.setOnce(otherData)
    cache.storage.set({
      sessionReferrer
    })
    cache.storage.setOnce({ persistedTime }, '')

    cache.monitor.onSpaChange(() => {
      cache.storage.set({
        sessionReferrer: document.URL
      })
    })
  }

  /**
   * 打开新会话
   */
  public startNewSession() {
    cache.storage.set({
      sessionUuid: UUID.generate(),
      sessionStartTime: this.getTime()
    })
    cache.monitor.emitSessionStart()
  }

  /**
   * 关闭当前会话
   */
  public closeCurrentSession() {
    const time = this.getTime() - 1
    const sessionStartTime = cache.storage.get('sessionStartTime')
    const sessionTotalLength = time - sessionStartTime
    if (sessionTotalLength >= 0) {
      cache.storage.set({
        sessionStartTime: time,
        sessionTotalLength
      })
      // 更新当前触发的时间
      cache.timeUpdate(SYSTEM_EVENTS.SESSION_CLOSE)
      cache.monitor.emitSessionClose()
    }
  }

  /**
   * 会话结束判断
   */
  public isSessionClose() {
    const sessionStartTime =
      (1 * Number(cache.storage.get('sessionStartTime'))) / 1000
    const updatedTime = (1 * Number(cache.storage.get('updatedTime'))) / 1000
    const nowDateTimeSe = (1 * this.getTime()) / 1000
    const isClose =
      sessionStartTime === 0 ||
      nowDateTimeSe >
        updatedTime + 60 * Number(cache.config.sessionIntervalMins) ||
      ''
    if (isClose) {
      // 当会话首次开始时，不用发送会话关闭事件
      if (sessionStartTime === 0) {
        this.startNewSession()
      } else {
        this.closeCurrentSession()
        this.startNewSession()
      }
    }
  }

  /**
   * 判断会话重新开启
   * 判断条件：会话首次开始、指定的一段时间内用户无事件操作、其它渠道进来
   */
  public sessionRestart(dataType?: string) {
    const hasDataType = !!dataType
    const entryTime = this.entryTimeUpdate(hasDataType)
    const currentStayTime = this.currentStayTimeUpdate(dataType)
    const previousStayTime = this.previousStayTimeUpdate(hasDataType)
    this.isSessionClose()
    // 更新本地的最后事件操作时间
    cache.storage.set({
      updatedTime: this.getTime(),
      previousStayTime,
      entryTime,
      currentStayTime
    })
  }

  /**
   * 当前时间
   */
  public getTime() {
    return new Date().getTime()
  }

  /**
   * 更新当前页进入时间
   * @param hasDataType
   */
  public entryTimeUpdate(hasDataType: boolean) {
    return hasDataType ? Number(cache.storage.get('entryTime')) : this.getTime()
  }

  /**
   * 更新当前页停留时间
   * @param hasDataType
   */
  public currentStayTimeUpdate(dataType?: string) {
    let currentStayTime = cache.storage.get('currentStayTime')
    if (!dataType) {
      currentStayTime = 0
    } else if (dataType !== 'pv') {
      currentStayTime = this.getTime() - this.entryTimeUpdate(!!dataType)
    }
    return currentStayTime
  }

  /**
   * 更新上一页停留时间
   * @param hasDataType
   */
  public previousStayTimeUpdate(hasDataType: boolean) {
    return hasDataType
      ? Number(cache.storage.get('previousStayTime'))
      : this.getTime() - Number(cache.storage.get('updatedTime'))
  }

  /**
   * 只有已访问页面后，sessionReferrer 重置
   * @param eventName
   */
  public sessionReferrerReset(eventName: string) {
    if (!cache.router.isSpa) {
      if (
        [SYSTEM_EVENTS.ACTIVATE, SYSTEM_EVENTS.SESSION_CLOSE].indexOf(
          eventName
        ) > 0
      ) {
        cache.storage.set({
          sessionReferrer: document.URL
        })
      }
    }
  }

  /**
   * 事件结束时的处理
   */
  public eventEnd() {
    const eventName = cache.eventName
    // 当触发的事件不是这些事件(sessionStart,sessionClose,activate)时，触发检测 session 方法
    if (
      ![
        SYSTEM_EVENTS.SESSION_START,
        SYSTEM_EVENTS.SESSION_CLOSE,
        SYSTEM_EVENTS.ACTIVATE
      ].includes(eventName)
    ) {
      this.sessionRestart(cache.dataType)
    }

    // 保存最后一次用户触发事件（除了会话事件以外）的事件id以及时间，通过这个时间确定会话关闭时的时间
    if (
      ![SYSTEM_EVENTS.SESSION_START, SYSTEM_EVENTS.SESSION_CLOSE].includes(
        eventName
      )
    ) {
      cache.storage.set({
        LASTEVENT: {
          eventName,
          time: cache.time
        }
      })
    }
  }
}
