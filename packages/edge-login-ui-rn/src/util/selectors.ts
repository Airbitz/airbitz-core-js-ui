import { EdgeAccount } from 'edge-core-js'

import { RootState } from '../reducers/RootReducer'

export function getAccount(state: RootState): EdgeAccount {
  const { account } = state
  if (account == null) {
    throw new TypeError('The login redux has no EdgeAccount.')
  }
  return account
}
