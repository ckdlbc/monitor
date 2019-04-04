declare global {
  interface Window {
    GoogleAnalyticsObject: any
    ga: any
  }
}
export default class GoogleAnalytics {
  constructor() {
    ;(function(i: any, s: any, o: any, g: any, r: any, a?: any, m?: any) {
      i.GoogleAnalyticsObject = r
      ;(i[r] =
        i[r] ||
        function() {
          ;(i[r].q = i[r].q || []).push(arguments)
        }),
        (i[r].l = 1 * Number(new Date()))
      ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
      a.async = 1
      a.src = g
      m.parentNode.insertBefore(a, m)
    })(
      window as any,
      document,
      'script',
      'https://www.google-analytics.com/analytics.js',
      'ga'
    )
    window.ga('create', 'UA-92072819-1', 'auto')
  }
  /**
   * 事件跟踪
   * https://developers.google.com/analytics/devguides/collection/analyticsjs/events?hl=zh-cn
   * @param eventCategory 通常是用户与之互动的对象（例如 'Video'）
   * @param eventAction 互动类型（例如 'play'）
   * @param eventLabel 用于对事件进行分类（例如 'Fall Campaign'）
   * @param eventValue 用于对事件进行分类（例如 'Fall Campaign'）
   */
  public sendEvent(
    eventCategory?: string,
    eventAction?: string,
    eventLabel?: string
  ) {
    if (window.ga) {
      window.ga('send', {
        hitType: 'event',
        eventCategory,
        eventAction,
        eventLabel
      })
    }
  }

  /**
   * pv统计
   */
  public trackPageview(url?: string) {
    if (window.ga) {
      window.ga('set', 'page', url || '')
      window.ga('send', 'pageview')
    }
  }
}
