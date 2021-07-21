import { asArray, asJSON, asObject, asString } from 'cleaners'
import { makeReactNativeDisklet } from 'disklet'

import { loadFingerprintFile, supportsTouchId } from '../keychain'
import {
  LoginUserInfo,
  PreviousUsersState
} from '../reducers/PreviousUsersReducer'
import { Dispatch, GetState, Imports } from '../types/ReduxTypes'

const disklet = makeReactNativeDisklet()

/**
 * Load the user list from core & disk into redux.
 */
export const getPreviousUsers = () => async (
  dispatch: Dispatch,
  getState: GetState,
  imports: Imports
): Promise<void> => {
  const { context } = imports

  // Load disk information:
  const lastUsernames: string[] = await getRecentUsers()
  const fingerprintFile = await loadFingerprintFile()
  const touchSupported: boolean = await supportsTouchId()

  // Figure out which users have biometric logins:
  const coreUsers: LoginUserInfo[] = []
  for (const userInfo of context.localUsers) {
    const { username, pinLoginEnabled, keyLoginEnabled = true } = userInfo
    const touchEnabled =
      keyLoginEnabled &&
      touchSupported &&
      fingerprintFile.enabledUsers.includes(username)
    coreUsers.push({ username, pinEnabled: pinLoginEnabled, touchEnabled })
  }

  // Move the top three users to their own list:
  const topUsers: LoginUserInfo[] = []
  for (const username of lastUsernames.slice(0, 3)) {
    for (let i = 0; i < coreUsers.length; ++i) {
      if (coreUsers[i].username === username) {
        topUsers.push(coreUsers[i])
        coreUsers.splice(i, 1)
        break
      }
    }
  }
  const userList: LoginUserInfo[] = [...topUsers, ...sortUsers(coreUsers)]

  // Try to find the user requested by the LoginScreen props:
  const requestedUser = userList.find(
    user => user.username === imports.username
  )

  // Dispatch to redux:
  const data: PreviousUsersState = {
    loaded: true,
    startupUser: requestedUser != null ? requestedUser : userList[0],
    userList,
    usernameOnlyList: userList.map(userInfo => userInfo.username)
  }
  dispatch({ type: 'SET_PREVIOUS_USERS', data })
}

export const setMostRecentUsers = async (username: string) => {
  const lastUsers = await getRecentUsers()

  const filteredLastUsers = lastUsers.filter(
    (lastUser: string) => lastUser !== username
  )
  return disklet.setText(
    'lastusers.json',
    JSON.stringify([username, ...filteredLastUsers])
  )
}

async function getRecentUsers(): Promise<string[]> {
  // Load the last users array:
  try {
    const lastUsernames: string[] = await disklet
      .getText('lastusers.json')
      .then(asLastUsersFile)
    return lastUsernames
  } catch (e) {}

  // Fall back on the older file:
  return await disklet
    .getText('lastuser.json')
    .then(asLastUsernameFile)
    .then(file => [file.username])
    .catch(() => [])
}

function sortUsers(users: LoginUserInfo[]): LoginUserInfo[] {
  return users.sort((a: LoginUserInfo, b: LoginUserInfo) => {
    const stringA = a.username.toUpperCase()
    const stringB = b.username.toUpperCase()
    if (stringA < stringB) {
      return -1
    }
    if (stringA > stringB) {
      return 1
    }
    return 0
  })
}

const asLastUsersFile = asJSON(asArray(asString))
const asLastUsernameFile = asJSON(
  asObject({
    username: asString
  })
)
