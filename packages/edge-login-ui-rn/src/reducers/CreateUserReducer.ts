import { EdgePasswordRules } from 'edge-core-js'

import { Action } from '../types/ReduxTypes'

export interface CreateState {
  readonly confirmPassword: string | null
  readonly confirmPasswordErrorMessage: string | null
  readonly createErrorMessage: string | null
  readonly createPasswordErrorMessage: string | null
  readonly password: string | null
  readonly passwordStatus: EdgePasswordRules | null
  readonly pin: string
  readonly pinError: string
  readonly pinErrorMessage: string | null
  readonly username: string | null
  readonly usernameErrorMessage: string | null
}

const initialState: CreateState = {
  username: null,
  password: null,
  confirmPassword: null,
  pin: '',
  pinError: '',
  passwordStatus: null,
  createPasswordErrorMessage: null,
  confirmPasswordErrorMessage: null,
  pinErrorMessage: null,
  usernameErrorMessage: null,
  createErrorMessage: null
}

export function create(
  state: CreateState = initialState,
  action: Action
): CreateState {
  switch (action.type) {
    case 'CREATE_ACCOUNT_FAIL':
      return { ...state, createErrorMessage: action.data }
    case 'CLEAR_CREATE_ERROR_MESSAGE':
      return { ...state, createErrorMessage: null }
    case 'CREATE_UPDATE_USERNAME':
      return {
        ...state,
        username: action.data.username,
        usernameErrorMessage: action.data.error
      }
    case 'CREATE_UPDATE_PIN':
      return {
        ...state,
        pin: action.data.pin,
        pinErrorMessage: action.data.error
      }
    case 'AUTH_UPDATE_PASSWORD':
      return {
        ...state,
        password: action.data.password,
        passwordStatus: action.data.passwordStatus,
        createPasswordErrorMessage: action.data.error
      }
    case 'AUTH_UPDATE_CONFIRM_PASSWORD':
      return {
        ...state,
        confirmPassword: action.data.password,
        confirmPasswordErrorMessage: action.data.error
      }
    case 'RESET_APP':
      return initialState
    default:
      return state
  }
}
