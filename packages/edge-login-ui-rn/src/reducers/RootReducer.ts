import { EdgeAccount } from 'edge-core-js'
import { combineReducers } from 'redux'

import { Action } from '../types/ReduxTypes'
import { create, CreateState } from './CreateUserReducer'
import { login, LoginState } from './LoginReducer'
import {
  passwordRecovery,
  PasswordRecoveryState
} from './PasswordRecoveryReducer'
import { passwordStatus, PasswordStatusState } from './PasswordStatusReducer'
import { previousUsers, PreviousUsersState } from './PreviousUsersReducer'
import { workflow, WorkflowState } from './WorkflowReducer'

export interface RootState {
  create: CreateState
  login: LoginState
  passwordRecovery: PasswordRecoveryState
  passwordStatus: PasswordStatusState | null
  previousUsers: PreviousUsersState
  workflow: WorkflowState

  // Local reducers:
  readonly account: EdgeAccount | null
  readonly touch: 'FaceID' | 'TouchID' | false
}

export const rootReducer: (
  state: RootState | undefined,
  action: Action
) => RootState = combineReducers({
  create,
  login,
  passwordRecovery,
  passwordStatus,
  previousUsers,
  workflow,

  account(
    state: EdgeAccount | null = null,
    action: Action
  ): EdgeAccount | null {
    switch (action.type) {
      case 'CREATE_ACCOUNT_SUCCESS':
        return action.data
      case 'START_CHANGE_PASSWORD':
      case 'START_CHANGE_PIN':
      case 'START_RESECURE':
      case 'START_SECURITY_ALERT':
        return action.data
      case 'START_CHANGE_RECOVERY':
      case 'START_OTP_REPAIR':
        return action.data.account
    }
    return state
  },

  touch(state = false, action: Action) {
    return action.type === 'SET_TOUCH' ? action.data : state
  }
})
