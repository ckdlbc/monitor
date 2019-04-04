/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:39:04
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:42:01
 */
import EventEmitter from '@stark/eventEmitter'
import { SYSTEM_EVENTS } from '../config/eventType'
import { cache } from './cache'

type EventFn = (...arg: any[]) => any
export class Monitor extends EventEmitter {
  // public eventEmitter!: EventEmitter
  constructor() {
    super()
    // this.eventEmitter = new EventEmitter()
  }

  /**
   * 默认监听事件
   */
  public start() {
    this.emitPv()
  }

  /**
   * 触发 打开新会话
   */
  public emitSessionStart(...arg: any[]) {
    this.emit(SYSTEM_EVENTS.SESSION_START, ...arg)
  }
  /**
   * 监听 打开新会话
   */
  public onSessionStart(fn: EventFn) {
    this.on(SYSTEM_EVENTS.SESSION_START, fn)
  }

  /**
   * 触发 关闭会话
   */
  public emitSessionClose(...arg: any[]) {
    this.emit(SYSTEM_EVENTS.SESSION_CLOSE, ...arg)
  }
  /**
   * 监听 关闭会话
   */
  public onSessionClose(fn: EventFn) {
    this.on(SYSTEM_EVENTS.SESSION_CLOSE, fn)
  }

  /**
   * 触发 pv
   */
  public emitPv(...arg: any[]) {
    cache.session.sessionRestart()
    this.emit(SYSTEM_EVENTS.PV, ...arg)
  }
  /**
   * 监听 pv
   */
  public onPv(fn: EventFn) {
    this.on(SYSTEM_EVENTS.PV, fn)
  }

  /**
   * 触发 用户首次访问
   */
  public emitActivate(...arg: any[]) {
    this.emit(SYSTEM_EVENTS.ACTIVATE, ...arg)
  }
  /**
   * 监听 用户首次访问
   */
  public onActivate(fn: EventFn) {
    this.on(SYSTEM_EVENTS.ACTIVATE, fn)
  }

  /**
   * 触发 spa变更
   */
  public emitSpaChange(...arg: any[]) {
    this.emit(SYSTEM_EVENTS.SPA_CHANGE, ...arg)
  }
  /**
   * 监听 spa变更
   */
  public onSpaChange(fn: EventFn) {
    this.on(SYSTEM_EVENTS.SPA_CHANGE, fn)
  }

  /**
   * 触发 错误监控
   */
  public emitError(...arg: any[]) {
    this.emit(SYSTEM_EVENTS.ERROR, ...arg)
  }
  /**
   * 监听 错误监控
   */
  public onError(fn: EventFn) {
    this.on(SYSTEM_EVENTS.ERROR, fn)
  }
}
