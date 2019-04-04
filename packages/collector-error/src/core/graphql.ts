import { isFunction } from '@stark/utils/lib/basicType/isFunction'
import { ERROR_TYPES } from '../config/error'
import cache from './cache'

const unhandleRejectionErrorMutation = `mutation CreateUnhandledRejectionError($input: createUnhandledRejectionErrorInput!) {
  createUnhandledRejectionError(unhandledRejectionError: $input) {
    id
    RequestID
    Status
    errorMsg
    errorCode
  }
}
`

const resourceErrorMutation = `mutation CreateResourceError($input: createResourceErrorInput!) {
  createResourceError(resourceError: $input) {
    id
    RequestID
    Status
    errorMsg
    errorCode
  }
}`

const uncaughtErrorMutation = `mutation CreateUncaughtError($input: createUncaughtErrorInput!) {
  createUncaughtError(uncaughtError: $input) {
    id
    RequestID
    Status
    errorMsg
    errorCode
  }
}
`

const caughtErrorMutation = `mutation CreateCaughtError($input:createCaughtErrorInput!){
  createCaughtError(caughtError:$input){
    id
   RequestID
    Status
    errorMsg
    errorCode
  }
}
`

const httpErrorMutation = `mutation CreateHttpError($input: createHttpErrorInput!) {
  createHttpError(httpError: $input) {
    id
    RequestID
    Status
    errorMsg
   errorCode
  }
}`

const sendRequest = (
  url: string,
  errorType: string,
  data: any,
  callback?: () => void
) => {
  cache.log.group('上报错误')
  cache.log.error('错误动作：', data.err.errorType)
  cache.log.error('错误数据：', data)
  cache.log.groupEnd()
  let query = ''
  switch (errorType) {
    case ERROR_TYPES.CAUGHT:
      query = caughtErrorMutation
      break
    case ERROR_TYPES.HTTP_ERROR:
      query = httpErrorMutation
      break
    case ERROR_TYPES.RESOURCE_ERROR:
      query = resourceErrorMutation
      break
    case ERROR_TYPES.UNCAUGHT:
      query = uncaughtErrorMutation
      break
    case ERROR_TYPES.UNHANDLEDREJECTION:
      query = unhandleRejectionErrorMutation
      break
  }
  window
    .fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          input: data
        }
      })
    })
    .then(r => {
      if (callback && isFunction(callback)) {
        callback()
      }
    })
    .catch(err => {
      console.log(err)
    })
}
export default sendRequest
