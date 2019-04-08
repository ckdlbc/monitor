## 引擎主模块 @monitor/engine

所有监控模块的开关，也可以选择性使用其中某些模块。此模块包含事件采集模块、错误采集模块、客户端数据采集模块。引入该模块后，可以用非常简单的方式开启引擎的所有模块。

### 快速上手

```js
import Monitor from '@monitor/ngine'

const monitor = new Monitor('token', {})
```

### 手动埋点 - 需开启事件采集模块

```js
// 使用函数调用
import { trackEvent } from '@monitor/engine'
trackEvent('buy', { price: '123' })

// 使用装饰器调用
import { trackEvent } from '@monitor/collector-event'
@Component
export default class HelloWorld extends Vue {
  price = '123'
  @trackEvent('btnClick', vm => {
    price: vm.price
  })
  onClick() {
    // 业务逻辑
  }
}
```

### 手动上报错误 - 需开启错误采集模块

```js
// 使用引入调用
import { notifyError } from '@monitor/engine'
notifyError('xxxError', {})

// 使用Vue原型调用
@Component
export default class HelloWorld extends Vue {
  onClick() {
    // 业务逻辑
    this.$notifyError('xxxError', {})
  }
}
```

### API

```js
constructor(token: string, config?: IConfig){}

// 注意：配置名相同，意味着此项配置在模块间通用
type IConfig = {
  /** 以下为 主模块 配置 **/
  // 是否开启 事件采集模块
  event?: boolean
  // 是否开启 错误采集模块
  error?: boolean

  /** 以下为 数据采集模块 配置 **/
  // 前端框架router实例
  router?: any
  // 会话超时时长，单位分钟 (默认值：30)
  sessionIntervalMins?: number

  /** 以下为 事件采集模块 配置 **/
  // 用户id
  uid?: () => string
  // 上报服务器的请求URL
  eventUrl: string
  // 是否启用调试模式 (默认值：false)
  debug?: boolean
  // 上报数据实现形式  (默认值：post)
  eventMethod?: string
  // 前端框架router实例
  router?: any
  // Vue构造器，用于对接Vue.config.errorHandler
  Vue?: any

  /** 以下为 错误采集模块 配置 **/
  // 用户id
  uid?: () => string
  // 是否启用调试模式 (默认值：false)
  debug?: boolean
  // 上报服务器的请求URL
  errorUrl: string
  // 上报数据实现形式  (默认值：post)
  errorMethod?: string
  // 前端框架router实例
  router?: any
  // Vue构造器，用于对接Vue.config.errorHandler
  Vue?: any
}
```

## 事件采集模块 @monitor/collector-track

又名全埋点采集模块，自动上报会话、pv 埋点信息，同时支持开发者手动埋点。

### 快速上手

```js
import EventCollector from '@monitor/collector-event'

const event = new EventCollector.Collector('token', {})
```

### 手动埋点

```js
// 使用函数调用
import { trackEvent } from '@monitor/collector-event'
trackEvent('buy', { price: '123' })

// 使用装饰器调用
import { trackEvent } from '@monitor/collector-event'
@Component
export default class HelloWorld extends Vue {
  price = '123'
  @trackEvent('btnClick', vm => {
    price: vm.price
  })
  onClick() {
    // 业务逻辑
  }
}
```

### API

```js
constructor(token: string, config?: IEventConfig) {}

type IEventConfig = {
  // 用户id
  uid?: () => string
  // 上报服务器的请求URL
  eventUrl: string
  // 是否启用调试模式 (默认值：false)
  debug?: boolean
  // 上报数据实现形式  (默认值：post)
  eventMethod?: string
  // 前端框架router实例
  router?: any
  // Vue构造器，用于对接Vue.config.errorHandler
  Vue?: any
}
```

### 上报的事件数据

```js
{
  // 自定义数据
  ext:{}

  // 客户端数据采集模块的上报数据
  sys:{...}
}
```

## 错误采集模块 @monitor/collector-error

自动监控并上报 JavaScript 执行错误、资源加载错误、HTTP 请求错误、Promise Reject 错误，同时支持开发者手动上报错误。

### 快速上手

```js
import ErrorCollector from '@monitor/collector-error'

const err = new ErrorCollector.Collector('token', {})
```

### 手动上报错误

```js
// 使用引入调用
import { notifyError } from '@monitor/collector-error'
notifyError('xxxError', {})

// 使用Vue原型调用
@Component
export default class HelloWorld extends Vue {
  onClick() {
    // 业务逻辑
    this.$notifyError('xxxError', {})
  }
}
```

### API

```js
constructor(token: string, config?: IErrorConfig) {}

type IEventConfig = {
  // 上报服务器的请求URL
  errorUrl: string
  // 用户clientId
  uid?: () => string
  // 是否启用调试模式 (默认值：false)
  debug?: boolean
  // 上报数据实现形式  (默认值：post)
  errorMethod?: string
  // 前端框架router实例
  router?: any
  // Vue构造器，用于对接Vue.config.errorHandler
  Vue?: any
}
```

### 上报的错误数据

```js
{
  // 自定义数据
  ext:{}

  // 客户端数据采集模块的上报数据
  sys:{...}

  // 错误数据
  err:{
    /** 错误类型 ** /
    // uncaught 自动捕获的 js 错误
    // resourceError 自动捕获的资源加载错误
    // httpError 自动捕获的请求错误
    // caught 手动发送的错误
    // unhandledrejection 未 catch 处理的 Promise 错误
    errorType:string

    // 错误信息
    info:{
      // 错误名称
      name:string

      /** js 错误 ** /
      // 错误描述信息
      message:string
      // 出错的文件
      fileName:string
      // 出错代码的行号
      lineNumber:number
      // 出错代码的列号
      columnNumber:number
      // 堆栈跟踪
      stacktrace:string
      // 严重程度 warning、error
      severity: string
      // 框架信息
      metaData:{
        componentName:string
        info:string
        propsData:any
      }

      /** 资源加载错误 ** /
      // dom节点
      outerHTML:string
      // 错误资源的url
      src:string
      // dom类型
      tagName:string
      // dom id
      id:string
      // dom name
      name:string
      // dom className
      className:string
      // dom路径
      XPath:string
      // dom选择器路径
      selector: string
      // 一个毫秒时间戳，表示事件发生的时间。它是相对于网页加载成功开始计算的
      timeStamp:number
      // 状态码
      status:number
      // 状态信息
      statusText:string

      /** http请求错误 ** /
      req:{
        // 请求类型
        method:string
        // 请求url
        url:string
      }
      res:{
        // 状态码
        status:number
        // 状态信息
        statusText:string
        // 请求返回的结果
        response:string
      }
    }
}
```

## 客户端数据采集模块 @monitor/collector-brower

自动分析前端路由、框架，并采集用户客户端的设备信息、浏览器信息、会话信息。内含有 session 会话监听机制、路由监听机制、框架路由分析机制。

### 快速上手

```js
import BrowerCollector from '@monitor/collector-brower'

const brower = new BrowerCollector.Collector('token', {})
```

### API

```js
constructor(token: string, config?: IBrowerConfig) {}

type IEventConfig = {
  // 前端框架router实例
  router?: any
  // 会话超时时长，单位分钟 (默认值：30)
  sessionIntervalMins?: number
}
```

### 上报的数据

```js
sys: {
  // 引入的 sdk 版本
  sdkVersion: string
  // 当前上报事件用户触发的时间戳
  time: number
  // 用户首次访问网站时间戳
  persistedTime: number
  // 本地唯一标记，可理解为设备 id
  deviceId: any
  // 网页打开场景：浏览器、APP
  pageOpenScene: string
  // 上报数据凭证（通过它来归类数据）
  token: any
  // 当前会话的 id
  sessionUuid: any
  // 设备型号
  deviceModel: string | undefined
  // 客户端操作系统
  deviceOs: any
  // 客户端操作系统版本
  deviceOsVersion: string
  // 客户端平台：桌面、安卓、ios
  devicePlatform: string
  // 浏览器
  browser: any
  // 浏览器版本
  browserVersion: any
  // 当前访问页面的标题
  title: string
  // 当前访问页面的路径
  urlPath: string
  // 当前访问页面的 url
  currentUrl: string
  // 当前访问页面的域名
  currentDomain: string
  // 上一页 url：来源页 url
  referrer: string
  // 上一页域名：来源页域名
  referringDomain: string
  // 本地客户端语言
  language: string
  // 本地客户端屏幕宽度，单位像素
  screenWidth: string | number
  // 本地客户端屏幕高度，单位像素
  screenHeight: string | number
  // 当前页停留时间
  currentStayTime: number
  // 上一页停留时间
  previousStayTime: number
  // 当前页进入时间
  entryTime: number
  // 用户 clientId
  uid: string
  // 上一页 url
  parentUrl: string
}
```
