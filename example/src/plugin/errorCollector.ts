import ErrorCollector from '@monitor/collector-error'
import Vue from 'vue'

const errorCollector = new ErrorCollector.Collector('xxx', { debug: true, Vue })

// window.addEventListener('unhandledrejection', function(e) {
//   e.preventDefault()
//   console.log('我知道 promise 的错误了')
//   console.log(e.reason)
//   return true
// })
// Promise.reject('promise error')
