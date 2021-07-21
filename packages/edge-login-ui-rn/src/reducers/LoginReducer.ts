import { OtpError } from 'edge-core-js'

import { Action } from '../types/ReduxTypes'
import { LoginAttempt } from '../util/loginAttempt'

export interface LoginState {
  readonly errorMessage: string | null
  readonly isLoggingInWithPin: boolean
  readonly loginSuccess: boolean
  readonly otpAttempt: LoginAttempt | null
  readonly otpError: OtpError | null
  readonly otpResetDate?: Date
  readonly pin: string | null
  readonly username: string
  readonly wait: number
}

const initialState: LoginState = {
  errorMessage: null,
  isLoggingInWithPin: false,
  loginSuccess: false,
  otpAttempt: null,
  otpError: null,
  pin: null,
  username: '',
  wait: 0
}

export function login(
  state: LoginState = initialState,
  action: Action
): LoginState {
  switch (action.type) {
    case 'SET_PREVIOUS_USERS': {
      const { startupUser } = action.data
      if (startupUser != null) {
        return { ...state, username: startupUser.username }
      }
      return state
    }
    case 'AUTH_UPDATE_USERNAME':
      return { ...state, username: action.data, errorMessage: null, wait: 0 }
    case 'UPDATE_WAIT_TIMER':
      return { ...state, wait: action.data.seconds }
    case 'AUTH_UPDATE_PIN':
      return { ...state, pin: action.data, errorMessage: null }
    case 'LOGIN_SUCCEESS':
      return {
        ...state,
        loginSuccess: true,
        isLoggingInWithPin: false,
        errorMessage: null,
        wait: 0
      }
    case 'LOGIN_PIN_FAIL':
      return {
        ...state,
        errorMessage: action.data.message,
        wait: action.data.wait,
        pin: '',
        isLoggingInWithPin: false
      }
    case 'AUTH_LOGGING_IN_WITH_PIN':
      return { ...state, isLoggingInWithPin: true }
    case 'OTP_ERROR':
      return {
        ...state,
        otpAttempt: action.data.attempt,
        otpError: action.data.error,
        otpResetDate: action.data.error.resetDate
      }
    case 'START_OTP_REPAIR':
      return {
        ...state,
        otpError: action.data.error,
        otpResetDate: action.data.error.resetDate
      }
    case 'OTP_RESET_REQUEST':
      return {
        ...state,
        otpResetDate: action.data
      }
    case 'RESET_APP': {
      const username = state.username
      return { ...initialState, username: username }
    }

    // Actions for launching screens:
    case 'START_RECOVERY_LOGIN':
      return {
        ...state,
        username: action.data.username,
        errorMessage: null,
        wait: 0
      }

    default:
      return state
  }
}
