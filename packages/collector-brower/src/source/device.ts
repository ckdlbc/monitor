/*
 * @Author: suliyu 
 * @Date: 2018-08-29 21:40:03 
 * @Last Modified by:   suliyu 
 * @Last Modified time: 2018-08-29 21:40:03 
 */

/************************ 私有工具函数 ************************/

function find(needle: string) {
  return userAgent.indexOf(needle) !== -1
}

// 用于获取类型，操作系统或方向的当前值的公共函数
function findMatch(arr: string[]) {
  for (let i = 0; i < arr.length; i++) {
    if ((device as any)[arr[i]]()) {
      return arr[i]
    }
  }
  return 'unknown'
}

// 横竖屏更新调整
function setOrientationCache() {
  device.orientation = findMatch(['portrait', 'landscape'])
  return findMatch(['portrait', 'landscape'])
}

/************************ 全局变量 ************************/

// 先前设备的信息
const previousDevice = (window as any).device

/**
 * 客户端用户代理字符串
 * 小写，所以我们可以使用效率更高的indexOf()，而不是Regex
 */
const userAgent = window.navigator.userAgent.toLowerCase()

/************************ 设备判断 ************************/

// 苹果
const macos = () => find('mac')
const ios = () => iphone() || ipod() || ipad()
const iphone = () => !windows() && find('iphone')
const ipod = () => find('ipod')
const ipad = () => find('ipad')

// 安卓
const android = () => !windows() && find('android')
const androidPhone = () => android() && find('mobile')
const androidTablet = () => android() && !find('mobile')

// 黑莓
const blackberry = () => find('blackberry') || find('bb10') || find('rim')
const blackberryPhone = () => blackberry() && !find('tablet')
const blackberryTablet = () => blackberry() && find('tablet')

// 微软
const windows = () => find('windows')
const windowsPhone = () => windows() && find('phone')
const windowsTablet = () => windows() && find('touch') && !windowsPhone()

// 思科
const fxos = () => (find('(mobile') || find('(tablet')) && find(' rv:')
const fxosPhone = () => fxos() && find('mobile')
const fxosTablet = () => fxos() && find('tablet')

// 其它
const meego = () => find('meego')
const cordova = () => (window as any).cordova && location.protocol === 'file:'
const nodeWebkit = () => typeof (window as any).process === 'object'
const mobile = () =>
  androidPhone() ||
  iphone() ||
  ipod() ||
  windowsPhone() ||
  blackberryPhone() ||
  fxosPhone() ||
  meego()
const tablet = () =>
  ipad() ||
  androidTablet() ||
  blackberryTablet() ||
  windowsTablet() ||
  fxosTablet()
const desktop = () => !tablet() && !mobile()

// 可检测的电视设备
const televisionList = [
  'googletv',
  'viera',
  'smarttv',
  'internet.tv',
  'netcast',
  'nettv',
  'appletv',
  'boxee',
  'kylo',
  'roku',
  'dlnadoc',
  'roku',
  'pov_tv',
  'hbbtv',
  'ce-html'
]
const television = () => {
  let i = 0
  while (i < televisionList.length) {
    if (find(televisionList[i])) {
      return true
    }
    i++
  }
  return false
}

// 竖屏-屏幕比例
const portrait = () => {
  if (
    'orientation' in window.screen &&
    Object.prototype.hasOwnProperty.call(window, 'onorientationchange')
  ) {
    return (window.screen as any).orientation.type.includes('portrait')
  }
  return window.innerHeight / window.innerWidth > 1
}

// 横屏-屏幕比例
const landscape = () => {
  if (
    'orientation' in window.screen &&
    Object.prototype.hasOwnProperty.call(window, 'onorientationchange')
  ) {
    return (window.screen as any).orientation.type.includes('landscape')
  }
  return window.innerHeight / window.innerWidth < 1
}

/**
 * 在noConflict模式下运行device.js，
 * 将先前设备的参数赋值给当前设备
 */
const noConflict = () => {
  ;(window as any).device = previousDevice
  return window
}

let device = {
  macos,
  ios,
  iphone,
  ipod,
  ipad,
  android,
  androidPhone,
  androidTablet,
  blackberry,
  blackberryPhone,
  blackberryTablet,
  windows,
  windowsPhone,
  windowsTablet,
  fxos,
  fxosPhone,
  fxosTablet,
  meego,
  cordova,
  nodeWebkit,
  mobile,
  tablet,
  desktop,
  television,
  portrait,
  landscape,
  noConflict,
  type: '',
  os: '',
  orientation: ''
}

// 当前设备类型
const type = findMatch(['mobile', 'tablet', 'desktop'])

// 当前设备系统
const os = findMatch([
  'ios',
  'iphone',
  'ipad',
  'ipod',
  'android',
  'blackberry',
  'windows',
  'fxos',
  'meego',
  'television'
])

// 当前设备是横屏 或 竖屏
const orientation = setOrientationCache()

device = { ...device, type, os, orientation }

export default device
