/*
 * @Author: suliyu 
 * @Date: 2018-08-29 21:40:08 
 * @Last Modified by:   suliyu 
 * @Last Modified time: 2018-08-29 21:40:08 
 */
const win =
  typeof window !== 'undefined'
    ? window
    : {
        external: false,
        navigator: {
          userAgent: '',
          language: '',
          appVersion: '',
          vendor: ''
        },
        location: {
          pathname: '',
          href: ''
        },
        document: {
          URL: '',
          title: '',
          referrer: ''
        },
        screen: {
          width: '',
          height: ''
        }
      }

export default win
