declare global {
  interface Window {
    _hmt: any
  }
}

export default class BaiduAnalytics {
  constructor() {
    if (document) {
      const hm = document.createElement('script')
      hm.src = 'https://hm.baidu.com/hm.js?619b45b0c73f1fc71cef1c20bd2185bb'
      const s = document.getElementsByTagName('script')[0]
      if (s.parentNode) {
        s.parentNode.insertBefore(hm, s)
      }
    }
  }
  /**
   * 事件跟踪
   * https://tongji.baidu.com/web/help/article?id=236&type=0
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
    if (window._hmt) {
      window._hmt.push(['_trackEvent', eventCategory, eventAction, eventLabel])
    }
  }
  /**
   * pv统计
   */
  public trackPageview(url: string) {
    if ((window._hmt as any) && url) {
      window._hmt.push(['_trackPageview', url])
    }
  }
}
