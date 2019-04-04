/*
 * 自动捕获 http请求错误
 * @Author: suliyu
 * @Date: 2018-08-29 00:05:30
 * @Last Modified by: suliyu
 * @Last Modified time: 2018-12-27 11:49:48
 */
import { ERROR_TYPES, SEVERITY_TYPES } from '../config/error'
import cache from '../core/cache'

export class HttpError {
  /**
   * xhr 数据处理
   * @param e
   */
  public static statusHandle(e: any) {
    return !(
      (e.detail.status === 0 && /^file:\/\/\//.test(e.detail.url)) ||
      parseInt((e.detail.status / 100).toString(), 0) === 2
    )
  }
  // 当前xhr的请求url
  private static url: string
  // 当前xhr的请求方法
  private static method: string
  // 当前xhr的请求时间
  private static time: number
  /**
   * 数据最终集合处理
   * @param request
   * @param response
   * @param node
   */
  private static resolve(request: any, response: any, node?: any) {
    const params = {
      errorType: ERROR_TYPES.HTTP_ERROR,
      severity: SEVERITY_TYPES.ERROR,
      req: request,
      res: response
      // user: node && node.user,
      // metaData: node && node.metaData
    }
    if (request.url === cache.config.errorUrl) {
      return
    }
    cache.monitor.emitError(params)
  }

  public XMLHttpRequest: any
  public events: string[]
  constructor(config?: any) {
    this.events = [
      'readystatechange',
      'error',
      'timeout',
      'loadstart',
      'loadend'
    ]

    this.XMLHttpRequest = XMLHttpRequest as any
    this.xhrReset()
    this.fetchReset()
  }

  /**
   * 重写 XMLHttpRequest
   */
  public xhrReset() {
    const that = this
    ;(window as any).XMLHttpRequest = function() {
      const xhr = new that.XMLHttpRequest()
      // 重写 xhr.open方法
      that.openReset(xhr)
      // 监听xhr状态
      that.events.forEach((event: string) =>
        xhr.addEventListener(event, that.xhrType)
      )
      return xhr
    }
  }

  /**
   * 重写 xhr.open方法
   * 为了获取请求方法、url、请求时间
   * @param data
   * @param t
   */
  public openReset(xhr: any) {
    const oldXhr = xhr.open
    xhr.open = function(method: any, url: string) {
      try {
        HttpError.method = method
        HttpError.url = url
        HttpError.time = new Date().getTime()
        oldXhr.apply(this, arguments)
      } catch (r) {
        if (oldXhr) {
          oldXhr.apply(this, arguments)
        }
      }
    }
  }

  /**
   * xhr统一监听的事件
   * @param event
   */
  public xhrType(event: any) {
    const xhr = event.target
    const originalCallback = xhr.onreadystatechange
    if (['readystatechange', 'error', 'timeout'].includes(event.type)) {
      try {
        if (xhr.readyState === 4 && !xhr.errorCollector) {
          const elapsedTime = new Date().getTime() - HttpError.time
          const params = {
            type: 'XMLHttpRequest',
            page: {
              url: (window as any).location.href
            },
            detail: {
              method: HttpError.method,
              url: xhr.responseURL || HttpError.url,
              status: xhr.status,
              statusText: xhr.statusText
            },
            elapsedTime,
            time: HttpError.time
          }
          if (HttpError.statusHandle(params)) {
            HttpError.resolve(
              {
                method: params.detail.method,
                url: params.detail.url
              },
              {
                status: xhr.status,
                statusText: xhr.statusText,
                response: xhr.response,
                elapsedTime
              }
            )
          }
          if (originalCallback) {
            originalCallback.apply(this, arguments)
          }
        }
      } catch (error) {
        if (originalCallback) {
          originalCallback.apply(this, arguments)
        }
      }
    }
  }

  /**
   * 重写 fetch
   */
  public fetchReset() {
    const oldFetch = window.fetch
    ;(window as any).fetch = function(
      input?: Request | string,
      options?: RequestInit
    ) {
      HttpError.time = new Date().getTime()
      return oldFetch
        .apply(this, arguments as any)
        .then(async (response: any) => {
          const elapsedTime = new Date().getTime() - HttpError.time
          const params = {
            type: 'fetch',
            page: {
              url: window.location.href,
              title: document.title
            },
            detail: {
              method: (options && options.method) || 'GET',
              url: response.url,
              status: response.status,
              statusText: response.statusText
            },
            elapsedTime,
            time: HttpError.time
          }
          if (HttpError.statusHandle(params)) {
            HttpError.resolve(
              {
                method: params.detail.method,
                url: params.detail.url
              },
              {
                status: response.status,
                statusText: response.statusText,
                response: response.text && (await response.text()),
                elapsedTime
              }
            )
          }
        })
    }
  }
}
