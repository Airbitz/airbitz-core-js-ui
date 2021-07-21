import { EdgeAccount, EdgeAccountOptions, EdgeContext } from 'edge-core-js'

import { RootState } from '../reducers/RootReducer'
import { Action } from './ReduxActions'

export type { Action, RootState }

export interface TouchIdInfo {
  isTouchSupported: boolean
  isTouchEnabled: boolean
}

export type OnLogin = (account: EdgeAccount, touchIdInfo?: TouchIdInfo) => void

export interface Imports {
  readonly accountOptions: EdgeAccountOptions
  readonly context: EdgeContext
  readonly onComplete: () => void
  readonly onLogin?: OnLogin
  readonly recoveryKey?: string
  readonly skipSecurityAlerts?: boolean
  readonly username?: string | null
  readonly customPermissionsFunction?: () => void
}

export type GetState = () => RootState
export type Dispatch = <Return>(
  action:
    | Action
    | ((dispatch: Dispatch, getState: GetState, i: Imports) => Return)
) => Return
