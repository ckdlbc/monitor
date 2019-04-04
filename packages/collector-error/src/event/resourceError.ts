/*
 * 自动捕获 资源请求错误
 * @Author: suliyu
 * @Date: 2018-08-23 16:59:35
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:49:28
 */
import { ERROR_TYPES, SEVERITY_TYPES } from '../config/error'
import cache from '../core/cache'

/**
 * 获取dom路径
 * @param options
 */
function getXPath(node: any) {
  const paths: any = []
  for (; node && node.nodeType == Node.ELEMENT_NODE; node = node.parentNode) {
    let sibling
    let _indentFirstLine = 0
    let _beforeLineChars = false
    sibling = node.previousSibling
    for (; sibling; sibling = sibling.previousSibling) {
      if (
        sibling.nodeType != Node.DOCUMENT_TYPE_NODE &&
        sibling.nodeName == node.nodeName
      ) {
        ++_indentFirstLine
      }
    }
    sibling = node.nextSibling
    for (; sibling && !_beforeLineChars; sibling = sibling.nextSibling) {
      if (sibling.nodeName == node.nodeName) {
        _beforeLineChars = true
      }
    }
    const tagName = (node.prefix ? `${node.prefix}:` : '') + node.localName
    const pathIndex =
      _indentFirstLine || _beforeLineChars ? `[${_indentFirstLine + 1}]` : ''
    paths.splice(0, 0, tagName + pathIndex)
  }
  return paths.length ? '/' + paths.join('/') : null
}

/**
 * 获取dom选择器
 * @param options
 */
function getSelector(options: any) {
  const self = []
  for (; options.parentNode; ) {
    if (options.id) {
      self.unshift(`#${options.id}`)
      break
    }
    if (options == options.ownerDocument.documentElement) {
      self.unshift(options.tagName)
    } else {
      let q = 1
      let p = options
      for (; p.previousElementSibling; p = p.previousElementSibling, q++) {}
      self.unshift(`${options.tagName}:nth-child(${q})`)
    }
    options = options.parentNode
  }
  return self.join(' > ')
}

/**
 * 捕获资源请求错误
 * 监听error事件
 * @param event
 */
export function resourceErrorListener(event?: any) {
  window.addEventListener(
    'error',
    function(e) {
      try {
        const options: any = e.target ? e.target : e.srcElement
        let outerHTML = options && options.outerHTML
        if (outerHTML && outerHTML.length > 200) {
          outerHTML = outerHTML.slice(0, 200)
        }
        const result = {
          errorType: ERROR_TYPES.RESOURCE_ERROR,
          severity: SEVERITY_TYPES.WARNING,
          outerHTML,
          src: options && options.src,
          tagName: options && options.tagName,
          id: options && options.id,
          className: options && options.className,
          name: options && options.name,
          // type: options && options.type,
          timeStamp: e.timeStamp,
          XPath: getXPath(options),
          selector: getSelector(options),
          status: '',
          statusText: ''
        }

        if (options.src === window.location.href) {
          return
        }
        if (
          options.src &&
          options.src.match(/.*\/(.*)$/) &&
          !options.src.match(/.*\/(.*)$/)[1]
        ) {
          return
        }
        if (result.src && (window as any).XMLHttpRequest) {
          const xhrHandshake = new XMLHttpRequest()
          ;(xhrHandshake as any).errorCollector = true
          xhrHandshake.open('HEAD', result.src)
          xhrHandshake.send()
          xhrHandshake.onload = function(res: any) {
            if (res && res.target && res.target.status !== 200) {
              result.status = res.target.status
              result.statusText = res.target.statusText
            }
            cache.monitor.emitError(result)
          }
        }
      } catch (error) {}
    },
    true
  )
}
