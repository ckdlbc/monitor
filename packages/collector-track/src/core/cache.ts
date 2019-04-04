import { BrowerCollector, Monitor } from '@monitor/collector-brower'
import { Log } from '@stark/console'
import { Collector as EventCollector } from './collector'

export class Cache {
  // pio是否已实例化
  public loaded: boolean = false
  // Track实例
  public instance!: EventCollector
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
