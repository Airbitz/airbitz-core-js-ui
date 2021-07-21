import { EdgeFetchOptions } from 'edge-core-js'
import { NativeModules, Platform } from 'react-native'

const { AbcCoreJsUi } = NativeModules

// TODO: Remove this hack! Pass via io object in Core
if (Platform.OS === 'android' && AbcCoreJsUi.fetch) {
  global.androidFetch = async (url: string, options: EdgeFetchOptions) => {
    const { method, body, headers = {} } = options

    const result = await AbcCoreJsUi.fetch(
      url,
      method,
      body,
      Object.keys(headers).map(h => `${h}______${headers[h]}`)
    )
    return result
  }
}
