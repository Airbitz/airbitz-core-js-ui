import { asArray, asJSON, asObject, asOptional, asString } from 'cleaners'
import { makeReactNativeDisklet } from 'disklet'
import { EdgeAccount } from 'edge-core-js'
import { NativeModules, Platform } from 'react-native'

const { AbcCoreJsUi } = NativeModules
const disklet = makeReactNativeDisklet()

type BiometryType = 'Fingerprint' | 'TouchID' | 'FaceID'

function createKeyWithUsername(username) {
  return username + '___key_loginkey'
}

const asFingerprintFile = asJSON(
  asObject({
    enabledUsers: asOptional(asArray(asString), []),
    disabledUsers: asOptional(asArray(asString), [])
  })
)
type FingerprintFile = ReturnType<typeof asFingerprintFile>

export async function isTouchEnabled(username: string): Promise<boolean> {
  const file = await loadFingerprintFile()
  const supported = await supportsTouchId()

  return supported && file.enabledUsers.includes(username)
}

export async function isTouchDisabled(username: string): Promise<boolean> {
  const file = await loadFingerprintFile()
  const supported = await supportsTouchId()

  return !supported || file.disabledUsers.includes(username)
}

export async function supportsTouchId(): Promise<boolean> {
  if (!AbcCoreJsUi) {
    console.warn('AbcCoreJsUi  is unavailable')
    return false
  }
  const out = await AbcCoreJsUi.supportsTouchId()
  return !!out
}

export async function enableTouchId(account: EdgeAccount): Promise<void> {
  const file = await loadFingerprintFile()
  const supported = await supportsTouchId()
  if (!supported) throw new Error('TouchIdNotSupportedError')

  const { username, loginKey } = account
  const loginKeyKey = createKeyWithUsername(username)
  await AbcCoreJsUi.setKeychainString(loginKey, loginKeyKey)

  // Update the file:
  if (!file.enabledUsers.includes(username)) {
    file.enabledUsers = [...file.enabledUsers, username]
  }
  if (file.disabledUsers.includes(username)) {
    file.disabledUsers = file.disabledUsers.filter(item => item !== username)
  }
  saveFingerprintFile(file)
}

export async function disableTouchId(account: EdgeAccount): Promise<void> {
  const file = await loadFingerprintFile()
  const supported = await supportsTouchId()
  if (!supported) return // throw new Error('TouchIdNotSupportedError')

  const { username } = account
  const loginKeyKey = createKeyWithUsername(username)
  await AbcCoreJsUi.clearKeychain(loginKeyKey)

  // Update the file:
  if (!file.disabledUsers.includes(username)) {
    file.disabledUsers = [...file.disabledUsers, username]
  }
  if (file.enabledUsers.includes(username)) {
    file.enabledUsers = file.enabledUsers.filter(item => item !== username)
  }
  await saveFingerprintFile(file)
}

export async function getSupportedBiometryType(): Promise<BiometryType | null> {
  try {
    const biometryType = await AbcCoreJsUi.getSupportedBiometryType()
    if (biometryType) {
      return biometryType
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

/**
 * Looks up the stored biometric secret for a user.
 * Returns undefined if there is no secret, or if the user denies the request.
 */
export async function getLoginKey(
  username: string,
  promptString: string,
  fallbackString: string
): Promise<string | undefined> {
  const file = await loadFingerprintFile()
  const supported = await supportsTouchId()
  if (
    !supported ||
    !file.enabledUsers.includes(username) ||
    file.disabledUsers.includes(username)
  ) {
    return
  }

  const loginKeyKey = createKeyWithUsername(username)
  if (Platform.OS === 'ios') {
    const loginKey = await AbcCoreJsUi.getKeychainString(loginKeyKey)
    if (typeof loginKey !== 'string' || loginKey.length <= 10) {
      console.log('No valid loginKey for TouchID')
      return
    }

    console.log('loginKey valid. Launching TouchID modal...')
    const success = await AbcCoreJsUi.authenticateTouchID(
      promptString,
      fallbackString
    )
    if (success) return loginKey
    console.log('Failed to authenticate TouchID')
  } else if (Platform.OS === 'android') {
    return AbcCoreJsUi.getKeychainStringWithFingerprint(
      loginKeyKey,
      promptString
    ).catch(error => console.log(error)) // showError?
  }
}

export async function loadFingerprintFile(): Promise<FingerprintFile> {
  try {
    const json = await disklet.getText('fingerprint.json')
    return asFingerprintFile(json)
  } catch (error) {
    return { enabledUsers: [], disabledUsers: [] }
  }
}

async function saveFingerprintFile(file: FingerprintFile): Promise<void> {
  const text = JSON.stringify(file)
  await disklet.setText('fingerprint.json', text)
}
