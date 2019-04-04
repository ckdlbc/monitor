/*
 * @Author: suliyu 
 * @Date: 2018-08-29 21:40:20 
 * @Last Modified by:   suliyu 
 * @Last Modified time: 2018-08-29 21:40:20 
 */
/**
 * 错误事件类型
 */
export const ERROR_TYPES = {
  // 手动发送的错误
  CAUGHT: 'caught',
  // js 错误
  UNCAUGHT: 'uncaught',
  // 资源加载错误
  RESOURCE_ERROR: 'resourceError',
  // 请求错误
  HTTP_ERROR: 'httpError',
  // 未 catch 处理的 Promise 错误
  UNHANDLEDREJECTION: 'unhandledrejection'
}

/**
 * 错误级别
 */
export const SEVERITY_TYPES = {
  // 警告
  WARNING: 'warning',
  // 错误
  ERROR: 'error'
}
