/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:40:00
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 19:44:15
 */
import { isString } from '@stark/utils/lib/basicType/isString'
import { trim } from '@stark/utils/lib/methods/string'
import device from './device'
import detector from './userAgent'
import win from './win'

// 域
export const domain = (referrer: string) => {
  if (!isString(referrer)) {
    return ''
  }
  const split = referrer.split('/')
  if (split.length >= 3) {
    return split[2]
  }
  return ''
}

// 设备型号
export const deviceModelFn = () => {
  let deviceModel = ''
  if (device.android()) {
    const sss = win.navigator.userAgent.split(';')
    const i = sss.indexOf('Build/')
    if (i > -1) {
      deviceModel = sss[i].substring(0, sss[i].indexOf('Build/'))
    }
  } else if (device.ios()) {
    if (device.iphone()) {
      deviceModel = 'iPhone'
    }
  }
  return deviceModel
}

// 基本参数
export const getClientInfo = () => {
  const windowsOs: { [key: string]: string } = {
    '5.0': 'Win2000',
    '5.1': 'WinXP',
    '5.2': 'Win2003',
    '6.0': 'WindowsVista',
    '6.1': 'Win7',
    '6.2': 'Win8',
    '6.3': 'Win8.1',
    '10.0': 'Win10'
  }
  const devicePlatform = device.type
  const deviceModel = trim(deviceModelFn())
  const isWindows = device.windows()
  let deviceOsVersion = detector.os.name + ' ' + detector.os.fullVersion
  if (isWindows) {
    if (windowsOs[detector.os.fullVersion]) {
      deviceOsVersion = windowsOs[detector.os.fullVersion]
    }
  }
  return {
    // 设备型号
    deviceModel,
    // 操作系统
    deviceOs: detector.os.name,
    // 操作系统版本
    deviceOsVersion,
    // 设备平台
    devicePlatform,
    // 浏览器名称
    browser: detector.browser.name,
    // 浏览器版本
    browserVersion: detector.browser.fullVersion,
    // 页面标题
    title: win.document.title || '',
    // 页面路径
    urlPath: win.location.pathname || '',
    // 域名
    currentDomain: domain(document.URL),
    // referrer 数据来源
    referrer: win.document.referrer,
    // referrer 域名
    referringDomain: domain(win.document.referrer),
    // 本地语言
    language: win.navigator.language || '',
    // 客户端分辨率 width
    screenWidth: win.screen.width,
    // 客户端分辨率 height
    screenHeight: win.screen.height
  }
}

export default {}
