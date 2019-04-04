/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:40:56
 * @Last Modified by: suliyu
 * @Last Modified time: 2018-08-30 22:50:13
 */
import Brower, {
  BrowerCollector,
  IBrowerConfig
} from '@monitor/collector-brower'
import Error, { ErrorCollector, IErrorConfig } from '@monitor/collector-error'
import Event, { EventCollector, IEventConfig } from '@monitor/collector-track'
import { extend } from '@stark/utils/lib/methods/object'

interface IConfig extends IBrowerConfig, IErrorConfig, IEventConfig {
  // 是否开启事件采集模块
  event?: boolean
  // 是否开启错误采集模块
  error?: boolean
  // 是否开启所有模块
  open?: boolean
}
export class Engine {
  public browerCollector!: BrowerCollector
  public errorCollector!: ErrorCollector
  public eventCollector!: EventCollector
  public config: IConfig = {
    eventUrl: '',
    errorUrl: '',
    // 是否开启事件采集模块
    event: true,
    // 是否开启错误采集模块
    error: true,
    // 是否开启所有模块
    open: true
  }
  constructor(token: string, config?: IConfig) {
    this.config = extend({}, this.config, config)
    if (!this.config.open) {
      return
    }
    this.browerCollector = new Brower.Collector(token, this.config)
    if (this.config.event) {
      this.eventCollector = new Event.Collector(token, this.config)
    }
    if (this.config.error) {
      this.errorCollector = new Error.Collector(token, this.config)
    }
  }
}
