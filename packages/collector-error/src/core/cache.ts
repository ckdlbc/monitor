/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:40:24
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:51:01
 */
import { BrowerCollector, Monitor } from '@monitor/collector-brower'
import { Log } from '@stark/console'

export class Cache {
  // 是否已实例化
  public loaded: boolean = false
  // 实例配置
  public config: { [key: string]: any } = {}
  // 数据收集者实例
  public collector!: BrowerCollector
  // 全局事件监听者实例
  public monitor!: Monitor
  // 存储数据实例
  public storage!: any
  // 日志
  public log!: Log
}

export default new Cache()
