/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:39:53
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:43:27
 */
import { isFunction } from '@stark/utils/lib/basicType/isFunction'
import { extend } from '@stark/utils/lib/methods/object'
import { cache } from './cache'
import registerHashEvent from './registerHashEvent'

function getPath() {
  return location.pathname + location.search
}

function on(obj: any, event: string, cb: () => void) {
  if (obj[event]) {
    const fn = obj[event]
    obj[event] = function() {
      const args = Array.prototype.slice.call(arguments)
      cb.apply(this, args as any)
      fn.apply(this, args)
    }
  } else {
    obj[event] = function() {
      const args = Array.prototype.slice.call(arguments)
      cb.apply(this, args as any)
    }
  }
}

class Spa {
  public config: any
  public path: string = ''
  public url: string = ''

  constructor() {
    this.config = {
      mode: 'hash',
      trackReplaceState: false,
      callback: () => {}
    }
  }

  public init(config: any) {
    this.config = extend(this.config, config || {})
    this.path = getPath()
    this.url = document.URL
    this.event()
  }

  public event() {
    if (this.config.mode === 'history') {
      if (!history.pushState || !window.addEventListener) {
        return
      }
      on(history, 'pushState', this.pushStateOverride.bind(this))
      on(history, 'replaceState', this.replaceStateOverride.bind(this))
      window.addEventListener('popstate', this.handlePopState.bind(this))
    } else if (this.config.mode === 'hash') {
      registerHashEvent(this.handleHashState.bind(this))
      on(history, 'pushState', this.handleHashState.bind(this))
    }
  }

  public pushStateOverride() {
    this.handleUrlChange(true)
  }
  public replaceStateOverride() {
    this.handleUrlChange(false)
  }
  public handlePopState() {
    this.handleUrlChange(true)
  }
  public handleHashState() {
    this.handleUrlChange(true)
  }

  public handleUrlChange(historyDidUpdate: boolean) {
    // setTimeout(() => {
    if (this.config.mode === 'hash') {
      if (isFunction(this.config.callbackFn)) {
        this.config.callbackFn.call()
        cache.monitor.emitSpaChange({
          oldUrl: this.url,
          nowUrl: document.URL
        })
        this.url = document.URL
      }
    } else if (this.config.mode === 'history') {
      const oldPath = this.path
      const newPath = getPath()
      if (oldPath !== newPath && this.shouldTrackUrlChange(newPath, oldPath)) {
        this.path = newPath
        if (historyDidUpdate || this.config.trackReplaceState) {
          if (typeof this.config.callbackFn === 'function') {
            this.config.callbackFn.call()
            cache.monitor.emitSpaChange({
              oldUrl: this.url,
              nowUrl: document.URL
            })
            this.url = document.URL
          }
        }
      }
    }
    // }, 0)
  }

  public shouldTrackUrlChange(newPath: string, oldPath: string) {
    return !!(newPath && oldPath)
  }
}

export const spa = new Spa()
